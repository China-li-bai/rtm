import type { ReactNode } from "react";

/**
 * 受限富文本：配置中仅允许 <b>…</b> 与 <br>，其余按纯文本转义渲染。
 * 配置为可信内部内容，但仍不放任任意 HTML（XSS 边界纪律）。
 */
export function rich(text: string): ReactNode {
  const parts = text.split(/(<b>|<\/b>|<br>)/);
  const out: ReactNode[] = [];
  let bold = false;
  let buf = "";
  let key = 0;
  const flush = () => {
    if (buf === "") return;
    out.push(bold ? <b key={key++}>{buf}</b> : buf);
    buf = "";
  };
  for (const p of parts) {
    if (p === "<b>") {
      flush();
      bold = true;
    } else if (p === "</b>") {
      flush();
      bold = false;
    } else if (p === "<br>") {
      flush();
      out.push(<br key={key++} />);
    } else {
      buf += p;
    }
  }
  flush();
  return out;
}
