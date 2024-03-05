import * as fs from "fs/promises";
import {
  ManifestData,
  SupportedResourceType,
  Status,
  isSupportedResourceType,
  isNode,
} from "./types";
import { hash } from "./utils";

type Vertex = {
  name: string;
  type: SupportedResourceType;
  status: Status;
  hash: string;
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
      this.vertices.push({
        name: key,
        type: type_,
        status: "identical",
        hash: isNode(value) ? value.checksum.checksum : "",
      });
    }

    this.edges = [];
    for (const [parent, children] of Object.entries(manifest.child_map)) {
      for (const child of children) {
        if (
          this.vertices.every((v) => v.name !== child) ||
          this.vertices.every((v) => v.name !== parent)
        )
          continue;
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

  compare(flowchart: Flowchart) {
    for (const vertex of this.vertices) {
      vertex.status = "new";
    }
    for (const edge of this.edges) {
      edge.status = "new";
    }

    for (const vertex of flowchart.vertices) {
      let isCommon = false;
      this.vertices
        .filter((v) => v.name === vertex.name)
        .forEach((v) => {
          v.status = v.hash === vertex.hash ? "identical" : "modified";
          isCommon = true;
        });
      if (!isCommon) {
        const newVertex = structuredClone(vertex);
        newVertex.status = "deleted";
        this.vertices.push(newVertex);
      }
    }

    for (const edge of flowchart.edges) {
      let isCommon = false;
      this.edges
        .filter((e) => e.child === edge.child && e.parent === edge.parent)
        .forEach((e) => {
          isCommon = true;
          e.status = "identical";
        });
      if (!isCommon) {
        const newEdge = structuredClone(edge);
        newEdge.status = "deleted";
        this.edges.push(newEdge);
      }
    }
  }

  plot(entire: boolean, shouldHash: boolean = false) {
    const statements: string[] = [];
    const checksheet: {
      [key: string]: {
        isUpstream: boolean;
        isDownstream: boolean;
      };
    } = {};
    this.vertices.forEach((vertex) => {
      checksheet[vertex.name] = {
        isUpstream: false,
        isDownstream: false,
      };
    });
    const markDownstream = (name: string) => {
      if (checksheet[name].isDownstream) return;
      checksheet[name].isDownstream = true;
      this.edges
        .filter((edge) => edge.parent === name)
        .forEach((edge) => markDownstream(edge.child));
    };
    const markUpstream = (name: string) => {
      if (checksheet[name].isUpstream) return;
      checksheet[name].isUpstream = true;
      this.edges
        .filter((edge) => edge.child === name)
        .forEach((edge) => markUpstream(edge.parent));
    };
    this.vertices.forEach((vertex) => {
      if (vertex.status === "identical") return;
      markDownstream(vertex.name);
      markUpstream(vertex.name);
    });

    this.vertices.forEach((vertex) => {
      if (
        entire ||
        checksheet[vertex.name].isDownstream ||
        checksheet[vertex.name].isUpstream
      ) {
        statements.push(...vertexStatements(vertex, shouldHash));
      }
    });
    this.edges.forEach((edge) => {
      if (
        entire ||
        checksheet[edge.parent].isDownstream ||
        checksheet[edge.child].isUpstream
      ) {
        statements.push(...edgeStatements(edge, shouldHash));
      }
    });

    const mermaid =
      "flowchart LR\n" + statements.map((stmt) => "  " + stmt + ";\n").join("");
    return mermaid;
  }
}

function vertexStatements(vertex: Vertex, shouldHash: boolean) {
  const statements = [];
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
  const id = hash(vertex.name, shouldHash);
  statements.push(`${id}("${text}")`);
  statements.push(`style ${id} ${style.join(",")}`);
  return statements;
}

function edgeStatements(edge: Edge, shouldHash: boolean) {
  const statements: string[] = [];
  const parent = hash(edge.parent, shouldHash);
  const child = hash(edge.child, shouldHash);
  switch (edge.status) {
    case "deleted":
      statements.push(`${parent} -.-> ${child}`);
      break;
    case "identical":
      statements.push(`${parent} --> ${child}`);
      break;
    case "new":
      statements.push(`${parent} ==> ${child}`);
      break;
  }
  return statements;
}
