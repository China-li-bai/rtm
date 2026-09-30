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
      outer.style.height = `${inner.scrollHeight * s}px`;
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [baseWidth]);

  return { outerRef, innerRef, scale };
}
