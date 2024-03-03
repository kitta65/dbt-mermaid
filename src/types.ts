type Source = object;
type Node = {
  checksum: { checksum: string };
}; // seed, model, snapshot, test, analysis
type Exposure = object;
type Resource = Source | Node | Exposure;

export type Status = "identical" | "modified" | "new" | "deleted";

export function isNode(resource: Resource): resource is Node {
  return "checksum" in resource;
}

export const supportedResourceTypes = [
  "source",
  "seed",
  "model",
  "snapshot",
  "exposure",
  "analysis",
  "test",
] as const;
type SupportedResourceType = (typeof supportedResourceTypes)[number];
export function isSupportedResourceType(s: string): s is SupportedResourceType {
  return supportedResourceTypes.some((t) => t === s);
}

export type ManifestData = {
  child_map: { [key: string]: string[] };
  parent_map: { [key: string]: string[] };
  sources: { [key: string]: Source };
  nodes: { [key: string]: Node };
  exposures: { [key: string]: Exposure };
};

type DBTProjectYml = {
  profile: string;
};
export function isDBTProjectYml(value: unknown): value is DBTProjectYml {
  return typeof value === "object" && value !== null && "profile" in value;
}
