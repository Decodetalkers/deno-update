import { assertEquals } from "jsr:@std/assert";

import { JSR_REGEX } from "./mod.ts";

Deno.test(function regexTest() {
  const input = "jsr:@b-fuze/deno-dom@^0.1.47/abc";
  const match = input.match(JSR_REGEX)!;

  assertEquals(match[0], input);
  assertEquals(match[1], "b-fuze/deno-dom");
  assertEquals(match[2], "0.1.47");
  assertEquals(match[3], "/abc")
});
