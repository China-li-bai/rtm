import { useEffect, useState } from "react";
import { getScenario } from "./lib/scenarios";
import { HubHome } from "./pages/HubHome";
import { ScenarioPage } from "./pages/ScenarioPage";

/** hash 路由：file:// 双击即开场景下唯一可用的路由形态（零安装红线） */
function useHash(): string {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHash();
  const m = hash.match(/^#\/s\/([a-z0-9-]+)$/);
  if (m) {
    const cfg = getScenario(m[1]);
    if (cfg) return <ScenarioPage cfg={cfg} />;
    return (
      <div>
        <a className="back-home" href="#/">← 场景中心</a>
        <h1>场景不存在 <small>{m[1]}</small></h1>
      </div>
    );
  }
  return <HubHome />;
}
