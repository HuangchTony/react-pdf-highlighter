import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../example/dist');
const port = Number(process.env.PORT || 8765);
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.pdf':'application/pdf','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.bcmap':'application/octet-stream','.pfb':'application/octet-stream','.ttf':'font/ttf'};
if (!fs.existsSync(path.join(root, 'index.html'))) { console.error('缺少构建文件，请先运行 npm ci 和 npm run build。'); process.exit(1); }
const server = http.createServer((req,res) => {
  let filename;
  try { filename = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname)); } catch { res.writeHead(400).end(); return; }
  if (filename !== root && !filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (filename === root) filename = path.join(root,'index.html');
  fs.stat(filename,(err,stat) => {
    if (err || !stat.isFile()) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200,{'Content-Type':mime[path.extname(filename)] || 'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    fs.createReadStream(filename).pipe(res);
  });
});
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `端口 ${port} 已占用。如果阅读器已打开，直接访问 http://127.0.0.1:${port}；否则先关闭占用端口的程序。` : error.message); process.exit(1); });
server.listen(port,'127.0.0.1',() => console.log(`IPO 研读室已启动：http://127.0.0.1:${port}\n请在浏览器打开此地址。关闭本窗口或按 Ctrl+C 停止。`));
