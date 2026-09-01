import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjectTitle, projects, type Project } from "../data/projects";
import { useLanguage } from "../i18n/LanguageContext";

type ViewMode = "stack" | "grid";
type Props = { viewMode: ViewMode; onViewMode: (m: ViewMode) => void };

function TypeWords({ words, className = "" }: { words: string[]; className?: string }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setText(words[0]);
      return;
    }

    const word = words[wordIndex];
    let delay = deleting ? 70 : 120;
    if (!deleting && text === word) delay = 1500;
    if (deleting && text === "") delay = 320;

    const timer = window.setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setWordIndex((current) => (current + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deleting, text, wordIndex, words]);

  return (
    <span className={`home-type-word${className ? ` ${className}` : ""}`} aria-hidden="true">
      <span>{text}</span>
      <span className="home-type-cursor" />
    </span>
  );
}

function AsciiField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const glyphs = " .·:—=+*#%@";
    let frame = 0;
    let animationFrame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(bounds.width));
      height = Math.max(1, Math.floor(bounds.height));
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const render = () => {
      const styles = getComputedStyle(document.documentElement);
      const foreground = styles.getPropertyValue("--text").trim() || "#202020";
      const background =
        styles.getPropertyValue("--page-bg").trim() || "#ffffff";
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);
      context.fillStyle = foreground;
      context.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
      context.textAlign = "center";
      context.textBaseline = "middle";

      const cell = 10;
      const time = frame * 0.018;
      const cx = width * 0.5;
      const cy = height * (0.48 + Math.sin(time * 0.55) * 0.02);
      const scale = Math.min(width, height) * 0.46;
      const tentacleBases = [-0.62, -0.32, 0, 0.32, 0.62];
      const tentacleLengths = [0.48, 0.74, 0.58, 0.82, 0.52];

      for (let y = cell / 2; y < height; y += cell) {
        for (let x = cell / 2; x < width; x += cell) {
          const px = (x - cx) / scale;
          const py = (y - cy) / scale;
          const bellX = px / 1.08;
          const absX = Math.abs(bellX);
          const domeTop =
            -0.08 - Math.sqrt(Math.max(0, 1 - bellX * bellX)) * 0.84;
          const bellEdge = 0.12 + Math.cos(bellX * Math.PI * 3) * 0.055;
          const inBell = absX <= 1 && py >= domeTop && py <= bellEdge;
          const bellRim = inBell && py > bellEdge - 0.13;
          const bellTexture =
            0.58 +
            Math.sin(bellX * 10 + time) * 0.13 +
            Math.cos(py * 12 - time * 0.8) * 0.12;

          let tentacleStrength = 0;
          if (py > 0.08 && py < 1.42) {
            tentacleBases.forEach((base, index) => {
              const length = tentacleLengths[index];
              if (py > length) return;
              const sway =
                Math.sin(
                  py * (4.2 + index * 0.25) - time * 1.8 + index * 1.15,
                ) *
                (0.055 + py * 0.035);
              const taper = 0.078 - Math.min(py, 1) * 0.016;
              const distance = Math.abs(px - base - sway);
              if (distance < taper)
                tentacleStrength = Math.max(
                  tentacleStrength,
                  0.9 - (distance / taper) * 0.35,
                );
            });
          }

          const innerArm =
            py > 0.02 &&
            py < 0.58 &&
            absX < 0.42 &&
            Math.abs(px - Math.sin(py * 6 - time) * 0.09) < 0.16;
          let value = inBell ? bellTexture : 0;
          if (bellRim) value = Math.max(value, 0.86);
          if (innerArm) value = Math.max(value, 0.48);
          value = Math.max(value, tentacleStrength);
          if (value < 0.12) continue;
          const glyph =
            glyphs[
              Math.min(glyphs.length - 1, Math.floor(value * glyphs.length))
            ];
          context.globalAlpha = 0.02 + Math.pow(value, 1.75) * 0.44;
          context.fillText(glyph, x, y);
        }
      }
      context.globalAlpha = 1;
      if (!reduceMotion.matches) {
        frame += 1;
        animationFrame = requestAnimationFrame(render);
      }
    };

    const observer = new ResizeObserver(() => {
      resize();
      cancelAnimationFrame(animationFrame);
      render();
    });
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="home-ascii"
      aria-label="动态 ASCII 水母图形"
      role="img"
    />
  );
}

