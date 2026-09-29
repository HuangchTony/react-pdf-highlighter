import type { IHighlight } from "./react-pdf-highlighter";

export type Category = "证据" | "疑问" | "反证" | "观点";
export interface Note extends IHighlight {
  category: Category;
  createdAt: string;
}
export interface ReadingDocument {
  id: string;
  title: string;
  source: string;
  question: string;
  highlights: Note[];
  concepts?: string;
  summary?: string;
  uncertainty?: string;
  file?: Blob;
}
export const demo: ReadingDocument = {
  id: "w1-seila-law",
  title: "Seila Law LLC v. CFPB",
  source: "https://www.supremecourt.gov/opinions/19pdf/19-7_n6io.pdf",
  question: "法院如何分析独立机构的结构与总统免职权？",
  highlights: [],
};
export const builtInDemos: ReadingDocument[] = [
  demo,
  { id: "w1-trump-wilcox", title: "Trump v. Wilcox", source: "https://www.supremecourt.gov/opinions/24pdf/24a966_1b8e.pdf", question: "总统能否撤换独立机构成员？法院如何处理紧急申请与行政权边界？", highlights: [] },
  { id: "w1-learning-resources-trump", title: "Learning Resources, Inc. v. Trump / Trump v. V.O.S. Selections, Inc.", source: "https://www.supremecourt.gov/opinions/25pdf/24-1287_new_3135.pdf", question: "IEEPA 是否授权总统征收关税？法院如何区分紧急经济权力与税收权？", highlights: [] },
];
export function isBuiltIn(id: string) { return builtInDemos.some((d) => d.id === id); }
let database: Promise<IDBDatabase> | undefined;
function db() {
  if (!database)
    database = new Promise((resolve, reject) => {
      const request = indexedDB.open("ipo-reading-room", 1);
      request.onupgradeneeded = () =>
        request.result.createObjectStore("documents", { keyPath: "id" });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  return database;
}
export async function loadDocuments(): Promise<ReadingDocument[]> {
  const database = await db();
  return new Promise((resolve, reject) => {
    const request = database
      .transaction("documents")
      .objectStore("documents")
      .getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function saveDocument(doc: ReadingDocument): Promise<void> {
  const database = await db();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("documents", "readwrite");
    transaction.objectStore("documents").put(doc);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}
export function markdown(doc: ReadingDocument) {
  return [
    `# ${doc.title}`,
    "",
    `来源：${doc.source || "本地导入 PDF"}`,
    "",
    `研读问题：${doc.question || "尚未填写"}`,
    "",
    "> 页码为 PDF 页序，并非文书印刷页码。下列评论是读者笔记，不代表已经核验的结论。",
    "",
    ...doc.highlights.flatMap((note, index) => [
      `## ${index + 1}. ${note.category} · PDF 第 ${note.position.pageNumber} 页`,
      "",
      "### 原文摘录",
      "",
      note.content.text
        ? note.content.text
            .split("\n")
            .map((line) => `> ${line}`)
            .join("\n")
        : "（区域批注，未提取文字；请回看 PDF）",
      "",
      "### 我的理解 / 待核问题",
      "",
      note.comment.text || "（尚未填写）",
      "",
      `记录时间：${note.createdAt}`,
      "",
    ]),
    "## 陌生概念：我的解释与来源",
    "",
    doc.concepts || "（尚未填写）",
    "",
    "## 闭卷复述",
    "",
    doc.summary || "（尚未填写）",
    "",
    "## 仍不确定 / 下一步核查",
    "",
    doc.uncertainty || "（尚未填写）",
    "",
    "---",
    "由 IPO 研读室导出 · 计算法学方法 W2",
    "",
  ].join("\n");
}
export function downloadFile(name: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function removeDocument(id: string): Promise<void> {
  if (isBuiltIn(id)) return;
  const database = await db();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("documents", "readwrite");
    transaction.objectStore("documents").delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}
