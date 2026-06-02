import { MarkdownOptions } from "vitepress";

type MarkdownIt = Parameters<Required<MarkdownOptions>["config"]>[0];

export const annotationsPlugin = (md: MarkdownIt): void => {
  md.block.ruler.after("fence", "annotations_close", (state, startLine, _endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const end = state.eMarks[startLine];
    const line = state.src.slice(start, end).trim();

    if (line !== "^^^") return false;
    if (silent) return true;

    const token = state.push("annotation_close", "", 0);
    token.map = [startLine, startLine + 1];
    state.line = startLine + 1;
    return true;
  });

  md.core.ruler.after("block", "annotations", (state) => {
    for (let iFence = state.tokens.length - 1; iFence >= 0; iFence--) {
      if (state.tokens[iFence].type !== "fence") continue;

      const iAnnotationListOpen = iFence + 1;
      if (state.tokens[iAnnotationListOpen]?.type !== "ordered_list_open") continue;

      let iAnnotationListClose = -1;
      const iAnnotationItems: [number, number][] = [];

      let listDepth = 0;
      let iAnnotationItemOpen: number | null = null;

      for (let i = iAnnotationListOpen; i < state.tokens.length; i++) {
        const type = state.tokens[i].type;
        if (type.endsWith("_list_open")) {
          listDepth++;
        } else if (type.endsWith("_list_close")) {
          listDepth--;

          if (listDepth === 0) {
            iAnnotationListClose = i;
            break;
          }
        } else if (listDepth === 1) {
          if (type === "list_item_open") {
            iAnnotationItemOpen = i;
          } else if (type === "list_item_close") {
            iAnnotationItems.push([iAnnotationItemOpen!, i]);
            iAnnotationItemOpen = null;
          }
        }
      }

      if (iAnnotationListClose === -1) continue;

      const iAnnotationClose = iAnnotationListClose + 1;
      if (state.tokens[iAnnotationClose]?.type !== "annotation_close") continue;
      state.tokens.splice(iAnnotationClose, 1);
      state.tokens[iAnnotationListOpen].attrJoin("class", "info custom-block");

      const annotations: string[] = [];
      for (let n = iAnnotationItems.length; n >= 1; n--) {
        const [iAnnotationItemOpen, iAnnotationItemClose] = iAnnotationItems[n - 1];
        const l = state.tokens[iAnnotationItemOpen].map![0];
        annotations.unshift(`${n}:${l}`);

        state.tokens[iAnnotationItemOpen].attrSet("id", `--annotation-${l}`);
        state.tokens[iAnnotationItemOpen].attrSet("data-annotation", String(n));

        const linkOpen = new state.Token("link_open", "a", 1);
        linkOpen.attrSet("href", `#--annotated-${l}`);
        linkOpen.attrSet("aria-label", `Go to annotation marker ${n}`);

        const linkText = new state.Token("text", "", 0);
        linkText.content = String(n);

        const linkClose = new state.Token("link_close", "a", -1);

        const spanOpen = new state.Token("span_open", "span", 1);

        const spanClose = new state.Token("span_close", "span", -1);

        state.tokens.splice(iAnnotationItemClose, 0, spanClose);
        state.tokens.splice(iAnnotationItemOpen + 1, 0, linkOpen, linkText, linkClose, spanOpen);
      }

      state.tokens[iFence].info ??= "";
      state.tokens[iFence].info += ` data-annotations=${annotations.join(",")}`;
    }
  });
};
