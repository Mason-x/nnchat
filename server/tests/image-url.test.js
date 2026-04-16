import test from "node:test";
import assert from "node:assert/strict";
import { generateFileUrl } from "../utils/imageUtils/fileManager.js";

test("generateFileUrl returns a same-origin relative path", () => {
  const url = generateFileUrl("http://server:5000", "room123", "image.png");

  assert.equal(url, "/images/sessions/room123/image.png");
});
