export type Source = {};
export type Node = {
  checksum: { checksum: string };
}; // seed or model
export type Exposure = {};

export type Resource = Source | Node | Exposure;

export type Status = "identical" | "modified" | "new" | "deleted";

export function isNode(resource: Resource): resource is Node {
  return "checksum" in resource;
}
