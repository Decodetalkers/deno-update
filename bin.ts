import { parseArgs } from "@std/cli";

import file from "./deno.json" with { type: "json" };

import { CheckUpdate, ForceUpdate } from "./mod.ts";

const version = file.version;

interface ArgsParses {
  help?: boolean;
  checkUpdate?: boolean;
  forceUpdate?: boolean;
  path?: string;
  version?: string;
}

function help() {
  console.log("welcome to deno-update cli");
  console.log();
  console.log("--checkUpdate  use this argument to checkOutdate package");
  console.log("--forceUpdate  use this argument to forceUpdate packages");
  console.log(
    "--path         use this argument to set the root path of the project",
  );
  console.log("--version      get the project version");
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
  await CheckUpdate(path);
  Deno.exit(0);
}

if (input_args.forceUpdate) {
  const data = await ForceUpdate(path);
  if (!data) {
    Deno.exit(0);
  }
  await Deno.writeTextFile(`${path}/deno.json`, JSON.stringify(data, null, 2));
  Deno.exit(0);
}

help();
