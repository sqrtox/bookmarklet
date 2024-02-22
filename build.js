// @ts-check

import { build } from "esbuild";
import { rm } from "node:fs/promises";
import { join as joinPath } from "node:path";

const cwd = process.cwd();
const distDir = joinPath(cwd, "dist");

await rm(distDir, {
  recursive: true,
  force: true
});

const script = process.argv.slice(2).join(" ");

await build({
  target: "esnext",
  format: "iife",
  bundle: true,
  minify: true,
  entryPoints: [joinPath(cwd, "src/scripts", script, "index.ts")],
  outfile: joinPath(distDir, `${script}.js`)
});
