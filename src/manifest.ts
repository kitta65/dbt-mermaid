import * as fs from "fs/promises";
import {
  Status,
  isNode,
  ManifestData,
  isSupportedResourceType,
  supportedResourceTypes,
} from "./types";
import { a2b, b2a } from "./utils";

export class Manifest {
  constructor(private readonly data: ManifestData) {}
  static async from(filepath: string): Promise<Manifest> {
    const data = await fs
      .readFile(filepath)
      .then((buffer) => String(buffer))
      .then((json) => JSON.parse(json));
    return new Manifest(data);
  }

  flowchart(entire: boolean, another?: Manifest): string {
    const statements = [
      ...this.vertices(entire, another),
      ...this.edges(entire, another),
    ];
    const mermaid =
      "flowchart LR\n" + statements.map((stmt) => "  " + stmt + ";\n").join("");
    return mermaid;
  }

  vertices(entire: boolean, another?: Manifest): string[] {
    let resources = this.resourcesAll(another);
    const statements: string[] = [];
    const verticesToDraw = this.resourcesToDraw(entire, another);
    for (const [key, value] of Object.entries(resources)) {
      const splited = key.split(".");
      let text = splited.slice(2).join(".");
      const style: string[] = ["color:white", "stroke:black"];
      const type_ = splited[0];
      if (!isSupportedResourceType(type_)) {
        continue;
      }
      switch (type_) {
        case "source":
          style.push("fill:green");
          break;
        case "seed":
          style.push("fill:blue");
          break;
        case "model":
          style.push("fill:blue");
          break;
        case "snapshot":
          style.push("fill:blue");
          break;
        case "exposure":
          style.push("fill:orange");
          break;
        case "analysis":
          style.push("fill:blue");
          break;
        case "test":
          style.push("fill:blue");
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

      if (!verticesToDraw.has(key)) {
        continue;
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

  edges(entire: boolean, another?: Manifest): string[] {
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
    const verticesToDraw = this.resourcesToDraw(entire, another);
    let idx = 0;
    for (const [key, value] of Object.entries(mappings)) {
      const [parent, child, ..._] = key.split("|");
      if (!verticesToDraw.has(a2b(parent)) || !verticesToDraw.has(a2b(child))) {
        continue;
      }
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

  resourcesAll(another?: Manifest) {
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
    return resources;
  }

  resourcesToDraw(entire: boolean, another?: Manifest) {
    const resources = this.resourcesAll(another);
    if (entire || !another) {
      const set: Set<string> = new Set(Object.keys(resources));
      return set;
    }

    const set: Set<string> = new Set();
    const addSuccessors = (child: string, manifest: ManifestData) => {
      set.add(child);
      if (child in manifest.child_map) {
        const children = manifest.child_map[child];
        children.forEach((c) => {
          addSuccessors(c, manifest);
        });
      }
    };
    const addAncestors = (parent: string, manifest: ManifestData) => {
      set.add(parent);
      if (parent in manifest.parent_map) {
        const parents = manifest.parent_map[parent];
        parents.forEach((p) => {
          addSuccessors(p, manifest);
        });
      }
    };
    for (const manifest of [this.data, another.data]) {
      for (const [parent, children] of Object.entries(manifest.child_map)) {
        for (const child of children) {
          if (resources[parent] !== "identical") {
            set.add(parent);
            addSuccessors(child, manifest);
          }
        }
      }
      for (const [child, parents] of Object.entries(manifest.parent_map)) {
        for (const parent of parents) {
          if (resources[child] !== "identical") {
            set.add(child);
            addAncestors(parent, manifest);
          }
        }
      }
    }

    // ignore not supported resource types (e.g. metrics)
    const temp = [...set].filter((resource) => {
      const splited = resource.split(".");
      const type_ = splited[0];
      return supportedResourceTypes.some((t) => t === type_);
    });

    return new Set(temp);
  }
}
