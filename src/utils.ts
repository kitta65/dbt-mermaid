import util from "node:util";
import * as child_process from "child_process";

export const exec = util.promisify(child_process.exec);
