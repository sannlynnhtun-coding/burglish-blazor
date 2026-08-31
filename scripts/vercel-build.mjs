import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const globalJson = JSON.parse(readFileSync(join(repositoryRoot, "global.json"), "utf8"));
const sdkVersion = globalJson.sdk.version;
const executableName = process.platform === "win32" ? "dotnet.exe" : "dotnet";
const localDotnet = join(repositoryRoot, ".dotnet", executableName);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repositoryRoot,
    stdio: "inherit",
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function hasPinnedSdk() {
  const result = spawnSync("dotnet", ["--list-sdks"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });

  return result.status === 0 && result.stdout
    .split(/\r?\n/)
    .some((line) => line.startsWith(`${sdkVersion} `));
}

async function installSdk() {
  if (process.platform === "win32") {
    throw new Error(`Install the .NET SDK ${sdkVersion} before running this script on Windows.`);
  }

  const installerPath = join(tmpdir(), `dotnet-install-${process.pid}.sh`);

  try {
    const response = await fetch("https://dot.net/v1/dotnet-install.sh");
    if (!response.ok) {
      throw new Error(`Unable to download dotnet-install.sh: HTTP ${response.status}`);
    }

    writeFileSync(installerPath, Buffer.from(await response.arrayBuffer()));
    run("bash", [
      installerPath,
      "--version",
      sdkVersion,
      "--install-dir",
      join(repositoryRoot, ".dotnet"),
      "--no-path",
    ]);
  } finally {
    rmSync(installerPath, { force: true });
  }
}

let dotnetCommand = "dotnet";

if (!hasPinnedSdk()) {
  if (!existsSync(localDotnet)) {
    await installSdk();
  }

  dotnetCommand = localDotnet;
}

const publishDirectory = join(repositoryRoot, "dist");
rmSync(publishDirectory, { recursive: true, force: true });

run(dotnetCommand, [
  "publish",
  join(repositoryRoot, "BurglishBlazor", "BurglishBlazor.csproj"),
  "--configuration",
  "Release",
  "--output",
  publishDirectory,
  "--nologo",
], {
  env: {
    ...process.env,
    DOTNET_CLI_TELEMETRY_OPTOUT: "1",
    DOTNET_SKIP_FIRST_TIME_EXPERIENCE: "1",
    NUGET_XMLDOC_MODE: "skip",
  },
});
