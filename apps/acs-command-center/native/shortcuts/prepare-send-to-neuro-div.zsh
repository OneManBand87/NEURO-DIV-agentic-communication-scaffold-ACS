#!/bin/zsh
set -euo pipefail

SCRIPT_DIR=${0:a:h}
SOURCE="$SCRIPT_DIR/Send to NEURO-DIV.shortcut.plist"
OUTPUT_DIR="/Users/dinamargelovich/Library/Application Support/NEURO-DIV/Shortcut Installation"
UNSIGNED="$OUTPUT_DIR/Send to NEURO-DIV.unsigned.shortcut"
SIGNED="$OUTPUT_DIR/Send to NEURO-DIV.shortcut"

/bin/mkdir -p "$OUTPUT_DIR"
/usr/bin/plutil -lint "$SOURCE"
/bin/cp "$SOURCE" "$UNSIGNED"
/usr/bin/plutil -convert binary1 "$UNSIGNED"
/usr/bin/shortcuts sign --mode people-who-know-me --input "$UNSIGNED" --output "$SIGNED"
/bin/rm "$UNSIGNED"
/usr/bin/open "$SIGNED"

print -r -- "Prepared and opened the signed Send to NEURO-DIV Shortcut installer."
