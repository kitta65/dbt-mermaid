import * as fs from "fs/promises";
import { Source, Node, Exposure, Status, isNode } from "./types";
import { b2a } from "./utils";

export type ManifestData = {
  child_map: { [key: string]: string[] };
  sources: { [key: string]: Source };
  nodes: { [key: string]: Node };
  exposures: { [key: string]: Exposure };
};

export class Manifest {
  constructor(private readonly data: ManifestData) {}
  static async from(filepath: string): Promise<Manifest> {
    const data = await fs
      .readFile(filepath)
      .then((buffer) => String(buffer))
      .then((json) => JSON.parse(json));
    return new Manifest(data);
  }

  flowchart(another?: Manifest): string {
    const statements = [...this.vertices(another), ...this.edges(another)];
    const mermaid =
      "flowchart LR\n" + statements.map((stmt) => "  " + stmt + ";\n").join("");
    return mermaid;
  }

  vertices(another?: Manifest): string[] {
    let resources: { [key: string]: Status } = {};
    for (const key of Object.keys({
      ...this.data.sources,
      ...this.data.nodes,
      ...this.data.exposures,
    })) {
      resources[key] = "identical";
    }
    if (another) {
      for (const key of Object.keys(resources)) {
        resources[key] = "new";
      }
      for (const [key, value] of Object.entries({
        ...another.data.sources,
        ...another.data.nodes,
        ...another.data.exposures,
      })) {
        if (key in resources) {
          if (isNode(value)) {
            const mainHash = this.data.nodes[key].checksum.checksum;
            const anotherHash = value.checksum.checksum;
            resources[key] =
              mainHash === anotherHash ? "identical" : "modified";
          } else {
            resources[key] = "identical";
          }
        } else {
          resources[key] = "deleted";
        }
      }
    }

    const statements: string[] = [];
    for (const [key, value] of Object.entries(resources)) {
      const splited = key.split(".");
      let text = splited.slice(2).join(".");
      const style: string[] = ["color:white", "stroke:black"];
      switch (splited[0]) {
        case "source":
          style.push("fill:green");
          break;
        case "seed":
          style.push("fill:blue");
          break;
        case "model":
          style.push("fill:blue");
          break;
        case "exposure":
          style.push("fill:orange");
          break;
      }
      switch (value) {
        case "deleted":
          style.push("stroke-width:4px");
          style.push("stroke-dasharray: 5 5");
          break;
        case "identical":
          style.push("stroke-width:0px");
          break;
        case "modified":
          style.push("stroke-width:4px");
          break;
        case "new":
          style.push("stroke-width:4px");
          break;
      }

      // NOTE
      // name may contain special character (e.g. white space)
      // which is not allowed in flowchart id
      const id = b2a(key);
      statements.push(`${id}("${text}")`);
      statements.push(`style ${id} ${style.join(",")}`);
    }
    return statements;
  }

  edges(another?: Manifest): string[] {
    let mappings: { [key: string]: Status } = {};
    for (const [parent, children] of Object.entries(this.data.child_map)) {
      for (const child of children) {
        // since base64 does not use `|`
        // it is a good separator
        mappings[`${b2a(parent)}|${b2a(child)}`] = "identical";
      }
    }
    if (another) {
      for (const key of Object.keys(mappings)) {
        mappings[key] = "new";
      }
      for (const [parent, children] of Object.entries(another.data.child_map)) {
        for (const child of children) {
          const key = `${b2a(parent)}|${b2a(child)}`;
          mappings[key] = key in mappings ? "identical" : "deleted";
        }
      }
    }
    const statements: string[] = [];
    let idx = 0;
    for (const [key, value] of Object.entries(mappings)) {
      const [parent, child, ..._] = key.split("|");
      switch (value) {
        case "deleted":
          statements.push(`${parent} -.-> ${child}`);
          break;
        case "identical":
          statements.push(`${parent} --> ${child}`);
          break;
        case "new":
          statements.push(`${parent} --> ${child}`);
          statements.push(`linkStyle ${idx} stroke-width:4px`);
          break;
      }
      idx++;
    }
    return statements;
  }
}
