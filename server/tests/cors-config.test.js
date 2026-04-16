import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import http from "node:http";
import { configureCors } from "../cors-config.js";

function withTestServer(setup) {
  const app = express();
  configureCors(app);
  app.delete("/api/images/cleanup/:sessionId", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  return async () => {
    const server = http.createServer(app);

    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert.ok(address && typeof address === "object");

    try {
      await setup(address.port);
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
  };
}

test("CORS preflight allows DELETE requests from the local client", async () => {
  await withTestServer(async (port) => {
    const response = await fetch(
      `http://127.0.0.1:${port}/api/images/cleanup/test-room`,
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
  })();
});

test("CORS preflight allows the configured NAS client origin", async () => {
  process.env.CLIENT_ORIGIN = "http://192.168.100.214:3011";

  await withTestServer(async (port) => {
    const response = await fetch(
      `http://127.0.0.1:${port}/api/images/cleanup/test-room`,
      {
        method: "OPTIONS",
        headers: {
          Origin: "http://192.168.100.214:3011",
          "Access-Control-Request-Method": "DELETE",
        },
      },
    );

    assert.equal(response.status, 204);
  })();

  delete process.env.CLIENT_ORIGIN;
});
