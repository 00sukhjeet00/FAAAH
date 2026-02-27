# FAAAH! - Test Failure Sound 😱

> Because `AssertionError: expected 42 to equal 43` deserves a sound effect.

A VS Code extension that plays a dramatic **FAAAH** sound whenever your test cases fail. Never suffer in silence again.

---

## ✨ Features

- 🔊 Plays a dramatic sliding **FAAAH** sound on test failure
- 🎯 Works with **Jest, Pytest, Mocha, Karma, Vitest**, and any test runner
- 🔇 Toggle sound on/off via status bar or Command Palette
- 🎚️ Adjustable volume (0.1–1.0)
- 📡 Detects failures from multiple sources:
  - **Task Runner** — test tasks with non-zero exit codes
  - **Terminal Output** — pattern matching (`FAILED`, `✕`, `failing`, etc.)
  - **VS Code Test API** — built-in test result integration

---

## 📦 Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to **Extensions** (`Ctrl+Shift+X`)
3. Search for **"FAAAH"**
4. Click **Install**

### From Command Line

```bash
code --install-extension 00sukhjeet00.faaah-test-failure
```

---

## 🚀 Usage

| Action             | How                                                                 |
| ------------------ | ------------------------------------------------------------------- |
| **Test the sound** | `Ctrl+Shift+P` → `FAAAH: Play Test Failure Sound`                   |
| **Toggle on/off**  | Click `🔊 FAAAH` in the status bar, or `FAAAH: Toggle Sound On/Off` |
| **Run tests**      | `Ctrl+Shift+P` → `FAAAH: Run Tests`                                 |
| **Adjust volume**  | Settings → search `faaah` → set volume (0.1–1.0)                    |

---

## ⚙️ Settings

| Setting         | Default | Description                    |
| --------------- | ------- | ------------------------------ |
| `faaah.enabled` | `true`  | Enable/disable the FAAAH sound |
| `faaah.volume`  | `1.0`   | Sound volume (0.1–1.0)         |

---

## 🔍 How It Works

The extension monitors **three sources** for test failures:

1. **Task Runner** — If a task containing "test", "jest", "pytest", "mocha", "karma", or "spec" exits with a non-zero code → 💥 **FAAAH!**
2. **Terminal Output** — Scans for patterns like `3 tests failed`, `FAILED`, `✕`, `2 failing` → 💥 **FAAAH!**
3. **VS Code Test API** — Hooks into native test results → 💥 **FAAAH!**

---

## 💻 Platform Support

| Platform    | Audio Player                   |
| ----------- | ------------------------------ |
| **macOS**   | `afplay` (built-in)            |
| **Windows** | PowerShell `Media.SoundPlayer` |
| **Linux**   | `aplay` / `paplay` / `ffplay`  |

> **Linux users**: Make sure `aplay` (ALSA), `paplay` (PulseAudio), or `ffplay` (FFmpeg) is installed.

---

## 🛠️ Contributing

Found a bug or want to add a feature? Contributions are welcome!

1. Fork the [repository](https://github.com/00sukhjeet00/FAAAH)
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

_Made with ❤️ and suffering_
