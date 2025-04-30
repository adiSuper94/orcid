import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");
import denoJson from "../deno.json" with { type: "json" };
const { name, version, license } = denoJson;

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  test: false,
  typeCheck: false,
  package: {
    name: name,
    version: version,
    description: "ORCID API client",
    keywords: ["orcid", "api"],
    license: license,
    dependencies: {
      "@zod/mini": "^4.0.0-beta.20250424T163858",
    },
    repository: {
      type: "git",
      url: "git+https://github.com/adiSupe94/orcid.git",
    },
    bugs: {
      url: "https://github.com/adiSuper94/orcid/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
