import * as core from "@actions/core";
import { main } from "./main";

try {
  main();
} catch (error: unknown) {
  core.setFailed(String(error));
}
