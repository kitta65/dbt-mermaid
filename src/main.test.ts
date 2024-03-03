import { Manifest } from "./manifest";
import { b2a } from "./utils";

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
    const a = "source.project.a.a";
    const b = "model.project.b";
    const c = "exposure.project.c";
    const manifest = new Manifest({
      sources: {
        [a]: {},
      },
      nodes: {
        [b]: { checksum: { checksum: "anyvalue" } },
      },
      exposures: {
        [c]: {},
      },
      child_map: {
        [a]: [b],
        [b]: [c],
      },
      parent_map: {}, // not needed when drawing entire lineage
    });
    const actual = manifest.flowchart(true);
    const expected = `flowchart LR
  ${b2a(a)}("a.a");
  style ${b2a(a)} color:white,stroke:black,fill:green,stroke-width:0px;
  ${b2a(b)}("b");
  style ${b2a(b)} color:white,stroke:black,fill:blue,stroke-width:0px;
  ${b2a(c)}("c");
  style ${b2a(c)} color:white,stroke:black,fill:orange,stroke-width:0px;
  ${b2a(a)} --> ${b2a(b)};
  ${b2a(b)} --> ${b2a(c)};
`;
    expect(actual).toBe(expected);
  });

  test("draw entire flowchart with another manifest", () => {
    const a = "source.project.a.a";
    const b = "model.project.b";
    const c = "exposure.project.c";
    const d = "exposure.project.d";
    const originalManifest = new Manifest({
      sources: {
        [a]: {},
      },
      nodes: {
        [b]: { checksum: { checksum: "original hash" } },
      },
      exposures: {
        [c]: {},
      },
      child_map: {
        [a]: [b],
        [b]: [c],
      },
      parent_map: {}, // not needed when drawing entire lineage
    });
    const modifiedManifest = new Manifest({
      sources: {
        [a]: {},
      },
      nodes: {
        [b]: { checksum: { checksum: "modified hash" } },
      },
      exposures: {
        [d]: {},
      },
      child_map: {
        [a]: [b],
        [b]: [d],
      },
      parent_map: {}, // not needed when drawing entire lineage
    });
    const actual = modifiedManifest.flowchart(true, originalManifest);
    const expected = `flowchart LR
  ${b2a(a)}("a.a");
  style ${b2a(a)} color:white,stroke:black,fill:green,stroke-width:0px;
  ${b2a(b)}("b");
  style ${b2a(b)} color:white,stroke:black,fill:blue,stroke-width:4px;
  ${b2a(d)}("d");
  style ${b2a(d)} color:white,stroke:black,fill:orange,stroke-width:4px;
  ${b2a(c)}("c");
  style ${b2a(c)} color:white,stroke:black,fill:orange,stroke-width:4px,stroke-dasharray: 5 5;
  ${b2a(a)} --> ${b2a(b)};
  ${b2a(b)} --> ${b2a(d)};
  linkStyle 1 stroke-width:4px;
  ${b2a(b)} -.-> ${b2a(c)};
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
  ${b2a(a1)}("a1");
  style ${b2a(a1)} color:white,stroke:black,fill:green,stroke-width:0px;
  ${b2a(b1)}("b1");
  style ${b2a(b1)} color:white,stroke:black,fill:green,stroke-width:0px;
  ${b2a(c1)}("c1");
  style ${b2a(c1)} color:white,stroke:black,fill:blue,stroke-width:4px;
  ${b2a(d1)}("d1");
  style ${b2a(d1)} color:white,stroke:black,fill:blue,stroke-width:0px;
  ${b2a(e1)}("e1");
  style ${b2a(e1)} color:white,stroke:black,fill:orange,stroke-width:0px;
  ${b2a(a1)} --> ${b2a(b1)};
  ${b2a(b1)} --> ${b2a(c1)};
  ${b2a(c1)} --> ${b2a(d1)};
  ${b2a(d1)} --> ${b2a(e1)};
`;
    expect(actual).toBe(expected);
  });
});
