import { useEffect, useMemo, useRef, useState } from "react";
import { BlueprintCanvas } from "../components/BlueprintCanvas";
import { CompareSection } from "../components/CompareSection";
import { DetailPanel } from "../components/DetailPanel";
import { FlowCanvas } from "../components/FlowCanvas";
import { RefModal } from "../components/RefModal";
import { buildRefs } from "../lib/refs";
import { rich } from "../lib/rich";
import { useScale } from "../lib/useScale";
import type { ScenarioConfig } from "../schema/scenario";

/** 三段叙事章节：痛点（为什么）→ 流程（怎么做）→ 对比（带来什么） */
const SECTIONS = [
  { key: "pain", no: "01", title: "业务场景与用户痛点" },
  { key: "flow", no: "02", title: "场景融合使用流程" },
  { key: "compare", no: "03", title: "使用 AI 前后对比" },
] as const;
type SectionKey = (typeof SECTIONS)[number]["key"];

/**
 * 场景演示页：吸顶导航 + 三段叙事 + 右侧抽屉详情。
 * 导航与抽屉渲染在 scale-outer 层（fixed），不受 inner transform 影响，始终原生尺寸可读。
 */
export function ScenarioPage({ cfg }: { cfg: ScenarioConfig }) {
  const refs = useMemo(() => buildRefs(cfg), [cfg]);
  const [selectedId, setSelectedId] = useState<string | null>(cfg.flow.defaultSelected ?? null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalRef, setModalRef] = useState<string | null>(null);
  const [active, setActive] = useState<SectionKey>("pain");
  const { outerRef, innerRef, scale } = useScale(cfg.flow.width);
  const secRefs = useRef<Partial<Record<SectionKey, HTMLElement | null>>>({});

  const selected = cfg.flow.nodes.find((n) => n.id === selectedId) ?? null;

  /** scrollspy：章节进入视口中段即高亮对应导航；触底时末段不足一屏，强制高亮末段 */
  useEffect(() => {
    const nearBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
    const io = new IntersectionObserver(
      (entries) => {
        if (nearBottom()) { setActive(SECTIONS[SECTIONS.length - 1].key); return; }
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.getAttribute("data-sec") as SectionKey);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const el of Object.values(secRefs.current)) if (el) io.observe(el);
    const onScroll = () => { if (nearBottom()) setActive(SECTIONS[SECTIONS.length - 1].key); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  /** ESC 关抽屉——单层关闭：弹窗（RefModal）开着时本次 Esc 只归弹窗，抽屉不吃 */
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (modalRef) return;
      setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, modalRef]);

  /** 锚点跳转：物理坐标计算，天然兼容 inner 缩放 */
  const jump = (key: SectionKey) => {
    const el = secRefs.current[key];
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: "smooth" });
  };

  /** 点节点：高亮 + 开抽屉；取消选中（点空白）仅清高亮 */
  const selectNode = (id: string | null) => {
    setSelectedId(id);
    if (id) setDrawerOpen(true);
  };

  return (
    <div className="scale-outer" ref={outerRef}>
      <nav className="topbar">
        <div className="tb-left">
          <a className="tb-back" href="#/">← 场景中心</a>
          <span className="tb-div" />
          <span className="tb-title">{cfg.title}</span>
        </div>
        <div className="tb-secs">
          {SECTIONS.map((s) => (
            <button key={s.key} className={`tb-sec${active === s.key ? " on" : ""}`} onClick={() => jump(s.key)}>
              {s.title}
            </button>
          ))}
        </div>
      </nav>

      <div className="scale-inner" ref={innerRef} style={{ transform: `scale(${scale})` }}>
        <h1 className="hero-h1">
          {cfg.title}
          {cfg.subtitle && <small>{cfg.subtitle}</small>}
        </h1>

        <section data-sec="pain" ref={(el) => { secRefs.current.pain = el; }}>
          <h2 className="sec-h">
            <em>01</em>业务场景与用户痛点<small>点击卡片查看完整场景与解决方案</small>
          </h2>
          <div className="whycards">
            {cfg.scenarios.map((s) => {
              const r = refs.get(s.id)!;
              return (
                <div className="wc scn" key={s.id} onClick={() => setModalRef(s.id)}>
                  <div className="row1">
                    <span className="chip-s s">{r.chip}</span>
                    <span className="name">{s.name}</span>
                    <span className="kw">{s.kw}</span>
                  </div>
                  <div className="story">{s.card}</div>
                  <span className="more">完整场景与解决方案 ↗</span>
                </div>
              );
            })}
            {cfg.constraints.map((c) => {
              const r = refs.get(c.id)!;
              return (
                <div className="wc con" key={c.id} onClick={() => setModalRef(c.id)}>
                  <div className="row1">
                    <span className="chip-s c">{r.chip}</span>
                    <span className="name">{c.name}</span>
                    <span className="kw">{c.kw}</span>
                  </div>
                  <div className="story">{c.card}</div>
                  <span className="more">完整约束与解决方案 ↗</span>
                </div>
              );
            })}
          </div>
        </section>

        <section data-sec="flow" ref={(el) => { secRefs.current.flow = el; }}>
          <h2 className="sec-h">
            <em>02</em>场景融合使用流程
            <small>实线橙＝业务主流程 ｜ 橙虚线＝反哺 · 兜底 ｜ 点击任一环节查看它解决的场景与解法</small>
          </h2>
          {cfg.flow.bizContext && (
            <div className="biz-ctx">
              <span className="biz-ctx-tag">上级业务</span>
              <span className="biz-ctx-body">{rich(cfg.flow.bizContext)}</span>
            </div>
          )}
          {cfg.flow.drill ? (
            <BlueprintCanvas flow={cfg.flow} selectedId={selectedId} onSelect={selectNode} />
          ) : (
            <FlowCanvas flow={cfg.flow} selectedId={selectedId} onSelect={selectNode} />
          )}
        </section>

        <section data-sec="compare" ref={(el) => { secRefs.current.compare = el; }}>
          <CompareSection cfg={cfg} no="03" />
        </section>
      </div>

      {drawerOpen && selected && (
        <>
          <div className="drawer-mask" onClick={() => setDrawerOpen(false)} />
          <aside className="drawer">
            <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="关闭详情">✕</button>
            <DetailPanel node={selected} refs={refs} onOpenRef={setModalRef} />
          </aside>
        </>
      )}

      {modalRef && <RefModal refId={modalRef} cfg={cfg} refs={refs} onClose={() => setModalRef(null)} />}
    </div>
  );
}
