#!/bin/zsh
set -euo pipefail

SCRIPT_DIR=${0:a:h}
SOURCE_DIR="$SCRIPT_DIR/command-center-launcher"
APP_NAME="NEURO-DIV Command Center.app"
INSTALL_DIR="/Users/dinamargelovich/Applications"
APP_PATH="$INSTALL_DIR/$APP_NAME"
DESKTOP_LINK="/Users/dinamargelovich/Desktop/$APP_NAME"
BACKUP_DIR="/Users/dinamargelovich/Library/Application Support/NEURO-DIV/Command Center Launcher Backups"
BUILD_DIR=$(/usr/bin/mktemp -d "/tmp/neuro-div-command-center.XXXXXX")
LSREGISTER="/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister"

cleanup() {
  /bin/rm -rf "$BUILD_DIR"
}
trap cleanup EXIT

/bin/mkdir -p "$BUILD_DIR/$APP_NAME/Contents/MacOS" "$INSTALL_DIR" "$BACKUP_DIR"
/usr/bin/xcrun swiftc \
  -O \
  -parse-as-library \
  -framework AppKit \
  -o "$BUILD_DIR/$APP_NAME/Contents/MacOS/NEURO-DIV Command Center" \
  "$SOURCE_DIR/main.swift"
/bin/cp "$SOURCE_DIR/Info.plist" "$BUILD_DIR/$APP_NAME/Contents/Info.plist"
/usr/bin/plutil -lint "$BUILD_DIR/$APP_NAME/Contents/Info.plist"
/usr/bin/codesign --force --deep --sign - "$BUILD_DIR/$APP_NAME"

/usr/bin/killall "NEURO-DIV Command Center" 2>/dev/null || true
for OLD_BACKUP in "$INSTALL_DIR"/NEURO-DIV\ Command\ Center.backup.*.app(N/); do
  "$LSREGISTER" -u "$OLD_BACKUP" 2>/dev/null || true
  /bin/mv "$OLD_BACKUP" "$BACKUP_DIR/"
done
if [[ -e "$APP_PATH" ]]; then
  "$LSREGISTER" -u "$APP_PATH" 2>/dev/null || true
  /bin/mv "$APP_PATH" "$BACKUP_DIR/NEURO-DIV Command Center.backup.$(/bin/date -u +%Y%m%dT%H%M%SZ).app"
fi
/bin/cp -R "$BUILD_DIR/$APP_NAME" "$APP_PATH"
/bin/chmod -R u+rwX,go-rwx "$APP_PATH"

if [[ -L "$DESKTOP_LINK" ]]; then
  /bin/rm "$DESKTOP_LINK"
elif [[ -e "$DESKTOP_LINK" ]]; then
  /bin/mv "$DESKTOP_LINK" "/Users/dinamargelovich/Desktop/NEURO-DIV Command Center.backup.$(/bin/date -u +%Y%m%dT%H%M%SZ).app"
fi
/bin/ln -s "$APP_PATH" "$DESKTOP_LINK"

"$LSREGISTER" -f "$APP_PATH"
/usr/bin/killall pbs 2>/dev/null || true

print -r -- "Installed $APP_PATH"
print -r -- "Desktop entry: $DESKTOP_LINK"
