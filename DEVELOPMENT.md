# 这次 Git 操作与后续练习

## 已经实际完成

```sh
git clone https://github.com/agentcooper/react-pdf-highlighter.git personal-reader
cd personal-reader
git switch -c week2-reader
npm ci
```

`origin` 当前仍指向作者仓库。Clone 不依赖 Fork，也没有因此向作者发送修改。

## 在 GitHub Desktop 里接着学

1. File → Add Local Repository，选择本项目 `personal-reader` 文件夹。
2. Current Branch 会显示 `week2-reader`。Changes 展示这次所有本地改动，History 目前是上游历史。
3. 点击 `example/src/Learning.tsx` 或 `App.tsx` 查看修改；绿色表示新增、红色表示删除。
4. 自己完成第一次 Commit：标题可用 `Build Week2 personal reading room`。这只保存本地版本，不会上传。
5. 想同步到自己 GitHub 时，在原仓库网页 Fork，再把本地 origin 指向个人 Fork（保留作者仓库为 upstream），然后 Push。首次操作时与 Codex 一起核对仓库地址。
6. 下次试新功能：从稳定版本创建 `feature-reading-v2` 分支；做好后合并回自己的主分支。要固定作业提交版本，可在提交后加 `week2-v1.0` 标签。

## 三个概念的关系

- Fork：仓库层面，建立你账号下的派生仓库。
- Clone：位置层面，将仓库下载到电脑。
- Branch：仓库内部，建立另一条开发路线。

可以在没有 Fork 的本地 Clone 里创建很多 Branch；后续上传时再决定远程归属。作业 ZIP 是某一时点的提交快照，继续开发仍编辑本项目源码。
