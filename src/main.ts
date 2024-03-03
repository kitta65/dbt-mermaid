import * as fs from "fs/promises";
import * as core from "@actions/core";
import * as process from "process";
import * as yaml from "js-yaml";
import { exec, moveTo } from "./utils";
import { Manifest } from "./manifest";
import { isDBTProjectYml } from "./types";

export async function main() {
  const moveBack = moveTo(core.getInput("dbt-project"));
  await preprocess();
  const mainManifest = await Manifest.from("./target/manifest.json");
  moveBack();

  let anotherManifest;
  const anotherProject = core.getInput("dbt-project-to-compare-with");
  if (anotherProject) {
    const moveBack = moveTo(anotherProject);
    await preprocess();
    anotherManifest = await Manifest.from("./target/manifest.json");
    moveBack();
  }
  const drawEntireLineage =
    core.getInput("draw-entire-lineage").toLowerCase() === "true";
  const chart = mainManifest.flowchart(drawEntireLineage, anotherManifest);
  const outpath = `${process.cwd()}/lineage.mermaid`;
  await fs.writeFile(outpath, chart);
  core.setOutput("filepath", outpath);
}

function dummyProfile(profile: string) {
  return {
    dbt_mermaid: {
      target: "dev",
      outputs: {
        dev: {
          type: "postgres",
          host: "postgres",
          port: 5432,
          dbname: "postgres",
          schema: "main",
          user: "postgres",
          password: "password",
        },
      },
    },
  };
}

async function preprocess() {
  const dbtVersion = core.getInput("dbt-version");
  const profiles = "profiles.yml";
  const obj = await fs
    .readFile("./dbt_project.yml")
    .then((buf) => buf.toString())
    .then((str) => yaml.load(str));
  if (!isDBTProjectYml(obj)) {
    throw "cannot read profile name from dbt_project.yml";
  }

  let cleanup = async () => await fs.unlink(profiles);
  await fs
    .access(profiles)
    .then(async () => {
      const temp = `${profiles}.backup`;
      await fs.rename(profiles, temp);
      cleanup = async () => fs.rename(temp, profiles);
    })
    .catch(() => {}); // NOP

  await fs.writeFile(profiles, JSON.stringify(dummyProfile(obj.profile)));
  await exec(`pipx run --spec dbt-postgres==${dbtVersion} dbt deps`);
  await exec(`pipx run --spec dbt-postgres==${dbtVersion} dbt ls`);

  await cleanup();
}
