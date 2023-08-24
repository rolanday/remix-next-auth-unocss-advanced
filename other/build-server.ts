import path from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";
import fsExtra from "fs-extra";
import { globSync } from "glob";
import z from "zod";

const pkgSchema = z.object({
  engines: z.object({
    node: z.string().regex(/^\d+$/),
  }),
});

const pkg = pkgSchema.parse(
  fsExtra.readJsonSync(path.join(process.cwd(), "package.json"))
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const here = (...s: Array<string>) => path.join(__dirname, ...s);
const globsafe = (s: string) => s.replace(/\\/g, "/");

const allFiles = globSync(globsafe(here("../server/**/*.*")), {
  ignore: [
    "server/dev-server.js", // for development only
    "**/tsconfig.json",
    "**/eslint*",
    "**/__tests__/**",
  ],
});

const entries = [];
for (const file of allFiles) {
  if (/\.(ts|js|tsx|jsx)$/.test(file)) {
    entries.push(file);
  } else {
    const dest = file.replace(here("../server"), here("../build.server"));
    fsExtra.ensureDirSync(path.parse(dest).dir);
    fsExtra.copySync(file, dest);
    console.log(`copied: ${file.replace(`${here("../server")}/`, "")}`);
  }
}

console.log();
console.log("building...");

esbuild
  .build({
    entryPoints: entries,
    outdir: here("../build.server"),
    target: [`node${pkg.engines.node}`],
    platform: "node",
    sourcemap: true,
    format: "esm",
    logLevel: "info",
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
