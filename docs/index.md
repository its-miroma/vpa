# VitePress Plugin Annotations

hello

```ts
{
  markdown: {
    codeTransformers: [annotationsTransformer /* @1 */],
    config: (md) => {
      md.use(annotationsPlugin /* @2 */); /* @3 */
    },
  },
}
```

1. shiki transformer
2. markdown-it plugin
3. Three (`here's some code`): Hello **World** my name is lol

   hello this is some more indented stuff:
   - Hello
   - World
   - My
   - Name
   - Is:
   1. One
   2. Two
   3. Hello jnsadjknckjsdnckjnskcnsdkcjnsdkcnsdkjcnsdkcnsdkjsdckjdsncks kjdnsckjdsncksdnci
   4. To you!

   ```md
   Hello World!nldnlncjsdnckjdsnckjdsnckjdsnckjsdnckjsndkcjnsdkjcnsdkjncksdjncks daskldjas aslk jdasj alskdj aslkj aslkd jaslkd j lksadj laksdj lkjd salkdj laskdj
   ```

4. Four jhsdlasjdasjdlkasjdla kjlasdj lasjd laskjd lasjdlk ajsdl jasldj aslkdj laskdj laskjd lasjd lkasjd lkasj
5. Five
6. Six
7. Seven
8. Eight
9. Nine
10. Ten (double digit)

^^^

<<< @/.vitepress/config/index.ts

1. shiki transformer
2. markdown-it plugin

^^^

<<< @/.vitepress/theme/index.ts

1. **Possibility 1**: import directly in `index.ts`. This may also require `env.d.ts` with the contents below.
2. **Possibility 2**: import within `style.css`. See below
   ::: info

   Hello

   :::

^^^

<<< @/.vitepress/theme/env.d.ts

<<< @/.vitepress/theme/style.css
