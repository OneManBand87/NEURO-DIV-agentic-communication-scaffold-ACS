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
FILES=("$PENDING_DIR"/*(N-.))
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
  /usr/sbin/lsof -- "$SOURCE_FILE" >/dev/null 2>&1 && continue

  FILE_NAME=${SOURCE_FILE:t}
  EXTENSION=${FILE_NAME:e:l}
  MIME_TYPE=$(/usr/bin/file -b --mime-type -- "$SOURCE_FILE" 2>/dev/null || print -r -- "application/octet-stream")
  FILE_SIZE=$(/usr/bin/stat -f %z -- "$SOURCE_FILE") || continue
  OCCURRED_AT=$(/usr/bin/stat -f %Sm -t '%Y-%m-%dT%H:%M:%SZ' -- "$SOURCE_FILE") || continue
  SHA256=$(/usr/bin/shasum -a 256 -- "$SOURCE_FILE" | /usr/bin/awk '{print $1}') || continue

  KIND="file"
  [[ "$FILE_NAME" == Screenshot* || "$FILE_NAME" == "Screen Shot"* ]] && KIND="screenshot"
  [[ "$FILE_NAME" == "Screen Recording"* || "$EXTENSION" == "mov" ]] && KIND="screen-recording"
  [[ "$MIME_TYPE" == image/* || "$MIME_TYPE" == audio/* || "$MIME_TYPE" == video/* ]] && [[ "$KIND" == "file" ]] && KIND="media"
  [[ "$EXTENSION" == "url" || "$EXTENSION" == "webloc" ]] && KIND="url"
  [[ "$EXTENSION" == "txt" || "$EXTENSION" == "md" ]] && KIND="text"

  DATE_FOLDER=${OCCURRED_AT[1,10]}
  DEST_DIR="$PROCESSED_DIR/${DATE_FOLDER[1,4]}/${DATE_FOLDER}"
  mkdir -p "$DEST_DIR" || continue
  DEST_FILE="$DEST_DIR/$FILE_NAME"
  if [[ -e "$DEST_FILE" ]]; then
    DEST_FILE="$DEST_DIR/${FILE_NAME:r}-$SHA256[1,10].${EXTENSION}"
  fi
  SOURCE_URL=""
  CAPTURED_TEXT=""
  if [[ "$KIND" == "url" || "$KIND" == "text" ]]; then
    CAPTURED_TEXT=$(/usr/bin/head -c 20000 -- "$SOURCE_FILE" 2>/dev/null || true)
    [[ "$CAPTURED_TEXT" == http* ]] && SOURCE_URL=${CAPTURED_TEXT%%$'\n'*}
  fi

  PAYLOAD=$(/usr/bin/jq -n \
    --arg sourceId "sha256:$SHA256" --arg kind "$KIND" --arg source "apple-share-and-capture" \
    --arg title "$FILE_NAME" --arg originalFilename "$FILE_NAME" --arg contentType "$MIME_TYPE" \
    --arg sourceUrl "$SOURCE_URL" --arg capturedText "$CAPTURED_TEXT" \
    --arg device "$DEVICE_NAME" --arg sha256 "$SHA256" --arg occurredAt "$OCCURRED_AT" --argjson sizeBytes "$FILE_SIZE" \
    '{sourceId:$sourceId,projectId:"general",kind:$kind,source:$source,title:$title,originalFilename:$originalFilename,contentType:$contentType,sizeBytes:$sizeBytes,drivePath:$drivePath,device:$device,sha256:$sha256,occurredAt:$occurredAt} + (if $sourceUrl == "" then {} else {sourceUrl:$sourceUrl} end) + (if $capturedText == "" then {} else {capturedText:$capturedText} end)') || continue

  HTTP_STATUS=$(/usr/bin/curl --silent --show-error --output /dev/null --write-out '%{http_code}' \
    --request POST "$API_URL" \
    --header "OAI-Sites-Authorization: Bearer $SITE_TOKEN" \
    --header "x-acs-device-token: $DEVICE_TOKEN" \
    --header "content-type: application/json" \
    --data-binary "$PAYLOAD" 2>/dev/null || print -r -- "000")

  if [[ "$HTTP_STATUS" == "200" || "$HTTP_STATUS" == "201" ]]; then
    /bin/mv -- "$SOURCE_FILE" "$DEST_FILE" || print -r -- "$(/bin/date -u +%FT%TZ) indexed but archive move failed: $FILE_NAME" >&2
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
