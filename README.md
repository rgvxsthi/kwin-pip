# kwin-pip

KWin script for Picture-in-Picture in Wayland. Supports Firefox, Waterfox, Chromium, Chrome, and Brave.

Automatically pins the browser's Picture-in-Picture window to a screen corner,
sizes it relative to the screen height, hides it from the taskbar, and keeps it
above all other windows. All of this is configurable.

## Configuration

Open "System Settings" > "Window Management" > "KWin Scripts", then click the
Configure (wrench) icon next to "PiP for KWin(Wayland)":

- **PiP size** — height as a percentage of the screen height (default 25%).
- **Anchor corner** — top-left, top-right, bottom-left, or bottom-right
  (default bottom-right).
- **Edge margin** — gap in pixels between the PiP window and the screen edges.
- **Keep above other windows** — always-on-top (default on).
- **Hide from taskbar** — default on.

Settings apply after you click Apply (the script reloads automatically).

## Changes in this fork

- **Configurable** — size, corner, margin, keep-above, and hide-from-taskbar
  via the KWin Scripts settings dialog.
- **Reliable keep-above** — the PiP window now stays on top even when new
  windows are opened. The upstream script set `keepAbove` only once at window
  creation (before the browser had set the PiP caption), so it often failed to
  apply. This fork reapplies on `captionChanged` and re-asserts `keepAbove`
  whenever the browser/KWin clears it (`keepAboveChanged`).
- **Correct multi-monitor placement** — sizes and positions relative to the
  monitor the PiP opened on (upstream used the full multi-screen desktop
  height and ignored the monitor offset).
- **Places geometry only once** so you can freely move/resize the PiP without it
  snapping back to the corner.
- Added `google-chrome` and `waterfox` to the supported browsers.
- Re-tracks already-open windows on script (re)load.

## Installation

```bash
$ git clone https://github.com/rgvxsthi/kwin-pip.git
$ kpackagetool6 --type=KWin/Script -i ./kwin-pip
```
Then enable it from "System Settings" > "Window Management" > "KWin Scripts" > "PiP for KWin(Wayland)".

### Install from a release

Download the `.kwinscript` from the [Releases](https://github.com/rgvxsthi/kwin-pip/releases)
page, then either:

```bash
$ kpackagetool6 --type=KWin/Script -i kwin-pip-<version>.kwinscript
```

or use "System Settings" > "Window Management" > "KWin Scripts" > "Install from File".

## Uninstall
```bash
$ kpackagetool6 --type=KWin/Script -r kwin-pip
```

## Releasing (maintainers)

Bump `Version` in `metadata.json`, then push a matching tag:

```bash
$ git tag v0.3
$ git push origin v0.3
```

A GitHub Action ([.github/workflows/release.yml](.github/workflows/release.yml))
builds `kwin-pip-<version>.kwinscript` and publishes it as a release asset for
that tag automatically.
