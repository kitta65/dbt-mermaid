import * as fs from "fs/promises";
import * as core from "@actions/core";
import * as process from "process";
import { b2a, exec } from "./utils";
import { Manifest, Status, isNode } from "./types";

export async function main() {
  const workingDirectory = process.cwd();
  const dbtVersion = core.getInput("dbt-version");

  const mainProject = core.getInput("dbt-project");
  process.chdir(mainProject);
  await writeManifest(dbtVersion);
  const mainManifest = await readManifest("./target/manifest.json");
  process.chdir(workingDirectory);

  let anotherManifest;
  const anotherProject = core.getInput("dbt-project-to-compare-with");
  if (anotherProject) {
    process.chdir(anotherProject);
    await writeManifest(dbtVersion);
    anotherManifest = await readManifest("./target/manifest.json");
    process.chdir(workingDirectory);
  }
  const chart = flowchart(mainManifest, anotherManifest);
  const outpath = `${process.cwd()}/lineage.mermaid`;
  await fs.writeFile(outpath, chart);
  core.setOutput("filepath", outpath);
}

async function writeManifest(dbtVer: string) {
  const dbtVersion = core.getInput("dbt-version");
  await exec(`pipx run --spec dbt-postgres==${dbtVersion} dbt deps`);
  // TODO support other adapters
  await exec(`pipx run --spec dbt-postgres==${dbtVersion} dbt ls`);
}

function readManifest(filepath: string): Promise<Manifest> {
  return fs
    .readFile(filepath)
    .then((buffer) => String(buffer))
    .then((json) => JSON.parse(json));
}

export function flowchart(
  mainManifest: Manifest,
  anotherManifest?: Manifest,
): string {
  const statements = [
    ...nodes(mainManifest, anotherManifest),
    ...links(mainManifest, anotherManifest),
  ];

  const mermaid =
    "flowchart LR\n" + statements.map((stmt) => "  " + stmt + ";\n").join("");
  return mermaid;
}

function nodes(mainManifest: Manifest, anotherManifest?: Manifest): string[] {
  let resources: { [key: string]: Status } = {};
  for (const key of Object.keys({
    ...mainManifest.sources,
    ...mainManifest.nodes,
    ...mainManifest.exposures,
  })) {
    resources[key] = "identical";
  }
  if (anotherManifest) {
    for (const key of Object.keys(resources)) {
      resources[key] = "deleted";
    }
    for (const [key, value] of Object.entries({
      ...anotherManifest.sources,
      ...anotherManifest.nodes,
      ...anotherManifest.exposures,
    })) {
      if (key in resources) {
        if (isNode(value)) {
          const mainHash = mainManifest.nodes[key].check_sum.check_sum;
          const anotherHash = value.check_sum.check_sum;
          resources[key] = mainHash === anotherHash ? "identical" : "modified";
        } else {
          resources[key] = "identical";
        }
      } else {
        resources[key] = "new";
      }
    }
  }

  const statements: string[] = [];
  for (const [key, value] of Object.entries(resources)) {
    const splited = key.split(".");
    let text = splited.slice(2).join(".");
    const style: string[] = ["color:white"];
    switch (splited[0]) {
      case "source":
        style.push("fill:green");
        break;
      case "model":
        style.push("fill:blue");
        break;
      case "exposure":
        style.push("fill:orange");
        break;
    }
    switch (value) {
      case "deleted":
        style.push("stroke-width:4px");
        style.push("stroke-dasharray: 5 5");
        break;
      case "identical":
        style.push("stroke-width:0px");
        break;
      case "modified":
        style.push("stroke-width:4px");
        text = `**${text}**`;
        break;
      case "new":
        style.push("stroke-width:4px");
        break;
    }

    // NOTE
    // name may contain special character (e.g. white space)
    // which is not allowed in flowchart id
    const id = b2a(key);
    statements.push(`${id}("${text}")`);
    statements.push(`style ${id} ${style.join(",")}`);
  }
  return statements;
}

function links(mainManifest: Manifest, anotherManifest?: Manifest): string[] {
  let links: { [key: string]: Status } = {};
  for (const [parent, children] of Object.entries(mainManifest.child_map)) {
    for (const child of children) {
      // since base64 does not use `|`
      // it is a good separator
      links[`${b2a(parent)}|${b2a(child)}`] = "identical";
    }
  }
  if (anotherManifest) {
    for (const key of Object.keys(links)) {
      links[key] = "deleted";
    }
    for (const [parent, children] of Object.entries(
      anotherManifest.child_map,
    )) {
      for (const child of children) {
        const key = `${b2a(parent)}|${b2a(child)}`;
        links[key] = key in links ? "identical" : "new";
      }
    }
  }
  const statements: string[] = [];
  let idx = 0;
  for (const [key, value] of Object.entries(links)) {
    const [parent, child, ..._] = key.split("|");
    switch (value) {
      case "deleted":
        statements.push(`${parent} -.-> ${child}`);
        break;
      case "identical":
        statements.push(`${parent} --> ${child}`);
        break;
      case "new":
        statements.push(`${parent} --> ${child}`);
        statements.push(`linkStyle ${idx} stroke-width:2px`);
        break;
    }
    idx++;
  }
  return statements;
}
