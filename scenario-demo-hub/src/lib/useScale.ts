import { useLayoutEffect, useRef, useState } from "react";

/**
 * 演示现场自适应：页面按逻辑宽度（默认 1360）渲染，
 * 容器不足时整体 transform: scale 缩放，避免投影仪横向滚动。
 * 上限 1.15 防止大屏过度放大；外层高度随缩放同步收拢，不留空白尾。
 */
export function useScale(baseWidth: number) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const update = () => {
      const w = outer.clientWidth;
      if (w === 0) return;
      const s = Math.min(1.15, w / baseWidth);
      setScale(s);
      // 高度收拢：用未取整的布局高度（scrollHeight 是取整值会丢亚像素，
      // 缩放后放大成 2~5px，把页尾 .note 裁掉），ceil 后再留 2px 覆盖
      // 末元素 margin 折叠与浏览器取整残差。
      const h = inner.getBoundingClientRect().height * s;
      outer.style.height = `${Math.ceil(h) + 2}px`;
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [baseWidth]);

  return { outerRef, innerRef, scale };
}
