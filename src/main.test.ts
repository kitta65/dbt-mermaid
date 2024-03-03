import { Manifest } from "./manifest";

describe("flowchart", () => {
  test("draw empty flowchart", () => {
    const manifest = new Manifest({
      nodes: {},
      sources: {},
      exposures: {},
      child_map: {},
      parent_map: {},
    });
    const actual = manifest.flowchart(true);
    const expected = `flowchart LR
`;
    expect(actual).toBe(expected);
  });

  test("draw simple flowchart", () => {
    const manifest = new Manifest({
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
      parent_map: {}, // not needed when drawing entire lineage
    });
    const actual = manifest.flowchart(true);
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

  test("draw entire flowchart with another manifest", () => {
    const originalManifest = new Manifest({
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
      parent_map: {}, // not needed when drawing entire lineage
    });
    const modifiedManifest = new Manifest({
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
      parent_map: {}, // not needed when drawing entire lineage
    });
    const actual = modifiedManifest.flowchart(true, originalManifest);
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
  test("draw partial flowchart with another manifest", () => {
    const a1 = "source.p.a1";
    const b1 = "source.p.b1";
    const c1 = "model.p.c1";
    const d1 = "model.p.d1";
    const e1 = "exposure.p.e1";
    const a2 = "source.p.a2";
    const b2 = "source.p.b2";
    const c2 = "model.p.c2";
    const d2 = "model.p.d2";
    const e2 = "exposure.p.e2";

    const originalData = {
      sources: {
        [a1]: {},
        [a2]: {},
        [b1]: {},
        [b2]: {},
      },
      nodes: {
        [c1]: { checksum: { checksum: "original hash" } },
        [c2]: { checksum: { checksum: "original hash" } },
        [d1]: { checksum: { checksum: "original hash" } },
        [d2]: { checksum: { checksum: "original hash" } },
      },
      exposures: {
        [e1]: {},
        [e2]: {},
      },
      child_map: {
        [a1]: [b1],
        [b1]: [c1],
        [c1]: [d1],
        [d1]: [e1],
        [a2]: [b2],
        [b2]: [c2],
        [c2]: [d2],
        [d2]: [e2],
      },
      parent_map: {
        [b1]: [a1],
        [c1]: [b1],
        [d1]: [c1],
        [e1]: [d1],
        [b2]: [a2],
        [c2]: [b2],
        [d2]: [c2],
        [e2]: [d2],
      },
    };
    const originalManifest = new Manifest(originalData);
    const modifiedData = structuredClone(originalData);
    modifiedData.nodes[c1].checksum.checksum = "modified hash";
    const modifiedManifest = new Manifest(modifiedData);

    const actual = modifiedManifest.flowchart(false, originalManifest);
    const expected = `flowchart LR
  c291cmNlLnAuYTE("a1");
  style c291cmNlLnAuYTE color:white,stroke:black,fill:green,stroke-width:0px;
  c291cmNlLnAuYjE("b1");
  style c291cmNlLnAuYjE color:white,stroke:black,fill:green,stroke-width:0px;
  bW9kZWwucC5jMQ("c1");
  style bW9kZWwucC5jMQ color:white,stroke:black,fill:blue,stroke-width:4px;
  bW9kZWwucC5kMQ("d1");
  style bW9kZWwucC5kMQ color:white,stroke:black,fill:blue,stroke-width:0px;
  ZXhwb3N1cmUucC5lMQ("e1");
  style ZXhwb3N1cmUucC5lMQ color:white,stroke:black,fill:orange,stroke-width:0px;
  c291cmNlLnAuYTE --> c291cmNlLnAuYjE;
  c291cmNlLnAuYjE --> bW9kZWwucC5jMQ;
  bW9kZWwucC5jMQ --> bW9kZWwucC5kMQ;
  bW9kZWwucC5kMQ --> ZXhwb3N1cmUucC5lMQ;
`;
    expect(actual).toBe(expected);
  });
});
