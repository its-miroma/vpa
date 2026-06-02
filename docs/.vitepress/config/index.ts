import { defineConfig } from "vitepress";
import { annotationsPlugin, annotationsTransformer } from "vitepress-plugin-annotations";

export default defineConfig({
  title: "VitePress Plugin Annotations",
  description: "A VitePress site with the annotations plugin.",
  themeConfig: {
    socialLinks: [{ icon: "github", link: "https://github.com/its-miroma/vpa" }],
  },

  markdown: {
    codeTransformers: [
      annotationsTransformer("--shiki-light:#6A737D;--shiki-dark:#6A737D") /* @1 */,
    ],
    config: (md) => {
      md.use(annotationsPlugin /* @2 */);
    },
  },
});
