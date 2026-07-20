#!/bin/zsh
set -euo pipefail

SCRIPT_DIR=${0:a:h}
APP_SUPPORT="/Users/dinamargelovich/Library/Application Support/NEURO-DIV/Universal Intake"
PENDING_DIR="/Users/dinamargelovich/Library/Mobile Documents/com~apple~CloudDocs/Shortcuts/NEURO-DIV Intake/Pending"
PROCESSED_DIR="/Users/dinamargelovich/Library/Mobile Documents/com~apple~CloudDocs/Shortcuts/NEURO-DIV Intake/Processed"
ROUTER_PATH="$APP_SUPPORT/acs-universal-intake.zsh"
PLIST_PATH="/Users/dinamargelovich/Library/LaunchAgents/org.neuro-div.acs.universal-intake.plist"
BACKUP_DIR="$APP_SUPPORT/Backups/$(/bin/date -u +%Y%m%dT%H%M%SZ)"
STATE_DIR="$APP_SUPPORT/State"

mkdir -p "$APP_SUPPORT/Logs" "$PENDING_DIR" "$PROCESSED_DIR" "$BACKUP_DIR" "$STATE_DIR"
[[ -e "$PLIST_PATH" ]] && /bin/cp -p "$PLIST_PATH" "$BACKUP_DIR/"
defaults read com.apple.screencapture location > "$BACKUP_DIR/screenshot-location.txt" 2>/dev/null || print -r -- "/Users/dinamargelovich/Desktop" > "$BACKUP_DIR/screenshot-location.txt"

/bin/cp "$SCRIPT_DIR/acs-universal-intake.zsh" "$ROUTER_PATH"
/bin/chmod 700 "$ROUTER_PATH"
/usr/bin/sed -e "s|__ROUTER_PATH__|$ROUTER_PATH|g" -e "s|__PENDING_DIR__|$PENDING_DIR|g" \
  -e "s|__PROCESSED_DIR__|$PROCESSED_DIR|g" \
  -e "s|__STATE_DIR__|$STATE_DIR|g" \
  -e "s|__LOG_DIR__|$APP_SUPPORT/Logs|g" "$SCRIPT_DIR/org.neuro-div.acs.universal-intake.plist.template" > "$PLIST_PATH"
/usr/bin/plutil -lint "$PLIST_PATH"

/bin/launchctl bootout "gui/$(/usr/bin/id -u)/org.neuro-div.acs.universal-intake" 2>/dev/null || true
[[ -e "$STATE_DIR/paused" ]] && /bin/mv "$STATE_DIR/paused" "$BACKUP_DIR/paused" || true
print -r -- 0 > "$STATE_DIR/consecutive-errors"
print -r -- 0 > "$STATE_DIR/consecutive-noops"
/bin/launchctl enable "gui/$(/usr/bin/id -u)/org.neuro-div.acs.universal-intake" 2>/dev/null || true
/bin/launchctl bootstrap "gui/$(/usr/bin/id -u)" "$PLIST_PATH"
/usr/bin/defaults write com.apple.screencapture location "$PENDING_DIR"
/usr/bin/killall SystemUIServer 2>/dev/null || true
print -r -- "Installed universal intake. Backup: $BACKUP_DIR"
