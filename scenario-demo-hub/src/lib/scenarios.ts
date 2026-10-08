import { scenarioConfigSchema, type ScenarioConfig } from "../schema/scenario";

/**
 * 场景配置加载：构建时经 scripts/validate.ts 全量校验（fail-loud）；
 * 运行时再做一次 zod parse 兜底（防御深度，成本可忽略）。
 */
const modules = import.meta.glob("../../scenarios/*.json", {
  eager: true,
  import: "default",
});

export const scenarios: ScenarioConfig[] = Object.entries(modules)
  .map(([path, raw]) => {
    const parsed = scenarioConfigSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`场景配置解析失败 ${path}: ${parsed.error.message}`);
    }
    return parsed.data;
  }).filter(item=>{
    console.log({item});
    
    return item.id !== "contract-blueprint";
  })
   .sort((a, b) => a.id.localeCompare(b.id));

export function getScenario(id: string): ScenarioConfig | undefined {
  return scenarios.find((s) => s.id === id);
}
