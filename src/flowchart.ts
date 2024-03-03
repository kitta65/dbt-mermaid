import * as fs from "fs/promises";
import {
  ManifestData,
  SupportedResourceType,
  Status,
  isSupportedResourceType,
  isNode,
} from "./types";
import { b2a } from "./utils";

type Vertex = {
  name: string;
  type: SupportedResourceType;
  status: Status;
};

type Edge = {
  parent: string;
  child: string;
  status: Status;
};

export class Flowchart {
  private vertices: Vertex[];
  private edges: Edge[];
  constructor(private readonly manifest: ManifestData) {
    this.vertices = [];
    for (const [key, value] of Object.entries({
      ...manifest.sources,
      ...manifest.nodes,
      ...manifest.exposures,
    })) {
      const splited = key.split(".");
      const type_ = splited[0];
      // ignore unsupported resources
      if (!isSupportedResourceType(type_)) continue;
      // ignore generic test
      if (isNode(value) && value.checksum.checksum === "") continue;
      this.vertices.push({ name: key, type: type_, status: "identical" });
    }

    this.edges = [];
    for (const [parent, children] of Object.entries(manifest.child_map)) {
      for (const child of children) {
        if (this.vertices.every((v) => v.name === child)) continue;
        if (this.vertices.every((v) => v.name === parent)) continue;
        this.edges.push({ parent, child, status: "identical" });
      }
    }
  }

  static async from(filepath: string): Promise<Flowchart> {
    const manifest = await fs
      .readFile(filepath)
      .then((buffer) => String(buffer))
      .then((json) => JSON.parse(json));
    return new Flowchart(manifest);
  }

  plot() {
    const statements: string[] = [];
    statements.push(...verticesStatements(this.vertices));
    statements.push(...edgesStatements(this.edges));
    const mermaid =
      "flowchart LR\n" + statements.map((stmt) => "  " + stmt + ";\n").join("");
    return mermaid;
  }
}

function verticesStatements(vertices: Vertex[]) {
  const statements = [];
  for (const vertex of vertices) {
    const splited = vertex.name.split(".");
    const text = splited.slice(2).join(".");
    const style: string[] = ["color:white", "stroke:black"];
    switch (vertex.type) {
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
      default:
        throw "unnexpected resource type";
    }
    switch (vertex.status) {
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
      default:
        throw "unnexpected resource status";
    }
    // NOTE
    // name may contain special character (e.g. white space)
    // which is not allowed in flowchart id
    const id = b2a(vertex.name);
    statements.push(`${id}("${text}")`);
    statements.push(`style ${id} ${style.join(",")}`);
  }
  return statements;
}

function edgesStatements(edges: Edge[]) {
  const statements: string[] = [];
  let idx = 0;
  for (const edge of edges) {
    switch (edge.status) {
      case "deleted":
        statements.push(`${b2a(edge.parent)} -.-> ${b2a(edge.child)}`);
        break;
      case "identical":
        statements.push(`${b2a(edge.parent)} --> ${b2a(edge.child)}`);
        break;
      case "new":
        statements.push(`${b2a(edge.parent)} --> ${b2a(edge.child)}`);
        statements.push(`linkStyle ${idx} stroke-width:4px`);
        break;
    }
    idx++;
  }
  return statements;
}
