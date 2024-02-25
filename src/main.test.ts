import { Manifest, flowchart } from "./main";

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
  classDef source fill:green,stroke-width:0px,color:white;
  classDef model fill:blue,stroke-width:0px,color:white;
  classDef exposure fill:orange,stroke-width:0px,color:white;
`;
    expect(actual).toBe(expected);
  });

  test("draw simple flowchart", () => {
    const manifest: Manifest = {
      sources: {},
      nodes: {
        "source.a.a": "anyvalue",
        "model.b": "anyvalue",
        "exposure.c": "anyvalue",
      },
      exposures: {},
      child_map: { "source.a.a": ["model.b"], "model.b": ["exposure.c"] },
    };
    const actual = flowchart(manifest);
    const expected = `flowchart LR
  classDef source fill:green,stroke-width:0px,color:white;
  classDef model fill:blue,stroke-width:0px,color:white;
  classDef exposure fill:orange,stroke-width:0px,color:white;
  1("a.a");
  class 1 source;
  2("b");
  class 2 model;
  3("c");
  class 3 exposure;
  1 --> 2;
  2 --> 3;
`;
    expect(actual).toBe(expected);
  });
});
