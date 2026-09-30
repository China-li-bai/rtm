# agent-browser headless 实测技巧

> 场景：无头浏览器自动化验证 SPA 交互。本项目实测环境：agent-browser + headless Chrome。

## 断言 React 交互：click 与断言之间必须 wait
`dispatchEvent(click)` 后立即读 DOM 会 race React 异步渲染（读到旧树）。
正确节奏：click → `agent-browser wait 300`（或 `--load networkidle`）→ 再 eval 断言。

## 已确认的工具缺陷：`press Escape` 可能杀掉整个会话
现象：对页面执行 `agent-browser press Escape` 后，会话偶发掉到 `about:blank`，
DOM 全空、截图全白。与 app 代码无关（对照实验：app 层 Esc 监听行为完全正确）。
**替代方案**：用 JS 派发键盘事件验证 Esc 行为——
`document.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true}))`
若 `press` 后页面变 blank，重新 `agent-browser open <url>` 恢复即可，先验证是否为工具问题再怀疑代码。

## 稳定交互手法
- 点击 React 元素：`eval` 中 `el.dispatchEvent(new MouseEvent("click", {bubbles: true}))`——
  bubbles 必须为 true，React 事件委托在根节点，不冒泡触发不到 onClick。
- 元素定位优先语义查询：`Array.from(document.querySelectorAll(".bdg")).find(x => x.textContent.includes("筛得到"))`，
  比 nth-child 稳定，不受结构调整影响。
- 复杂表达式用 `eval --stdin <<'EOF'` 传多行脚本，避免 shell 引号转义地狱。

## file:// 验证零安装产物
`agent-browser --allow-file-access open "file:///abs/path/dist/index.html"`——
单文件产物 + hash 路由下，交互链路（路由切换/弹窗/缩放）与 http 服务下行为一致。

## 截图目录不存在会报错
`screenshot <path>` 要求目录已存在，先 `mkdir -p shots`；注意终端 cwd 会跨命令漂移，
建议截图永远用绝对路径。
