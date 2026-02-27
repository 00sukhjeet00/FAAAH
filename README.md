# FAAAH! - Test Failure Sound 😱

A VS Code extension that plays a dramatic **FAAAH** sound whenever your test cases fail. Never suffer in silence again.

---

## Features

- 🔊 Plays a dramatic sliding "FAAAH" sound on test failure
- 🎯 Works with **Jest, pytest, Mocha, Karma, Vitest**, and any test runner
- 🔇 Toggle sound on/off via status bar or command palette
- 🎚️ Configurable volume
- 📡 Detects failures from:
  - VS Code task runner (test tasks with non-zero exit codes)
  - Terminal output pattern matching
  - VS Code native Test API

---

## How It Works

The extension monitors three sources for test failures:

1. **Task Runner** — If a task containing "test", "jest", "pytest", "mocha", "karma", or "spec" in its name exits with a non-zero code → **FAAAH!**
2. **Terminal Output** — Scans terminal output for patterns like `3 tests failed`, `FAILED`, `✕`, `2 failing`, etc. → **FAAAH!**
3. **VS Code Test API** — Hooks into the built-in test result state → **FAAAH!**

---

## Installation

### From source (manual):
```bash
# Install vsce
npm install -g @vscode/vsce

# In the extension directory
vsce package

# Install the generated .vsix
code --install-extension faaah-test-failure-1.0.0.vsix
```

---

## Usage

- **Test the sound**: Open Command Palette (`Cmd/Ctrl+Shift+P`) → `FAAAH: Play Test Failure Sound`
- **Toggle on/off**: Click the `🔊 FAAAH` button in the status bar, or run `FAAAH: Toggle Sound On/Off`
- **Change volume**: Settings → search "faaah" → adjust volume (0.1–1.0)

---

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `faaah.enabled` | `true` | Enable/disable the sound |
| `faaah.volume` | `1.0` | Sound volume (0.1–1.0) |

---

## Platform Support

| Platform | Audio Player Used |
|----------|------------------|
| macOS    | `afplay` (built-in) |
| Windows  | PowerShell `Media.SoundPlayer` |
| Linux    | `aplay` / `paplay` / `ffplay` |

> **Linux users**: Make sure `aplay` (ALSA), `paplay` (PulseAudio), or `ffplay` (FFmpeg) is installed.

---

## Why?

Because `AssertionError: expected 42 to equal 43` deserves a sound effect.

---

*Made with ❤️ and suffering*
