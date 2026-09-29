#!/bin/zsh
cd "$(dirname "$0")"
if command -v node >/dev/null 2>&1; then
  node scripts/serve.mjs
elif command -v python3 >/dev/null 2>&1; then
  echo '请在浏览器打开 http://127.0.0.1:8765，关闭终端可停止。'
  python3 -m http.server 8765 --bind 127.0.0.1 --directory example/dist
else
  echo '请先安装 Node.js 22.12 或更高版本，再重新运行。'
fi
read '?按回车关闭此窗口。'
