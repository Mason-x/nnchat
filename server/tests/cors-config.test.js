import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import http from "node:http";
import { configureCors } from "../cors-config.js";

test("CORS preflight allows DELETE requests from the local client", async () => {
  const app = express();
  configureCors(app);
  app.delete("/api/images/cleanup/:sessionId", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();

  try {
    assert.ok(address && typeof address === "object");

    const response = await fetch(
      `http://127.0.0.1:${address.port}/api/images/cleanup/test-room`,
      {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:3000",
          "Access-Control-Request-Method": "DELETE",
        },
      },
    );

    assert.equal(response.status, 204);
    assert.match(
      response.headers.get("access-control-allow-methods") ?? "",
      /\bDELETE\b/,
    );
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
});
