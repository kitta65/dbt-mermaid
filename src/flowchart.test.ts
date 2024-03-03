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

  test("draw simple vertices", () => {
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

  test("draw simple edges", () => {
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

  test("do not draw unsupprted resource type", () => {
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

  test("do not draw generic test", () => {
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
