import * as core from "@actions/core";
import { main } from "src/main";

try {
  main();
} catch (error: unknown) {
  core.setFailed(String(error));
}
// const fs = require("fs");
// const manifest = require("./project/target/manifest.json");
//
// const idMap = {};
// let uniqueNumber = 0;
// for (const key of Object.keys(manifest.nodes)) {
//   uniqueNumber++;
//   idMap[key] = `id${uniqueNumber}`;
// }
// for (const key of Object.keys(manifest.sources)) {
//   uniqueNumber++;
//   idMap[key] = `id${uniqueNumber}`;
// }
// for (const key of Object.keys(manifest.exposures)) {
//   uniqueNumber++;
//   idMap[key] = `id${uniqueNumber}`;
// }
//
// let mermaid = "";
// mermaid += "flowchart LR\n";
// mermaid += "  classDef source fill:green,stroke-width:0px,color:white;\n";
// mermaid += "  classDef model fill:blue,stroke-width:0px,color:white;\n";
// mermaid += "  classDef exposure fill:orange,stroke-width:0px,color:white;\n";
//
// for (const [dbtId, mermaidId] of Object.entries(idMap)) {
//   const type = dbtId.split(".")[0];
//   mermaid += `  ${mermaidId}("${dbtId}");\n`;
//   mermaid += `  class ${mermaidId} ${type};\n`;
// }
//
// for (const [parent, children] of Object.entries(manifest.child_map)) {
//   for (const child of children) {
//     idMap[parent] || console.log(parent);
//     mermaid += `  ${idMap[parent]} --> ${idMap[child]};\n`;
//   }
// }
//
// fs.writeFileSync("graph.mermaid", mermaid);
