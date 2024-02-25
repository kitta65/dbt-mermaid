import * as fs from "fs/promises";
import * as core from "@actions/core";
// import * as github from "@actions/github";
import * as process from "process";
import { exec } from "src/utils";

export type Manifest = {
  child_map: string;
  nodes: { [key: string]: unknown };
  sources: { [key: string]: unknown };
  exposures: { [key: string]: unknown };
};

export async function main() {
  const dbtDirectory = core.getInput("dbt-directory");
  process.chdir(dbtDirectory);

  // create manifest.json
  const dbtVersion = core.getInput("dbt-version");
  await exec(`pipx run --spec dbt-postgres==${dbtVersion} dbt deps`);
  // TODO support other adapters
  await exec(`pipx run --spec dbt-postgres==${dbtVersion} dbt ls`);

  const manifest: Manifest = await fs
    .readFile("./target/manifest.json")
    .then((buffer) => String(buffer))
    .then((json) => JSON.parse(json));
  const outpath = `${process.cwd()}/lineage.mermaid`;
  await draw(outpath, manifest);
  core.setOutput("filepath", outpath);
}

async function draw(outpath: string, manifest: Manifest) {
  const resources = {
    ...manifest.nodes,
    ...manifest.sources,
    ...manifest.exposures,
  };
  const name2id: { [key: string]: number } = {};
  let id = 0;
  for (const name of Object.keys(resources)) {
    id++;
    name2id[name] = id;
  }

  const statements: string[] = [];
  statements.push("classDef source fill:green,stroke-width:0px,color:white");
  statements.push("classDef model fill:blue,stroke-width:0px,color:white");
  statements.push("classDef exposure fill:orange,stroke-width:0px,color:white");

  for (const [name, id] of Object.entries(name2id)) {
    const type = name.split(".")[0];
    statements.push(`${id}("${name}")`);
    statements.push(`class ${id} ${type}`);
  }

  for (const [parent, children] of Object.entries(manifest.child_map)) {
    for (const child of children) {
      statements.push(`${name2id[parent]} --> ${name2id[child]}`);
    }
  }

  const mermaid =
    "flowchart LR\n" + statements.map((stmt) => "  " + stmt + ";\n").join("");
  await fs.writeFile(outpath, mermaid);
}
