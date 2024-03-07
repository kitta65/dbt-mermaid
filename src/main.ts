import * as fs from "fs/promises";
import * as core from "@actions/core";
import * as process from "process";
import * as yaml from "js-yaml";
import { exec, go, isTrue } from "./utils";
import { SupportedResourceType, isDBTProjectYml } from "./dbt";
import { Flowchart } from "./flowchart";

export async function main() {
  const back = go(core.getInput("dbt-project"));
  await preprocess();

  const ignore: { [key in SupportedResourceType]: boolean } = {
    source: isTrue("ignore-sources"),
    seed: isTrue("ignore-seeds"),
    model: false,
    snapshot: isTrue("ignore-snapshots"),
    exposure: isTrue("ignore-exposures"),
    analysis: isTrue("ignore-analyses"),
    test: isTrue("ignore-tests"),
  };
  const mainChart = await Flowchart.from("./target/manifest.json", ignore);
  back();

  const anotherProject = core.getInput("dbt-project-to-compare-with");
  if (anotherProject) {
    const back = go(anotherProject);
    await preprocess();
    const anotherChart = await Flowchart.from("./target/manifest.json", ignore);
    mainChart.compare(anotherChart);
    back();
  }
  const drawEntireLineage = isTrue("draw-entire-lineage");
  const saveTextSize = isTrue("save-text-size");
  const chart = mainChart.plot(drawEntireLineage, saveTextSize);
  const outpath = `${process.cwd()}/lineage.mermaid`;
  await fs.writeFile(outpath, chart);
  core.setOutput("filepath", outpath);
}

function dummyProfile(profile: string) {
  return {
    [profile]: {
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
