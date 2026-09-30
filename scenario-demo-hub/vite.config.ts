import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

/**
 * 构建红线：base './' + 单文件内联——产物双击 index.html 即开（零安装）。
 * 配置校验由 package.json build 脚本前置（fail-loud）。
 */
export default defineConfig({
  base: "./",
  plugins: [react(), viteSingleFile()],
});