export function Home(_props: Props) {
  const { locale } = useLanguage();
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  useEffect(() => {
    document.title = "DESIGN.4x";
  }, []);

  const openProject = (project: Project) =>
    navigate(`/project/${project.slug}`);
  const intro =
    locale === "zh"
      ? "也可以叫我泗澄或 4X，欢迎来到我的个人网站。"
      : "Welcome to my personal site. A brief intro — I'm a product designer";
  const sub =
    locale === "zh"
      ? "一直在做AI、效率、生产力工具，感谢关注。"
      : "working on AI, productivity, and efficiency tools. Thanks for following along.";
  const categories =
    locale === "zh"
      ? ["全部", "人工智能", "工具应用", "网页服务", "设计系统"]
      : ["All", "AI", "Tools", "Web", "Design systems"];
  const projectTags =
    locale === "zh"
      ? [
          ["AI Native", "用户增长", "商业化"],
          ["Demo", "可观测性", "产品设计"],
          ["全栈设计"],
          ["设计系统", "Agent UI"],
          ["工具应用", "数据库开发"],
          ["工具应用", "数据库运维"],
        ]
      : [
          ["AI Native", "Growth", "Commercialization"],
          ["Demo", "Observability", "Product Design"],
          ["Full-stack Design"],
          ["Design System", "Agent UI"],
          ["Tools", "Database Development"],
          ["Tools", "Database Operations"],
        ];
  const effectiveProjects = projects;
  const selected = useMemo(() => {
    const all = effectiveProjects.map((project, index) => ({ project, index }));
    if (category === "all") return all;
    const groups = [[0, 1, 2], [4, 5], [0, 1, 2, 3, 4, 5], [3]];
    const group = groups[Number(category) - 1] ?? [];
    return all.filter((item) => group.includes(item.index));
  }, [category, effectiveProjects]);

  return (
    <main className="home-redesign">
      <section className="home-hero">
        <div className="home-hero-copy">
          <h1>
            {locale === "zh" ? (
              <>
                你好，我是任文倩{" "}
                <span className="home-wave" aria-hidden="true">
                  👋🏻
                </span>
              </>
            ) : (
              "Hi, I'm Ren Wenqian."
            )}
          </h1>
          <p className="home-intro">
            {locale === "zh" ? (
              <>
                产品设计师，专注于 AI、效率工具与生产力产品设计
                <br />
                也可以叫我 泗澄 或 4X，欢迎来到我的个人网站
              </>
            ) : (
              <>
                {intro} {sub}
              </>
            )}
          </p>
          <div className="home-hero-meta">
            <span>{locale === "zh" ? "中国杭州" : "Hangzhou, China"}</span>
            <span>{locale === "zh" ? "产品设计师" : "Product designer"}</span>
            <span>E/INFP</span>
          </div>
        </div>
        <AsciiField />
      </section>

      <section className="home-work" aria-labelledby="selected-work-title">
        <div className="products-intro">
          <p className="products-desc" id="selected-work-title">
            {locale === "zh"
              ? "打造用户真正需要的产品"
              : "Building products users truly need"}
          </p>
          <div
            className="products-filters"
            role="tablist"
            aria-label={locale === "zh" ? "产品分类" : "Product categories"}
          >
            {categories.map((label, index) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={
                  category === (index === 0 ? "all" : String(index))
                }
                className={
                  category === (index === 0 ? "all" : String(index))
                    ? "is-active"
                    : ""
                }
                onClick={() => setCategory(index === 0 ? "all" : String(index))}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="products-grid">
          {selected.map(({ project, index }) => {
                const defaultIndex = projects.findIndex(
                  (item) => item.slug === project.slug,
                );
                const tags = projectTags[defaultIndex >= 0 ? defaultIndex : index] || [];
                return (
                  <article
                    className={`product-card${project.slug === "dataagent" ? " product-card-datapilot" : ""}${project.slug === "agentops" ? " product-card-agentops" : ""}${project.slug === "Memory" ? " product-card-memory" : ""}${project.slug === "aidesignsystem" ? " product-card-design-system" : ""}${project.slug === "datadevelop" ? " product-card-odc" : ""}${project.slug === "databaseops" ? " product-card-oceanbase" : ""}`}
                    key={project.id}
                  >
                    <button
                      className="product-card-link"
                      onClick={() => openProject(project)}
                    >
                      <div className="product-card-media">
                        <img src={project.image} alt="" />
                        {project.slug === "dataagent" ? (
                          <div className="datapilot-logo" aria-label="OceanBase DataPilot">
                            <img src="/images/oceanbase-logo.svg" alt="OceanBase" />
                          </div>
                        ) : project.slug === "agentops" ? (
                          <div className="agentops-logo" aria-label="AgentOps">
                            <svg
                              className="agentops-logo-mark"
                              viewBox="0 0 64 64"
                              aria-hidden="true"
                            >
                              <path
                                d="M16 18 32 9l16 9v18L32 45l-16-9Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                              />
                              <path
                                d="m16 18 16 9 16-9M32 27v18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                              />
                              <circle
                                cx="16"
                                cy="18"
                                r="4"
                                fill="currentColor"
                              />
                              <circle
                                cx="48"
                                cy="18"
                                r="4"
                                fill="currentColor"
                              />
                              <circle
                                cx="32"
                                cy="45"
                                r="4"
                                fill="currentColor"
                              />
                            </svg>
                            <span>
                              Agent
                              <span className="agentops-logo-accent">Ops</span>
                            </span>
                          </div>
                        ) : project.slug === "Memory" ? (
                          <div className="memory-logo" aria-label="seekdb M0">
                            <span>
                              seekdb <b>M0</b>
                            </span>
                          </div>
                        ) : project.slug === "aidesignsystem" ? (
                          <div
                            className="design-system-logo"
                            aria-label="Design System"
                          >
                            <svg
                              className="design-system-logo-mark"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <defs>
                                <linearGradient id="design-system-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                                  <stop stopColor="#0096fe" />
                                  <stop offset="1" stopColor="#c49ffe" />
                                </linearGradient>
                              </defs>
                              <rect
                                x="5"
                                y="5"
                                width="15"
                                height="15"
                                rx="2"
                                fill="url(#design-system-gradient)"
                              />
                              <rect
                                x="28"
                                y="5"
                                width="15"
                                height="15"
                                rx="2"
                                fill="url(#design-system-gradient)"
                                opacity=".72"
                              />
                              <rect
                                x="5"
                                y="28"
                                width="15"
                                height="15"
                                rx="2"
                                fill="url(#design-system-gradient)"
                                opacity=".72"
                              />
                              <path
                                d="M20 12.5h8M12.5 20v8M20 35.5h8M35.5 20v8"
                                stroke="url(#design-system-gradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                              <rect
                                x="28"
                                y="28"
                                width="15"
                                height="15"
                                rx="2"
                                fill="url(#design-system-gradient)"
                              />
                            </svg>
                            <span>
                              DESIGN <b>SYSTEM</b>
                            </span>
                          </div>
                        ) : project.slug === "datadevelop" ? (
                          <div
                            className="odc-logo"
                            aria-label="OceanBase 开发者中心"
                          >
                            <img
                              className="odc-logo-mark"
                              src="/images/odc-logo.svg"
                              alt=""
                            />
                            <span>
                              <strong>OceanBase</strong>
                              <b>开发者中心</b>
                            </span>
                          </div>
                        ) : project.slug === "databaseops" ? (
                          <div className="oceanbase-logo">
                            <img
                              className="oceanbase-brand-image"
                              src="/images/oceanbase-logo.svg"
                              alt="OceanBase"
                            />
                          </div>
                        ) : null}
                      </div>
                      <div className="product-card-copy">
                        <h3>{getProjectTitle(project, locale)}</h3>
                        <div className="product-tags">
                          {tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </button>
                  </article>
                );
              })}
        </div>
      </section>

      <section
        className="home-perspective"
        aria-labelledby="product-perspective-title"
      >
        <div className="home-perspective-intro">
          <h2
            id="product-perspective-title"
            aria-label={locale === "zh" ? "让正确、可控、持续的设计更容易发生" : "Make correct, controllable, and sustainable design easier to happen"}
          >
            {locale === "zh" ? (
              <span className="home-perspective-title-line">让<TypeWords words={["正确", "可控", "持续"]} />的设计更容易发生</span>
            ) : (
              <span className="home-perspective-title-line">Make<TypeWords className="is-en" words={["Correct", "Controllable", "Sustainable"]} />Design Easier to Happen</span>
            )}
          </h2>
        </div>
        <div className="home-perspective-list">
          <article>
            <div>
              <h3>
                {locale === "zh"
                  ? "找对问题再设计答案"
                  : "Find the right problem before designing the answer"}
              </h3>
              <p>
                {locale === "zh"
                  ? "从用户反馈与行为数据中找准问题，在用户、业务与技术之间验证解法"
                  : "Use feedback and behavioral data to find the right problem and validate solutions across user, business, and technical needs"}
              </p>
            </div>
          </article>
          <article>
            <div>
              <h3>
                {locale === "zh"
                  ? "复杂系统清晰可控"
                  : "Complex systems made clear and controllable"}
              </h3>
              <p>
                {locale === "zh"
                  ? "梳理 Agent 与专业工具的信息、流程与反馈，让用户理解系统如何工作并能在关键节点确认、调整或纠正"
                  : "Clarify the information, flows, and feedback in agents and professional tools so users understand how the system works and can intervene when needed"}
              </p>
            </div>
          </article>
          <article>
            <div>
              <h3>
                {locale === "zh"
                  ? "让一次设计变为持续能力"
                  : "Turn each design into lasting capability"}
              </h3>
              <p>
                {locale === "zh"
                  ? "将有效方案沉淀为规范、组件与工程约束，让好的设计持续复用"
                  : "Turn effective solutions into standards, components, and engineering constraints so good design can be reused"}
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
