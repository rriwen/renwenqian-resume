import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjectTitle, projects, type Project } from "../data/projects";
import { useLanguage } from "../i18n/LanguageContext";
import { usePublishedContent } from "../lib/useManagedContent";

type ViewMode = "stack" | "grid";
type Props = { viewMode: ViewMode; onViewMode: (m: ViewMode) => void };

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
      const cy = height * (0.43 + Math.sin(time * 0.55) * 0.025);
      const scale = Math.min(width, height) * 0.5;
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
  const {
    items: managedProjects,
    loading: projectsLoading,
    failed: projectsFailed,
  } = usePublishedContent("project");
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
  const effectiveProjects = useMemo(() => {
    if (!managedProjects.length) return projectsFailed ? projects : [];
    const projectBySlug = new Map(
      projects.map((project) => [project.slug, project]),
    );
    return managedProjects.map((managed, index) => {
      const project = projectBySlug.get(managed.slug);
      return project
        ? {
            ...project,
            title: managed.title,
            titleEn: managed.title,
            image: managed.cover || project.image,
          }
        : {
            id: 1000 + index,
            slug: managed.slug,
            title: managed.title,
            titleEn: managed.title,
            image: managed.cover,
          };
    });
  }, [managedProjects]);
  const managedBySlug = useMemo(
    () => new Map(managedProjects.map((item) => [item.slug, item])),
    [managedProjects],
  );
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
          {projectsLoading ? (
            <div className="project-loading-grid" aria-label="正在加载项目">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          ) : null}
          {!projectsLoading
            ? selected.map(({ project, index }) => {
                const managed = managedBySlug.get(project.slug);
                const defaultIndex = projects.findIndex(
                  (item) => item.slug === project.slug,
                );
                const tags = managed?.category
                  ? managed.category.split(/\s*[·,，]\s*/).filter(Boolean)
                  : projectTags[defaultIndex >= 0 ? defaultIndex : index] || [];
                return (
                  <article
                    className={`product-card${project.slug === "agentops" ? " product-card-agentops" : ""}${project.slug === "Memory" ? " product-card-memory" : ""}${project.slug === "aidesignsystem" ? " product-card-design-system" : ""}${project.slug === "datadevelop" ? " product-card-odc" : ""}${project.slug === "databaseops" ? " product-card-oceanbase" : ""}`}
                    key={project.id}
                  >
                    <button
                      className="product-card-link"
                      onClick={() => openProject(project)}
                    >
                      <div className="product-card-media">
                        <img src={project.image} alt="" />
                        {project.slug === "agentops" ? (
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
                              <rect
                                x="5"
                                y="5"
                                width="15"
                                height="15"
                                rx="2"
                                fill="currentColor"
                              />
                              <rect
                                x="28"
                                y="5"
                                width="15"
                                height="15"
                                rx="2"
                                fill="currentColor"
                                opacity=".72"
                              />
                              <rect
                                x="5"
                                y="28"
                                width="15"
                                height="15"
                                rx="2"
                                fill="currentColor"
                                opacity=".72"
                              />
                              <path
                                d="M20 12.5h8M12.5 20v8M20 35.5h8M35.5 20v8"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                              <rect
                                x="28"
                                y="28"
                                width="15"
                                height="15"
                                rx="2"
                                fill="currentColor"
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
              })
            : null}
        </div>
      </section>

      <section
        className="home-perspective"
        aria-labelledby="product-perspective-title"
      >
        <header className="home-perspective-heading">
          <p>
            {locale === "zh" ? "产品设计观点" : "Product design perspective"}
          </p>
          <span aria-hidden="true">01 — 03</span>
        </header>
        <div className="home-perspective-intro">
          <h2 id="product-perspective-title">
            {locale === "zh"
              ? "设计不是把界面做得更满，而是让正确的事情更容易发生。"
              : "Design is not about filling the interface. It is about making the right things easier to happen."}
          </h2>
        </div>
        <div className="home-perspective-list">
          <article>
            <span>01</span>
            <div>
              <h3>
                {locale === "zh"
                  ? "先理解问题，再表达答案"
                  : "Understand the problem before expressing the answer"}
              </h3>
              <p>
                {locale === "zh"
                  ? "好的产品设计从真实情境出发。先看清用户、业务与技术之间的约束，再决定界面应该呈现什么，而不是从一个漂亮的页面开始。"
                  : "Good product design begins with real context. Understand the constraints between users, business, and technology before deciding what the interface should show."}
              </p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>
                {locale === "zh"
                  ? "复杂留给系统，清晰交给用户"
                  : "Keep complexity in the system and clarity with the user"}
              </h3>
              <p>
                {locale === "zh"
                  ? "设计的价值不是隐藏所有复杂度，而是建立恰当的信息层级与反馈，让用户始终知道发生了什么、为什么发生，以及下一步可以做什么。"
                  : "Design does not hide all complexity. It creates the right hierarchy and feedback so people know what happened, why it happened, and what they can do next."}
              </p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>
                {locale === "zh"
                  ? "把设计当作持续演进的系统"
                  : "Treat design as an evolving system"}
              </h3>
              <p>
                {locale === "zh"
                  ? "产品不会在上线时完成。通过真实使用、数据与反馈持续校准，让每一次迭代既解决当下问题，也为下一次变化留下空间。"
                  : "A product is not finished at launch. Real usage, data, and feedback should keep shaping it while every iteration leaves room for what comes next."}
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
