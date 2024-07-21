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

const input_args = parseArgs(Deno.args) as ArgsParses;

if (input_args.version) {
  console.log(`version: ${version}`);
  Deno.exit(0);
}

if (input_args.help) {
  console.log("welcome to deno-update cli");
  Deno.exit(0);
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
  await Deno.writeTextFile(`${path}/deno.json`, JSON.stringify(data));
  Deno.exit(0);
}
