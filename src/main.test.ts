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
        "source.project.a.a": "anyvalue",
      },
      nodes: {
        "model.project.b": { check_sum: { check_sum: "anyvalue" } },
      },
      exposures: {
        "exposure.project.c": "anyvalue",
      },
      child_map: {
        "source.project.a.a": ["model.project.b"],
        "model.project.b": ["exposure.project.c"],
      },
    };
    const actual = flowchart(manifest);
    const expected = `flowchart LR
  c291cmNlLnByb2plY3QuYS5h("a.a");
  style c291cmNlLnByb2plY3QuYS5h color:white,fill:green,stroke-width:0px;
  bW9kZWwucHJvamVjdC5i("b");
  style bW9kZWwucHJvamVjdC5i color:white,fill:blue,stroke-width:0px;
  ZXhwb3N1cmUucHJvamVjdC5j("c");
  style ZXhwb3N1cmUucHJvamVjdC5j color:white,fill:orange,stroke-width:0px;
  c291cmNlLnByb2plY3QuYS5h --> bW9kZWwucHJvamVjdC5i;
  bW9kZWwucHJvamVjdC5i --> ZXhwb3N1cmUucHJvamVjdC5j;
`;
    expect(actual).toBe(expected);
  });
});
