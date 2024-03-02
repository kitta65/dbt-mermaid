import { flowchart } from "./main";
import { Manifest } from "./types";

describe("flowchart", () => {
  test("draw empty flowchart", () => {
    const manifest: Manifest = {
      nodes: {},
      sources: {},
      exposures: {},
      child_map: {},
    };
    const actual = flowchart(manifest);
    const expected = `flowchart LR
`;
    expect(actual).toBe(expected);
  });

  test("draw simple flowchart", () => {
    const manifest: Manifest = {
      sources: {
        "source.project.a.a": {},
      },
      nodes: {
        "model.project.b": { checksum: { checksum: "anyvalue" } },
      },
      exposures: {
        "exposure.project.c": {},
      },
      child_map: {
        "source.project.a.a": ["model.project.b"],
        "model.project.b": ["exposure.project.c"],
      },
    };
    const actual = flowchart(manifest);
    const expected = `flowchart LR
  c291cmNlLnByb2plY3QuYS5h("a.a");
  style c291cmNlLnByb2plY3QuYS5h color:white,stroke:black,fill:green,stroke-width:0px;
  bW9kZWwucHJvamVjdC5i("b");
  style bW9kZWwucHJvamVjdC5i color:white,stroke:black,fill:blue,stroke-width:0px;
  ZXhwb3N1cmUucHJvamVjdC5j("c");
  style ZXhwb3N1cmUucHJvamVjdC5j color:white,stroke:black,fill:orange,stroke-width:0px;
  c291cmNlLnByb2plY3QuYS5h --> bW9kZWwucHJvamVjdC5i;
  bW9kZWwucHJvamVjdC5i --> ZXhwb3N1cmUucHJvamVjdC5j;
`;
    expect(actual).toBe(expected);
  });

  test("draw simple flowchart using another manifest", () => {
    const originalManifest: Manifest = {
      sources: {
        "source.project.a.a": {},
      },
      nodes: {
        "model.project.b": { checksum: { checksum: "original hash" } },
      },
      exposures: {
        "exposure.project.c": {},
      },
      child_map: {
        "source.project.a.a": ["model.project.b"],
        "model.project.b": ["exposure.project.c"],
      },
    };
    const modifiedManifest: Manifest = {
      sources: {
        "source.project.a.a": {},
      },
      nodes: {
        "model.project.b": { checksum: { checksum: "modified hash" } },
      },
      exposures: {
        "exposure.project.d": {},
      },
      child_map: {
        "source.project.a.a": ["model.project.b"],
        "model.project.b": ["exposure.project.d"],
      },
    };
    const actual = flowchart(modifiedManifest, originalManifest);
    const expected = `flowchart LR
  c291cmNlLnByb2plY3QuYS5h("a.a");
  style c291cmNlLnByb2plY3QuYS5h color:white,stroke:black,fill:green,stroke-width:0px;
  bW9kZWwucHJvamVjdC5i("b");
  style bW9kZWwucHJvamVjdC5i color:white,stroke:black,fill:blue,stroke-width:4px;
  ZXhwb3N1cmUucHJvamVjdC5k("d");
  style ZXhwb3N1cmUucHJvamVjdC5k color:white,stroke:black,fill:orange,stroke-width:4px;
  ZXhwb3N1cmUucHJvamVjdC5j("c");
  style ZXhwb3N1cmUucHJvamVjdC5j color:white,stroke:black,fill:orange,stroke-width:4px,stroke-dasharray: 5 5;
  c291cmNlLnByb2plY3QuYS5h --> bW9kZWwucHJvamVjdC5i;
  bW9kZWwucHJvamVjdC5i --> ZXhwb3N1cmUucHJvamVjdC5k;
  linkStyle 1 stroke-width:4px;
  bW9kZWwucHJvamVjdC5i -.-> ZXhwb3N1cmUucHJvamVjdC5j;
`;
    expect(actual).toBe(expected);
  });
});
