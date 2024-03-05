import { hash } from "./utils";

describe("hash", () => {
  test("simple alphabet", () => {
    const input = "abc";
    expect(hash(input, true)).toBe("a9993e36");
  });
});
