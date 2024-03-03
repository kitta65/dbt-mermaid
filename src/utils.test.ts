import { a2b, b2a } from "./utils";

describe("a2b b2a", () => {
  test("simple alphabet", () => {
    const input = "abc";
    expect(a2b(b2a(input))).toBe(input);
  });

  test("symbols", () => {
    const input = ". ";
    expect(a2b(b2a(input))).toBe(input);
  });

  test("kana", () => {
    const input = "あいう";
    expect(a2b(b2a(input))).toBe(input);
  });
});
