import { Flowchart } from "./flowchart";
import { b2a } from "./utils";

describe("flowchart", () => {
  test("draw empty flowchart", () => {
    const flowchart = new Flowchart({
      sources: {},
      nodes: {},
      exposures: {},
      child_map: {},
      parent_map: {},
    });
    const actual = flowchart.plot();
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
      parent_map: {},
    });
    const actual = flowchart.plot();
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
      parent_map: {},
    });
    const actual = flowchart.plot();
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
      parent_map: {},
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
      parent_map: {},
    });
    modified.compare(original);
    const actual = modified.plot();
    const expected = `flowchart LR
  ${b2a(a)}("a");
  style ${b2a(a)} color:white,stroke:black,fill:green,stroke-width:0px;
  ${b2a(b)}("b");
  style ${b2a(b)} color:white,stroke:black,fill:blue,stroke-width:0px;
  ${b2a(a)} --> ${b2a(b)};
`;
    expect(actual).toBe(expected);
  });

  test("compare with modified flowchart", () => {
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
      parent_map: {},
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
      parent_map: {},
    });
    modified.compare(original);
    const actual = modified.plot();
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

  test("ignore unsupprted resource type", () => {
    const flowchart = new Flowchart({
      sources: {},
      nodes: { "metrics.project.name": { checksum: { checksum: "abc" } } },
      exposures: {},
      child_map: {},
      parent_map: {},
    });
    const actual = flowchart.plot();
    const expected = `flowchart LR
`;
    expect(actual).toBe(expected);
  });

  test("ignore generic test", () => {
    const flowchart = new Flowchart({
      sources: {},
      nodes: { "test.project.name": { checksum: { checksum: "" } } },
      exposures: {},
      child_map: {},
      parent_map: {},
    });
    const actual = flowchart.plot();
    const expected = `flowchart LR
`;
    expect(actual).toBe(expected);
  });
});
