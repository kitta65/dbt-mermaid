import * as core from "@actions/core";
import * as github from "@actions/github";
import { exec } from "child_process";
import * as process from "process";

export async function main() {
  const dbtVersion = core.getInput("dbt-version");
  // TODO support other adapters
  await exec(`pipx run --spec dbt-postgres==${dbtVersion} dbt ls`);

  core.setOutput("filepath", `${process.cwd()}/target/manifest.json`);
}
