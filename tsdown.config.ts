import { defineConfig } from "tsdown";

export default defineConfig({
  entry: { index: "src/node/index.ts" },
  platform: "node",
  copy: [{ from: "src/client/**/*", to: "dist/client" }],
});
