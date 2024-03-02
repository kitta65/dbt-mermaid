export type Source = {};

export type Node = {
  checksum: { checksum: string };
};

export type Exposure = {};

export type Manifest = {
  child_map: { [key: string]: string[] };
  sources: { [key: string]: Source };
  nodes: { [key: string]: Node };
  exposures: { [key: string]: Exposure };
};

export type Resource = Source | Node | Exposure;
export type Status = "identical" | "modified" | "new" | "deleted";

export function isNode(resource: Resource): resource is Node {
  return "checksum" in resource;
}
