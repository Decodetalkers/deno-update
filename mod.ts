import * as path from "@std/path";

const JSR_REGEX = /^jsr:@([^@]+)@\^([\d\,\.\ ]+)(\/[^@]*)?$/;

const PACKAGE_REGEX = /@([^@^\/]+)\/([^@^\/]+)/;

export interface DenoJson {
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
  imports?: Imports;
}

interface Imports {
  [key: string]: string;
}

interface PackageInfo {
  scope: string;
  package: string;
  version: string;
  user: {
    id: string;
    name: string;
    githubId: number;
    avatarUrl: URL;
    updateAt: string;
    createdAt: string;
  };
  yanked: boolean;
  usesNpm: boolean;
  newerVersionsCount: number;
  rekorLogId: string;
  readmePath: string;
  updatedAt: string;
  createdAt: string;
}

async function fetchPackage(
  scope: string,
  packageName: string,
): Promise<PackageInfo | undefined> {
  const url =
    `https://api.jsr.io/scopes/${scope}/packages/${packageName}/versions`;
  const response = await fetch(url);
  if (!response.ok) {
    return undefined;
  }
  const data: PackageInfo[] = await response.json();
  if (data.length == 0) {
    return undefined;
  }
  return data[0];
}

async function ReadImportData(rootDir: string): Promise<DenoJson | undefined> {
  const deno_json = path.resolve(path.join(rootDir, "deno.json"));
  const response = await fetch(`file://${deno_json}`);
  if (!response.ok) {
    return undefined;
  }
  const deno_json_data: DenoJson = await response.json();
  if (deno_json_data.imports) {
    return deno_json_data;
  }
  return undefined;
}

async function CheckUpdate(rootDir: string) {
  const json_data = await ReadImportData(rootDir);
  if (!json_data) {
    console.log("no import argument in json or do no contain json");
    return;
  }
  const importData = json_data.imports!;
  for (const key in importData) {
    const match = importData[key].match(JSR_REGEX);
    if (match) {
      const packageName = match[1]; // "b-fuze/deno-dom"
      const [scope, name] = packageName.split('\/');
      const data = await fetchPackage(scope, name);
      if (!data) {
        console.log(`Cannot fetch info for ${packageName}`);
      }
      console.log(data);
    }
  }
  return json_data;
}

console.log((await CheckUpdate("./test"))?.imports);
