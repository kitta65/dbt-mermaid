import * as core from "@actions/core";
import * as github from "@actions/github";
import { exec } from "child_process";
import * as process from "process";

export async function main() {
  const dbtDirectory = core.getInput("dbt-directory");
  process.chdir(dbtDirectory);

  const dbtVersion = core.getInput("dbt-version");
  // TODO support other adapters
  await exec(`pipx run --spec dbt-postgres==${dbtVersion} dbt ls`);

  // TODO return lineage.mermaid
  core.setOutput("filepath", `${process.cwd()}/target/manifest.json`);
}
