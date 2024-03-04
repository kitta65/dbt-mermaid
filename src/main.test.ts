import { Manifest } from "./manifest";
import { b2a } from "./utils";

describe("flowchart", () => {
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
