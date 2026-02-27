const vscode = require("vscode");
const path = require("path");
const { exec, spawn } = require("child_process");
const os = require("os");

let statusBarItem;
let preloadedPlayer = null;
let mp3PathCached = null;

/**
 * Pre-loads the audio player on activation so playback is instant.
 * On Windows, keeps a persistent PowerShell process with the assembly
 * and media file already loaded — eliminates ~2s startup delay.
 */
function preloadAudioPlayer(context) {
  mp3PathCached = path.join(context.extensionPath, "faaah.mp3");

  if (os.platform() !== "win32") return;

  try {
    preloadedPlayer = spawn(
      "powershell",
      ["-NoProfile", "-NoLogo", "-NoExit", "-Command", "-"],
      { stdio: ["pipe", "pipe", "pipe"], windowsHide: true },
    );

    preloadedPlayer.on("error", () => {
      preloadedPlayer = null;
    });
    preloadedPlayer.on("exit", () => {
      preloadedPlayer = null;
    });

    // Pre-load assembly and open the file once
    preloadedPlayer.stdin.write(`Add-Type -AssemblyName presentationCore\n`);
    preloadedPlayer.stdin.write(
      `$player = New-Object System.Windows.Media.MediaPlayer\n`,
    );
    preloadedPlayer.stdin.write(`$player.Open([uri]'${mp3PathCached}')\n`);
  } catch {
    preloadedPlayer = null;
  }
}

function playFaaah(context) {
  const config = vscode.workspace.getConfiguration("faaah");
  if (!config.get("enabled", true)) return;

  // Fast path: use pre-loaded Windows player (instant playback)
  if (preloadedPlayer && preloadedPlayer.stdin.writable) {
    preloadedPlayer.stdin.write(
      `$player.Stop(); $player.Position = [TimeSpan]::Zero; $player.Play()\n`,
    );
    return;
  }

  // Fallback: spawn a new process
  const mp3Path =
    mp3PathCached || path.join(context.extensionPath, "faaah.mp3");
  const platform = os.platform();
  let cmd;

  if (platform === "darwin") {
    cmd = `afplay "${mp3Path}" &`;
  } else if (platform === "win32") {
    cmd = `powershell -NoProfile -c "Add-Type -AssemblyName presentationCore; $player = New-Object System.Windows.Media.MediaPlayer; $player.Open([uri]'${mp3Path}'); $player.Play(); Start-Sleep -Seconds 4; $player.Stop()"`;
  } else {
    cmd = `(mpg123 "${mp3Path}" 2>/dev/null || ffplay -nodisp -autoexit "${mp3Path}" 2>/dev/null || cvlc --play-and-exit "${mp3Path}" 2>/dev/null) &`;
  }

  exec(cmd, (err) => {
    if (err) {
      console.log("FAAAH: Could not play audio -", err.message);
    }
  });
}

/**
 * Checks if a command string looks like a test command.
 */
function isTestCommand(commandLine) {
  if (!commandLine) return false;
  const cmd = commandLine.toLowerCase();
  return (
    cmd.includes("test") ||
    cmd.includes("jest") ||
    cmd.includes("pytest") ||
    cmd.includes("mocha") ||
    cmd.includes("karma") ||
    cmd.includes("vitest") ||
    cmd.includes("spec") ||
    cmd.includes("npx jest") ||
    cmd.includes("npm test") ||
    cmd.includes("yarn test") ||
    cmd.includes("pnpm test")
  );
}

/**
 * Watches for VS Code Tasks that end with a non-zero exit code.
 */
function watchTaskRunner(context) {
  vscode.tasks.onDidEndTaskProcess((e) => {
    if (e.exitCode !== 0) {
      const taskName = e.execution.task.name.toLowerCase();
      const source = (e.execution.task.source || "").toLowerCase();
      const isTestTask =
        taskName.includes("test") ||
        taskName.includes("jest") ||
        taskName.includes("pytest") ||
        taskName.includes("mocha") ||
        taskName.includes("karma") ||
        taskName.includes("spec") ||
        taskName.includes("vitest") ||
        source.includes("test");
      if (isTestTask) {
        playFaaah(context);
        vscode.window.showInformationMessage("💀 Tests failed! FAAAH!");
      }
    }
  });
}

/**
 * Uses the stable Shell Integration API (VS Code 1.93+) to detect
 * when terminal commands finish with a non-zero exit code.
 */
function watchTerminalShellExecution(context) {
  let lastFaaahTime = 0;

  const disposable = vscode.window.onDidEndTerminalShellExecution((e) => {
    if (e.exitCode !== undefined && e.exitCode !== 0) {
      const now = Date.now();
      if (now - lastFaaahTime < 3000) return;

      const commandLine =
        e.execution && e.execution.commandLine
          ? e.execution.commandLine.value || ""
          : "";

      if (isTestCommand(commandLine)) {
        lastFaaahTime = now;
        playFaaah(context);
        vscode.window.showInformationMessage("💀 Tests failed! FAAAH!");
      }
    }
  });

  context.subscriptions.push(disposable);
}

/**
 * Registers a "Run Tests" command that executes a test command as a VS Code Task.
 */
function registerRunTestsCommand(context) {
  const disposable = vscode.commands.registerCommand(
    "faaah.runTests",
    async () => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        vscode.window.showWarningMessage(
          "FAAAH: No workspace folder found to run tests in.",
        );
        return;
      }

      const testCmd = await vscode.window.showInputBox({
        prompt: "Enter the test command to run",
        value: "npm test",
        placeHolder: "npm test / jest / pytest / mocha",
      });

      if (!testCmd) return;

      const task = new vscode.Task(
        { type: "faaah", task: "run-tests" },
        workspaceFolder,
        "test",
        "faaah",
        new vscode.ShellExecution(testCmd),
      );

      vscode.tasks.executeTask(task);
    },
  );

  context.subscriptions.push(disposable);
}

function activate(context) {
  console.log("FAAAH extension active! 😱");

  // Pre-load the audio player for instant playback
  preloadAudioPlayer(context);

  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBarItem.command = "faaah.toggle";
  statusBarItem.text = "🔊 FAAAH";
  statusBarItem.tooltip = "Click to toggle FAAAH sound on test failure";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  context.subscriptions.push(
    vscode.commands.registerCommand("faaah.testSound", () => {
      playFaaah(context);
      vscode.window.showInformationMessage("🔊 FAAAH! (test sound)");
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("faaah.toggle", () => {
      const config = vscode.workspace.getConfiguration("faaah");
      const current = config.get("enabled", true);
      config.update("enabled", !current, vscode.ConfigurationTarget.Global);
      statusBarItem.text = !current ? "🔊 FAAAH" : "🔇 FAAAH";
      vscode.window.showInformationMessage(
        `FAAAH sound ${!current ? "enabled" : "disabled"}`,
      );
    }),
  );

  watchTaskRunner(context);

  if (vscode.window.onDidEndTerminalShellExecution) {
    watchTerminalShellExecution(context);
  } else {
    console.log(
      "FAAAH: Shell integration API not available. Use 'FAAAH: Run Tests' command or VS Code Tasks for test failure detection.",
    );
  }

  registerRunTestsCommand(context);
}

function deactivate() {
  // Clean up the pre-loaded player
  if (preloadedPlayer) {
    try {
      preloadedPlayer.stdin.write("exit\n");
      preloadedPlayer.kill();
    } catch {
      // ignore
    }
    preloadedPlayer = null;
  }
}

module.exports = { activate, deactivate };
