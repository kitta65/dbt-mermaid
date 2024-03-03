import util from "node:util";
import * as child_process from "child_process";
import * as process from "process";

export const exec = util.promisify(child_process.exec);

export function b2a(str: string) {
  const b64 = btoa(encodeURIComponent(str))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  return b64;
}

export function a2b(b64: string) {
  // it seems that padding (=) is not needed
  const str = b64.replace(/-/g, "+").replace(/_/g, "\\");
  return decodeURIComponent(str);
}

export function moveTo(path: string) {
  const curr = process.cwd();
  process.chdir(path);
  return () => process.chdir(curr);
}
