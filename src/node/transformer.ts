import { MarkdownOptions } from "vitepress";

type ShikiTransformer = Required<MarkdownOptions>["codeTransformers"][number];

export const annotationsTransformer = (commentStyle = ""): ShikiTransformer => ({
  name: "vitepress-plugin-annotations:transformer",
  enforce: "pre",
  code(code) {
    const annotationsMeta = (this.options.meta?.__raw ?? "")
      .split(" ")
      .find((v) => v.startsWith("data-annotations="));
    if (!annotationsMeta) return;

    const nToLMap = Object.fromEntries(
      annotationsMeta
        .split("=")[1]
        .split(",")
        .map((a) => a.split(":") as [string, string])
    );

    const seen = new Set<string>();
    for (const line of code.children) {
      if (line.type !== "element") continue;

      line.children = line.children.map((token) => {
        if (token.type !== "element") {
          return token;
        }

        // It is theoretically possible for a non-comment to satisfy the broad
        // regex patterns defined above. To mitigate that issue, the user may
        // pass a parameter containing the CSS style string that shiki applies
        // to comments. This string depends on the theme used. This check also
        // drastically reduces the amount of regex tests that must be made,
        // because only comments would need to be checked, aiding performance.
        if (commentStyle && token.properties.style !== commentStyle) {
          return token;
        }

        const text = token.children[0];
        if (text.type !== "text") {
          return token;
        }

        const match = text.value
          .replaceAll(/\s+/g, "")
          .replace(/^([/]+[*]*|#+|<!--+|--+|::+|;+)/, "")
          .match(/^@(\d+)/);
        if (!match) {
          return token;
        }

        const n = match[1];
        const l = nToLMap[n];
        if (!l) {
          return token;
        }

        const returned = {
          type: "element" as const,
          tagName: "a",
          properties: {
            "href": `#--annotation-${l}`,
            ...(!seen.has(n) && { id: `--annotated-${l}` }),
            "data-annotation": n,
            "class": "vp-copy-ignore",
            "aria-label": `Go to annotation ${n}`,
          },
          children: [{ type: "text" as const, value: n }],
        };

        seen.add(n);

        return returned;
      });
    }
    return;
  },
});
