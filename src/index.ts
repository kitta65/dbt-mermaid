import * as core from "@actions/core";
import { main } from "src/main";

try {
  main();
} catch (error: unknown) {
  core.setFailed(String(error));
}
