#!/bin/zsh
set -u

PENDING_DIR="${ACS_INTAKE_PENDING_DIR:?Missing ACS_INTAKE_PENDING_DIR}"
PROCESSED_DIR="${ACS_INTAKE_PROCESSED_DIR:?Missing ACS_INTAKE_PROCESSED_DIR}"
API_URL="${ACS_INTAKE_API_URL:?Missing ACS_INTAKE_API_URL}"
KEYCHAIN_SERVICE="org.neuro-div.acs.universal-intake"
STATE_DIR="${ACS_INTAKE_STATE_DIR:?Missing ACS_INTAKE_STATE_DIR}"
ERROR_FILE="$STATE_DIR/consecutive-errors"
NOOP_FILE="$STATE_DIR/consecutive-noops"
PAUSE_FILE="$STATE_DIR/paused"

mkdir -p "$PENDING_DIR" "$PROCESSED_DIR" "$STATE_DIR" || exit 1
[[ -e "$PAUSE_FILE" ]] && exit 70

SITE_TOKEN=$(/usr/bin/security find-generic-password -s "$KEYCHAIN_SERVICE" -a sites-bypass -w 2>/dev/null) || exit 10
DEVICE_TOKEN=$(/usr/bin/security find-generic-password -s "$KEYCHAIN_SERVICE" -a device-token -w 2>/dev/null) || exit 11
DEVICE_NAME=$(/usr/sbin/scutil --get ComputerName 2>/dev/null || /usr/bin/hostname)
# Shortcuts can preserve a shared item's suggested path beneath the selected
# destination. Scan recursively so those items enter the same queue as direct
# screenshots and recordings. A bounded rescan covers the short interval in
# which Shortcuts creates a subfolder before it finishes writing the file.
FILES=("$@")
if (( ${#FILES} == 0 )); then
  for ATTEMPT in 1 2 3 4; do
    FILES=()
    while IFS= read -r -d '' CANDIDATE; do
      FILES+=("$CANDIDATE")
    done < <(/usr/bin/find "$PENDING_DIR" -type f -print0)
    (( ${#FILES} > 0 )) && break
    (( ATTEMPT < 4 )) && /bin/sleep 1
  done
fi
if (( ${#FILES} == 0 )); then
  NOOPS=$(( $(<"$NOOP_FILE" 2>/dev/null || print 0) + 1 ))
  print -r -- "$NOOPS" > "$NOOP_FILE"
  if (( NOOPS >= 3 )); then
    : > "$PAUSE_FILE"
    /bin/launchctl disable "gui/$(/usr/bin/id -u)/org.neuro-div.acs.universal-intake" 2>/dev/null || true
  fi
  exit 0
fi
print -r -- 0 > "$NOOP_FILE"

for SOURCE_FILE in "${FILES[@]}"; do
  [[ -f "$SOURCE_FILE" ]] || continue
  [[ "${SOURCE_FILE:t}" == .* ]] && continue
  /usr/sbin/lsof -- "$SOURCE_FILE" >/dev/null 2>&1 && continue

  FILE_NAME=${SOURCE_FILE:t}
  # A voice interpretation sidecar is processed with its matching audio so CCS
  # receives one semantically titled intake item while the original audio stays
  # authoritative. If the audio is present, defer the sidecar to that iteration.
  if [[ "$FILE_NAME" == *.ccs-intake.json ]]; then
    VOICE_BASE_PATH="${SOURCE_FILE%.ccs-intake.json}"
    VOICE_AUDIO_PRESENT=false
    for VOICE_EXTENSION in m4a caf wav mp3; do
      [[ -f "$VOICE_BASE_PATH.$VOICE_EXTENSION" ]] && VOICE_AUDIO_PRESENT=true
    done
    [[ "$VOICE_AUDIO_PRESENT" == true ]] && continue
  fi

  EXTENSION=${FILE_NAME:e:l}
  MIME_TYPE=$(/usr/bin/file -b --mime-type -- "$SOURCE_FILE" 2>/dev/null || print -r -- "application/octet-stream")
  FILE_SIZE=$(/usr/bin/stat -f %z -- "$SOURCE_FILE") || continue
  OCCURRED_AT=$(/usr/bin/stat -f %Sm -t '%Y-%m-%dT%H:%M:%SZ' -- "$SOURCE_FILE") || continue
  SHA256=$(/usr/bin/shasum -a 256 -- "$SOURCE_FILE" | /usr/bin/awk '{print $1}') || continue

  ROUTING_SOURCE="apple-share-and-capture"
  ROUTING_TITLE="$FILE_NAME"
  VOICE_SIDECAR=""
  VOICE_SIDECAR_VALID=false
  CAPTURE_ID=""
  if [[ "$FILE_NAME" =~ '^NEURO-DIV Voice Intake - ([0-9]{6})\.(m4a|caf|wav|mp3)$' ]]; then
    CAPTURE_ID="$match[1]"
    VOICE_SIDECAR="${SOURCE_FILE:r}.ccs-intake.json"
  elif [[ "$FILE_NAME" == *.ccs-intake.json ]]; then
    VOICE_SIDECAR="$SOURCE_FILE"
    CAPTURE_ID=$(/usr/bin/jq -r '.captureId // empty' -- "$VOICE_SIDECAR" 2>/dev/null || true)
  fi

  if [[ -n "$VOICE_SIDECAR" && -f "$VOICE_SIDECAR" ]] &&
     /usr/bin/jq -e '
       (.captureId | type == "string" and test("^[0-9]{6}$")) and
       (.title | type == "string") and
       (.summary | type == "string") and
       (.transcript | type == "string") and
       (.items | type == "array") and
       (.proposedActions | type == "array" and all(.[]; .reviewRequired == true)) and
       (.needsHumanReview == true) and
       (.originalAudioPreserved == true) and
       (.modelRoute == "on-device" or .modelRoute == "private-cloud-compute" or .modelRoute == "ccs" or .modelRoute == "manual")
     ' -- "$VOICE_SIDECAR" >/dev/null 2>&1; then
    VOICE_SIDECAR_VALID=true
    CAPTURE_ID=$(/usr/bin/jq -r '.captureId' -- "$VOICE_SIDECAR")
    ROUTING_TITLE=$(/usr/bin/jq -r '.title | gsub("[\\n\\r\\t]+"; " ") | gsub("  +"; " ")' -- "$VOICE_SIDECAR")
    TITLE_LENGTH=${#ROUTING_TITLE}
    TITLE_WORDS=$(print -r -- "$ROUTING_TITLE" | /usr/bin/awk '{print NF}')
    TITLE_LOWER=$(print -r -- "$ROUTING_TITLE" | /usr/bin/tr '[:upper:]' '[:lower:]')
    FIRST_SENTENCE=$(/usr/bin/jq -r '.transcript | split(".")[0] | gsub("[\\n\\r\\t]+"; " ") | gsub("  +"; " ")' -- "$VOICE_SIDECAR")
    FIRST_SENTENCE_LOWER=$(print -r -- "$FIRST_SENTENCE" | /usr/bin/tr '[:upper:]' '[:lower:]')
    if (( TITLE_LENGTH < 12 || TITLE_LENGTH > 72 || TITLE_WORDS < 4 || TITLE_WORDS > 10 )) ||
       [[ "$TITLE_LOWER" == "voice note" || "$TITLE_LOWER" == "recording" || "$TITLE_LOWER" == "new idea" || "$TITLE_LOWER" == "untitled" ||
          "$FIRST_SENTENCE_LOWER" == "$TITLE_LOWER" || "$FIRST_SENTENCE_LOWER" == "$TITLE_LOWER "* ]]; then
      ROUTING_TITLE="Review voice capture $CAPTURE_ID"
    fi
    ROUTING_SOURCE="apple-voice-intake-on-device"
  fi

  KIND="file"
  [[ "$FILE_NAME" == Screenshot* || "$FILE_NAME" == "Screen Shot"* ]] && KIND="screenshot"
  [[ "$FILE_NAME" == "Screen Recording"* || "$EXTENSION" == "mov" ]] && KIND="screen-recording"
  [[ "$MIME_TYPE" == image/* || "$MIME_TYPE" == audio/* || "$MIME_TYPE" == video/* ]] && [[ "$KIND" == "file" ]] && KIND="media"
  [[ "$EXTENSION" == "url" || "$EXTENSION" == "webloc" ]] && KIND="url"
  [[ "$EXTENSION" == "txt" || "$EXTENSION" == "md" ]] && KIND="text"
  [[ "$VOICE_SIDECAR_VALID" == true && "$VOICE_SIDECAR" == "$SOURCE_FILE" ]] && KIND="text"

  DATE_FOLDER=${OCCURRED_AT[1,10]}
  DEST_DIR="$PROCESSED_DIR/${DATE_FOLDER[1,4]}/${DATE_FOLDER}"
  mkdir -p "$DEST_DIR" || continue
  DEST_FILE="$DEST_DIR/$FILE_NAME"
  if [[ -e "$DEST_FILE" ]]; then
    DEST_FILE="$DEST_DIR/${FILE_NAME:r}-$SHA256[1,10].${EXTENSION}"
  fi
  SOURCE_URL=""
  CAPTURED_TEXT=""
  if [[ "$VOICE_SIDECAR_VALID" == true ]]; then
    CAPTURED_TEXT=$(/usr/bin/jq -c '.' -- "$VOICE_SIDECAR" 2>/dev/null | /usr/bin/head -c 20000 || true)
  elif [[ "$KIND" == "url" || "$KIND" == "text" ]]; then
    CAPTURED_TEXT=$(/usr/bin/head -c 20000 -- "$SOURCE_FILE" 2>/dev/null || true)
    [[ "$CAPTURED_TEXT" == http* ]] && SOURCE_URL=${CAPTURED_TEXT%%$'\n'*}
  fi

  PAYLOAD=$(/usr/bin/jq -n \
    --arg sourceId "sha256:$SHA256" --arg kind "$KIND" --arg source "$ROUTING_SOURCE" \
    --arg title "$ROUTING_TITLE" --arg originalFilename "$FILE_NAME" --arg contentType "$MIME_TYPE" \
    --arg sourceUrl "$SOURCE_URL" --arg capturedText "$CAPTURED_TEXT" \
    --arg device "$DEVICE_NAME" --arg sha256 "$SHA256" --arg occurredAt "$OCCURRED_AT" --argjson sizeBytes "$FILE_SIZE" \
    '{sourceId:$sourceId,projectId:"general",kind:$kind,source:$source,title:$title,originalFilename:$originalFilename,contentType:$contentType,sizeBytes:$sizeBytes,device:$device,sha256:$sha256,occurredAt:$occurredAt} + (if $sourceUrl == "" then {} else {sourceUrl:$sourceUrl} end) + (if $capturedText == "" then {} else {capturedText:$capturedText} end)') || continue

  HTTP_STATUS=$(/usr/bin/curl --silent --show-error --output /dev/null --write-out '%{http_code}' \
    --connect-timeout 10 --max-time 30 \
    --request POST "$API_URL" \
    --header "OAI-Sites-Authorization: Bearer $SITE_TOKEN" \
    --header "x-acs-device-token: $DEVICE_TOKEN" \
    --header "content-type: application/json" \
    --data-binary "$PAYLOAD" 2>/dev/null || print -r -- "000")

  if [[ "$HTTP_STATUS" == "200" || "$HTTP_STATUS" == "201" ]]; then
    /bin/mv -- "$SOURCE_FILE" "$DEST_FILE" || print -r -- "$(/bin/date -u +%FT%TZ) indexed but archive move failed: $FILE_NAME" >&2
    if [[ "$VOICE_SIDECAR_VALID" == true && "$VOICE_SIDECAR" != "$SOURCE_FILE" && -f "$VOICE_SIDECAR" ]]; then
      SIDECAR_NAME=${VOICE_SIDECAR:t}
      SIDECAR_DEST="$DEST_DIR/$SIDECAR_NAME"
      [[ -e "$SIDECAR_DEST" ]] && SIDECAR_DEST="$DEST_DIR/${SIDECAR_NAME:r}-$SHA256[1,10].json"
      /bin/mv -- "$VOICE_SIDECAR" "$SIDECAR_DEST" || print -r -- "$(/bin/date -u +%FT%TZ) interpretation indexed but archive move failed: $SIDECAR_NAME" >&2
    fi
    print -r -- 0 > "$ERROR_FILE"
  else
    print -r -- "$(/bin/date -u +%FT%TZ) intake index failed HTTP $HTTP_STATUS: $FILE_NAME" >&2
    ERRORS=$(( $(<"$ERROR_FILE" 2>/dev/null || print 0) + 1 ))
    print -r -- "$ERRORS" > "$ERROR_FILE"
    if (( ERRORS >= 2 )); then
      : > "$PAUSE_FILE"
      /bin/launchctl disable "gui/$(/usr/bin/id -u)/org.neuro-div.acs.universal-intake" 2>/dev/null || true
      exit 71
    fi
  fi
done

# Remove only empty subfolders created beneath Pending. The watched Pending
# directory itself and every non-empty directory are preserved.
for EMPTY_DIR in "$PENDING_DIR"/**/*(N/); do
  /bin/rmdir -- "$EMPTY_DIR" 2>/dev/null || true
done
