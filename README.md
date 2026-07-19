# kwin-pip

KWin script for Picture-in-Picture in Wayland. Supports Firefox, Waterfox, Chromium, Chrome, and Brave.

Automatically pins the browser's Picture-in-Picture window to the bottom-right
corner, sizes it to 35% of the screen height, hides it from the taskbar, and
keeps it above all other windows.

## Changes in this fork

- **Reliable keep-above** — the PiP window now stays on top even when new
  windows are opened. The upstream script set `keepAbove` only once at window
  creation (before the browser had set the PiP caption), so it often failed to
  apply. This fork reapplies on `captionChanged` and re-asserts `keepAbove`
  whenever the browser/KWin clears it (`keepAboveChanged`).
- Added `google-chrome` to the supported browsers.
- Re-tracks already-open windows on script (re)load.

## Installation

```bash
$ git clone https://github.com/rgvxsthi/kwin-pip.git
$ kpackagetool6 --type=KWin/Script -i ./kwin-pip
```
Then enable it from "System Settings" > "Window Management" > "KWin Scripts" > "PiP for KWin(Wayland)".

## Uninstall
```bash
$ kpackagetool6 --type=KWin/Script -r kwin-pip
```
