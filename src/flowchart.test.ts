import { Flowchart } from "./flowchart";
import { b2a } from "./utils";

describe("flowchart", () => {
  test("draw empty flowchart", () => {
    const flowchart = new Flowchart({
      sources: {},
      nodes: {},
      exposures: {},
      child_map: {},
    });
    const actual = flowchart.plot(true);
    const expected = `flowchart LR
`;
    expect(actual).toBe(expected);
  });

  test("simple vertices", () => {
    const a = "source.project.a";
    const b = "model.project.b";
    const c = "exposure.project.c";
    const flowchart = new Flowchart({
      sources: {
        [a]: {},
      },
      nodes: {
        [b]: { checksum: { checksum: "b" } },
      },
      exposures: {
        [c]: {},
      },
      child_map: {},
    });
    const actual = flowchart.plot(true);
    const expected = `flowchart LR
  ${b2a(a)}("a");
  style ${b2a(a)} color:white,stroke:black,fill:green,stroke-width:0px;
  ${b2a(b)}("b");
  style ${b2a(b)} color:white,stroke:black,fill:blue,stroke-width:0px;
  ${b2a(c)}("c");
  style ${b2a(c)} color:white,stroke:black,fill:orange,stroke-width:0px;
`;
    expect(actual).toBe(expected);
  });

  test("simple edges", () => {
    const a = "source.project.a";
    const b = "model.project.b";
    const flowchart = new Flowchart({
      sources: {
        [a]: {},
      },
      nodes: {
        [b]: { checksum: { checksum: "b" } },
      },
      exposures: {},
      child_map: {
        [a]: [b],
      },
    });
    const actual = flowchart.plot(true);
    const expected = `flowchart LR
  ${b2a(a)}("a");
  style ${b2a(a)} color:white,stroke:black,fill:green,stroke-width:0px;
  ${b2a(b)}("b");
  style ${b2a(b)} color:white,stroke:black,fill:blue,stroke-width:0px;
  ${b2a(a)} --> ${b2a(b)};
`;
    expect(actual).toBe(expected);
  });

  test("compare with identical flowchart", () => {
    const a = "source.project.a";
    const b = "model.project.b";
    const original = new Flowchart({
      sources: {
        [a]: {},
      },
      nodes: {
        [b]: { checksum: { checksum: "b" } },
      },
      exposures: {},
      child_map: {
        [a]: [b],
      },
    });
    const modified = new Flowchart({
      sources: {
        [a]: {},
      },
      nodes: {
        [b]: { checksum: { checksum: "b" } },
      },
      exposures: {},
      child_map: {
        [a]: [b],
      },
    });
    modified.compare(original);
    const actual = modified.plot(true);
    const expected = `flowchart LR
  ${b2a(a)}("a");
  style ${b2a(a)} color:white,stroke:black,fill:green,stroke-width:0px;
  ${b2a(b)}("b");
  style ${b2a(b)} color:white,stroke:black,fill:blue,stroke-width:0px;
  ${b2a(a)} --> ${b2a(b)};
`;
    expect(actual).toBe(expected);
  });

  test("compare with modified flowchart (entire)", () => {
    const a = "source.project.a.a";
    const b = "model.project.b";
    const c = "exposure.project.c";
    const d = "exposure.project.d";
    const original = new Flowchart({
      sources: {
        [a]: {},
      },
      nodes: {
        [b]: { checksum: { checksum: "b" } },
      },
      exposures: {
        [c]: {},
      },
      child_map: {
        [a]: [b],
        [b]: [c],
      },
    });
    const modified = new Flowchart({
      sources: {
        [a]: {},
      },
      nodes: {
        [b]: { checksum: { checksum: "B" } },
      },
      exposures: {
        [d]: {},
      },
      child_map: {
        [a]: [b],
        [b]: [d],
      },
    });
    modified.compare(original);
    const actual = modified.plot(true);
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
  ${b2a(b)} ==> ${b2a(d)};
  ${b2a(b)} -.-> ${b2a(c)};
`;
    expect(actual).toBe(expected);
  });

  test("compare with modified flowchart (partial)", () => {
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
    const originalChart = new Flowchart(originalData);
    const modifiedData = structuredClone(originalData);
    modifiedData.nodes[c1].checksum.checksum = "modified hash";
    const modifiedChart = new Flowchart(modifiedData);
    modifiedChart.compare(originalChart);

    const actual = modifiedChart.plot(false);
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

  test("ignore unsupprted resource type", () => {
    const flowchart = new Flowchart({
      sources: {},
      nodes: { "metrics.project.name": { checksum: { checksum: "abc" } } },
      exposures: {},
      child_map: {},
    });
    const actual = flowchart.plot(true);
    const expected = `flowchart LR
`;
    expect(actual).toBe(expected);
  });

  test("ignore generic test", () => {
    const model = "model.project.name";
    const test = "test.project.name";
    const flowchart = new Flowchart({
      sources: {},
      nodes: {
        [model]: { checksum: { checksum: "anyvalue" } },
        [test]: { checksum: { checksum: "" } },
      },
      exposures: {},
      child_map: {
        [model]: [test],
      },
    });
    const actual = flowchart.plot(true);
    const expected = `flowchart LR
  ${b2a(model)}("name");
  style ${b2a(model)} color:white,stroke:black,fill:blue,stroke-width:0px;
`;
    expect(actual).toBe(expected);
  });
});
