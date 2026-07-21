import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("native Command Center launcher preserves direct access and Finder routing contracts", async () => {
  const [swift, info, installer] = await Promise.all([
    read("../native/macos/command-center-launcher/main.swift"),
    read("../native/macos/command-center-launcher/Info.plist"),
    read("../native/macos/install-command-center-launcher.zsh"),
  ]);

  assert.match(swift, /https:\/\/acs-command-center\.onemanband87\.chatgpt\.site/);
  assert.match(swift, /private func publish/);
  assert.match(swift, /FileManager\.default\.moveItem/);
  assert.match(swift, /org\.neuro-div\.acs\.universal-intake/);
  assert.match(info, /org\.neuro-div\.command-center/);
  assert.match(info, /Send to NEURO-DIV/);
  assert.match(info, /<key>CFBundleSpokenName<\/key>\s*<string>CCS<\/string>/);
  assert.match(installer, /Command Center Launcher Backups/);
  assert.match(installer, /lsregister/);
});

test("cross-device Share Sheet source accepts common intake types and targets the governed queue", async () => {
  const shortcut = await read("../native/shortcuts/Send to NEURO-DIV.shortcut.plist");

  assert.match(shortcut, /ActionExtension/);
  assert.match(shortcut, /WFGenericFileContentItem/);
  assert.match(shortcut, /WFImageContentItem/);
  assert.match(shortcut, /WFURLContentItem/);
  assert.match(shortcut, /WFStringContentItem/);
  assert.match(shortcut, /NEURO-DIV Intake\/Pending/);
  assert.match(shortcut, /<key>WFAskWhereToSave<\/key>\s*<false\/>/);
});
