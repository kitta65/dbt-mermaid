import util from "node:util";
import * as crypto from "crypto";
import * as child_process from "child_process";
import * as process from "process";
import * as core from "@actions/core";

export const exec = util.promisify(child_process.exec);

export function hash(text: string, shouldHash: boolean = false): string {
  if (shouldHash) {
    return crypto.createHash("sha1").update(text).digest("hex").slice(0, 7);
  }
  return text;
}

export function go(path: string) {
  const curr = process.cwd();
  process.chdir(path);
  return () => process.chdir(curr);
}

export function isTrue(input: string) {
  const str = core.getInput(input);
  return str.toLowerCase() === "true";
}
