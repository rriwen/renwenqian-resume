import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjectTitle, projects, type Project } from "../data/projects";
import { useLanguage } from "../i18n/LanguageContext";

const Lanyard = lazy(() => import("../components/Lanyard/Lanyard"));

type ViewMode = "stack" | "grid";
type Props = { dark: boolean; viewMode: ViewMode; onViewMode: (m: ViewMode) => void };

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

export function Home({ dark }: Props) {
  const { locale } = useLanguage();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "DESIGN.4x";
  }, []);

  const openProject = (project: Project) =>
    navigate(`/project/${project.slug}`);
  const intro =
    locale === "zh"
      ? "也可以叫我泗澄或 4X，欢迎来到我的个人网站。"
      : "I'm a product designer focused on AI and productivity tools.";
  const sub =
    locale === "zh"
      ? "一直在做AI、效率、生产力工具，感谢关注。"
      : "I make complex workflows simple and intuitive.";
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

  return (
    <main className="page-shell home-redesign">
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
                产品设计师，也可以叫我 泗澄 或 4X
                <br />
                专注于 AI 产品、数据工具与复杂系统体验
              </>
            ) : (
              <>
                {intro} {sub}
              </>
            )}
          </p>
          <div className="home-hero-meta">
            <span>{locale === "zh" ? "中国杭州" : "Hangzhou, China"}</span>
            <span>E/INFP</span>
          </div>
        </div>
        <div className="home-lanyard" aria-label={locale === "zh" ? "DESIGN.4X 互动挂绳名片，可拖拽或点击翻转" : "Interactive DESIGN.4X badge: drag or click to flip"}>
          <Suspense fallback={null}>
            <Lanyard frontImage={dark ? "/images/lanyard/front-dark.svg" : "/images/lanyard/front.svg"} backImage={dark ? "/images/lanyard/back-dark.svg" : "/images/lanyard/back.svg"} intro={true} orientation="landscape" size={0.46} strapLength={0.5} strapColor={dark ? "#4a4d52" : "#252525"} cardColor={dark ? "#1c1e21" : "#f3f6fa"} finish="glossy" breeze={0.15} />
          </Suspense>
        </div>
      </section>

      <section className="home-work" aria-labelledby="selected-work-title">
        <div className="products-intro">
          <h2 className="products-desc" id="selected-work-title">
            {locale === "zh"
              ? "打造用户真正需要的产品"
              : "Building products users truly need"}
          </h2>

        </div>
        <div className="products-grid">
          {projects.map((project, index) => {
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
            aria-label={locale === "zh" ? "让正确、可控、持续的设计更容易发生" : "Design for clarity, control, and scale"}
          >
            {locale === "zh" ? (
              <span className="home-perspective-title-line">让<TypeWords words={["正确", "可控", "持续"]} />的设计更容易发生</span>
            ) : (
              <span className="home-perspective-title-line">Design for<TypeWords className="is-en" words={["Clarity", "Control", "Scale"]} /></span>
            )}
          </h2>
        </div>
      </section>
    </main>
  );
}
