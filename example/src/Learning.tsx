import type { ReadingDocument } from "./storage";

export function Learning({
  doc,
  update,
  jump,
  ai,
  generating,
}: {
  doc: ReadingDocument;
  update: (patch: Partial<ReadingDocument>) => void;
  jump: (page: number) => void;
  ai: () => void;
  generating: boolean;
}) {
  const isDemo = doc.id === "w1-seila-law";
  return (
    <div className="learning-content">
      <button
        className="study-prompt"
        type="button"
        disabled={generating}
        onClick={ai}
      >
        {generating ? "正在整理原文…" : "生成研读任务单（交给 AI）↗"}
      </button>
      <p className="prompt-hint">
        提取前 12 页，生成带页码证据、概念解释和自测问题的 Markdown 任务单；需要你复制给 ChatGPT、Claude 或其他 AI，本阅读器不会自动调用 AI，也不会上传文献。
      </p>
      <h3>01 / 先建立地图</h3>
      {isDemo ? (
        <>
          <p>
            先抓住三个角色：国会设计机构，总统监督行政官员，法院审查这种安排。读这份文书时，关注“谁能免去谁的职务，以及为什么”。
          </p>
          <p className="learning-notice">
            AI 辅助导读，来自 W1 案例集及 2020
            年原文，待你核验。用于理解这份裁判，不代表当前法律状态。
          </p>
          <details>
            <summary>四个入门概念：点开解释</summary>
            <p>
              <strong>CFPB</strong>
              ：消费者金融保护机构，本案围绕其领导结构展开。
              <br />
              <strong>Removal protection</strong>：限制总统免职理由的保护。
              <br />
              <strong>Separation of powers</strong>
              ：分权，本案关注国会的制度设计与总统行政权的关系。
              <br />
              <strong>Severability</strong>
              ：可分离性——某条款有问题时，其余法律安排能否继续存在。
              <br />
              先定位 PDF 第 1–5 页摘要，再回到正文核对；摘要不属于法院意见正文。
            </p>
          </details>
        </>
      ) : (
        <p>
          先看标题、目录、摘要或开头：这是什么类型的材料？谁写给谁？它试图回答哪个问题？只记下你当前最需要弄懂的一件事。
        </p>
      )}
      <h3>02 / 三遍读，不急着逐字读</h3>
      <div className="learning-step">
        <strong>第一遍 · 情境与争点</strong>
        <p>
          {isDemo
            ? "先了解 CFPB 和律师事务所为什么发生争议。试着用一句话写出争点。"
            : "扫读开头、标题和结尾，找出背景、核心问题与作者的回答。"}
        </p>
        {isDemo && (
          <button type="button" onClick={() => jump(1)}>
            打开摘要 · PDF 第 1 页 ↗
          </button>
        )}
      </div>
      <div className="learning-step">
        <strong>第二遍 · 结论与理由</strong>
        <p>
          {isDemo
            ? "找到法院对免职保护的结论。它依赖哪些机构特征？标记一句支持性原文。"
            : "精读关键段落，分别标出结论、证据和推理；为不懂的术语建立自己的解释。"}
        </p>
        {isDemo && (
          <button type="button" onClick={() => jump(8)}>
            打开结论概述 · PDF 第 8 页 ↗
          </button>
        )}
      </div>
      <div className="learning-step">
        <strong>第三遍 · 例外与边界</strong>
        <p>
          {isDemo
            ? "免职保护被认定有问题，是否等于整个机构失效？查看可分离性讨论，并注意不同法官加入意见的范围。"
            : "寻找例外、反对意见和适用条件。什么新证据会改变你刚形成的理解？"}
        </p>
        {isDemo && (
          <button type="button" onClick={() => jump(35)}>
            打开可分离性讨论 · PDF 第 35 页 ↗
          </button>
        )}
      </div>
      <label className="field-label">
        陌生概念 → 用自己的话解释
        <textarea
          key={`${doc.id}-concepts`}
          aria-label="陌生概念"
          value={doc.concepts || ""}
          placeholder="术语：我的解释；原文页码；还不确定的地方"
          onChange={(e) => update({ concepts: e.target.value })}
        />
      </label>
      <h3>03 / 盖住原文，检验理解</h3>
      <p>
        {isDemo
          ? "请向没读过本案的人解释：双方争什么？法院为什么这样判断？为什么不能推出“整个 CFPB 无效”？"
          : "用三句话说明：材料回答什么问题、依据是什么、结论有什么边界。卡住的地方就是下一次阅读的入口。"}
      </p>
      <label className="field-label">
        我的闭卷复述
        <textarea
          key={`${doc.id}-summary`}
          aria-label="闭卷复述"
          value={doc.summary || ""}
          placeholder="问题是……关键理由是……但这不意味着……"
          onChange={(e) => update({ summary: e.target.value })}
        />
        <small>写完再回看原文核对。这里不由 AI 自动打分。</small>
      </label>
      <label className="field-label">
        仍不确定 / 下一步核查
        <textarea
          key={`${doc.id}-uncertainty`}
          aria-label="待核问题"
          value={doc.uncertainty || ""}
          placeholder="我还不确定……准备查阅……"
          onChange={(e) => update({ uncertainty: e.target.value })}
        />
      </label>
      {isDemo && (
        <a href={doc.source} target="_blank" rel="noreferrer">
          核对最高法院原文 ↗
        </a>
      )}
    </div>
  );
}
