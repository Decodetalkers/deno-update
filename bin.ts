import { parseArgs } from "@std/cli";

import file from "./deno.json" with { type: "json" };

import { CheckUpdate, ForceUpdate } from "./mod.ts";

import { blue, green, yellow } from "@std/fmt/colors";

const version = file.version;

interface ArgsParses {
  help?: boolean;
  checkUpdate?: boolean;
  forceUpdate?: boolean;
  path?: string;
  version?: string;
}

function help() {
  console.log(blue("welcome to deno-update cli"));
  console.log();
  console.log(
    `${yellow("--checkUpdate")}  use this argument to checkOutdate package`,
  );
  console.log(
    `${yellow("--forceUpdate")}  use this argument to forceUpdate packages`,
  );
  console.log(
    `${
      yellow("--path")
    }         use this argument to set the root path of the project`,
  );
  console.log(`${yellow("--version")}      get the project version`);
  console.log();
  console.log(`version ${version}`);
  Deno.exit(0);
}

const input_args = parseArgs(Deno.args) as ArgsParses;

if (input_args.version) {
  console.log(`version: ${version}`);
  Deno.exit(0);
}

if (input_args.help) {
  help();
}

const path = input_args.path || "./";

if (input_args.checkUpdate) {
  const outdateData = await CheckUpdate(path);
  if (!outdateData || outdateData.length == 0) {
    console.log(green("All of your package is newest!"));
    Deno.exit(0);
  }
  for (const { packageName, currentVersion, latestVersion } of outdateData) {
    console.log(
      `${
        yellow(packageName)
      } outofdate, currentVersion: ${currentVersion}, newest version is ${latestVersion}`,
    );
  }
  Deno.exit(0);
}

if (input_args.forceUpdate) {
  const outdateData = await CheckUpdate(path);
  if (!outdateData || outdateData.length == 0) {
    console.log(green("All of your package is newest!"));
    Deno.exit(0);
  }
  const data = await ForceUpdate(path);
  if (!data) {
    Deno.exit(0);
  }
  await Deno.writeTextFile(`${path}/deno.json`, JSON.stringify(data, null, 2));
  for (const { packageName, currentVersion, latestVersion } of outdateData) {
    console.log(
      `${yellow(packageName)} updated from ${blue(currentVersion)} to ${
        green(latestVersion)
      }`,
    );
  }
  Deno.exit(0);
}

help();
