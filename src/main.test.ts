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
        "source.a.a": "anyvalue",
      },
      nodes: {
        "model.b": { check_sum: { check_sum: "anyvalue" } },
      },
      exposures: {
        "exposure.c": "anyvalue",
      },
      child_map: { "source.a.a": ["model.b"], "model.b": ["exposure.c"] },
    };
    const actual = flowchart(manifest);
    const expected = `flowchart LR
  c291cmNlLmEuYQ("a.a");
  style c291cmNlLmEuYQ color:white,fill:green,stroke-width:0px;
  bW9kZWwuYg("b");
  style bW9kZWwuYg color:white,fill:blue,stroke-width:0px;
  ZXhwb3N1cmUuYw("c");
  style ZXhwb3N1cmUuYw color:white,fill:orange,stroke-width:0px;
  c291cmNlLmEuYQ --> bW9kZWwuYg;
  bW9kZWwuYg --> ZXhwb3N1cmUuYw;
`;
    expect(actual).toBe(expected);
  });
});
