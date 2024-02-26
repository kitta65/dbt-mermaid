import * as fs from "fs/promises";
import * as core from "@actions/core";
import * as process from "process";
import { a2b, b2a, exec } from "./utils";

export type Manifest = {
  child_map: { [key: string]: string[] };
  nodes: { [key: string]: unknown };
  sources: { [key: string]: unknown };
  exposures: { [key: string]: unknown };
};

export async function main() {
  const dbtVersion = core.getInput("dbt-version");

  const mainProject = core.getInput("dbt-project");
  process.chdir(mainProject);
  await writeManifest(dbtVersion);
  const mainManifest = await readManifest("./target/manifest.json");
  const mainFlowchart = flowchart(mainManifest);
  const mainOutpath = `${process.cwd()}/lineage.mermaid`;

  let finalFlowchart = mainFlowchart;
  const anotherProject = core.getInput("dbt-project-to-compare-with");
  if (anotherProject) {
    process.chdir(anotherProject);
    await writeManifest(dbtVersion);
    const anotherManifest = await readManifest("./target/manifest.json");
    const anotherFlowchart = flowchart(anotherManifest);
    // TODO show difference
    finalFlowchart = anotherFlowchart;
  }

  await fs.writeFile(mainOutpath, finalFlowchart);
  core.setOutput("filepath", mainOutpath);
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

export function flowchart(manifest: Manifest): string {
  const resources = {
    ...manifest.sources,
    ...manifest.nodes,
    ...manifest.exposures,
  };
  const statements: string[] = [];
  statements.push("classDef source fill:green,stroke-width:0px,color:white");
  statements.push("classDef model fill:blue,stroke-width:0px,color:white");
  statements.push("classDef exposure fill:orange,stroke-width:0px,color:white");

  for (const name of Object.keys(resources)) {
    const splited = name.split(".");
    const class_ = splited[0];
    const text = splited.slice(1).join(".");
    // NOTE
    // name may contain special character (e.g. white space)
    // which is not allowed in flowchart id
    const id = b2a(name);
    statements.push(`${id}("${text}")`);
    statements.push(`class ${id} ${class_}`);
  }

  for (const [parent, children] of Object.entries(manifest.child_map)) {
    for (const child of children) {
      statements.push(`${b2a(parent)} --> ${b2a(child)}`);
    }
  }

  const mermaid =
    "flowchart LR\n" + statements.map((stmt) => "  " + stmt + ";\n").join("");
  return mermaid;
}
