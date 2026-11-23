import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowUpIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { projectDescriptions } from "../data/homeProjects";
import { projects } from "../data/projects";
import { useLanguage } from "../i18n/LanguageContext";

type Props = { onAsk: (text: string) => void; dark: boolean; onToggleTheme: () => void };

const MeshGradientBackground = lazy(() => import("../components/project/MeshGradientBackground").then(module => ({ default: module.MeshGradientBackground })));

const featuredProjects = [
  "dataagent", "databaseops", "datadevelop", "aidesignsystem",
].map((slug) => projects.find((project) => project.slug === slug)!);



export function Home({ onAsk, dark, onToggleTheme }: Props) {
  const { m } = useLanguage();
  const [question, setQuestion] = useState("");
  const [waveVersion, setWaveVersion] = useState(0);
  const questionRef = useRef<HTMLTextAreaElement>(null);
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  const questionPlaceholder = "关于我的工作，有什么想问的吗？";
  useEffect(() => {
    document.title = "DESIGN.4x";
  }, []);

  useEffect(() => {
    const focusQuestion = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.key.toLowerCase() !== "k" || event.isComposing) return;
      if (window.location.hash || questionRef.current?.closest("[inert]")) return;
      event.preventDefault();
      questionRef.current?.focus();
    };
    window.addEventListener("keydown", focusQuestion);
    return () => window.removeEventListener("keydown", focusQuestion);
  }, []);

  const suggestedQuestions = [
    { id: "about", label: m.chatbot.quickServices, prompt: m.chatbot.quickPromptServices },
    { id: "expertise", label: m.chatbot.quickDesignDev, prompt: m.chatbot.quickPromptDesignDev },
    { id: "experience", label: m.chatbot.quickTimeline, prompt: m.chatbot.quickPromptTimeline },
    { id: "projects", label: m.chatbot.quickProjects, prompt: m.chatbot.quickPromptProjects },
  ];

  return (
    <main className="page-shell home-redesign">
      <section className="home-hero" aria-labelledby="home-headline">
        <div className="home-hero-copy">
          <h1 id="home-headline">{m.home.greeting}{" "}<button
            type="button"
            className="home-wave-button"
            aria-label={dark ? "切换浅色模式" : "切换暗色模式"}
            title={dark ? "切换浅色模式" : "切换暗色模式"}
            onClick={() => { setWaveVersion((value) => value + 1); onToggleTheme(); }}
          ><span key={waveVersion} className={`home-wave${waveVersion ? " is-clicked" : ""}`} aria-hidden="true">👋🏻</span></button></h1>
          <p className="home-intro">{m.home.description}</p>
          <div className="home-chat-entry">
            <form className="home-chat-form prompt-composer" aria-label={"向我提问"} onSubmit={(event) => {
              event.preventDefault();
              if (!question.trim()) return;
              questionRef.current?.focus();
              onAsk(question);
              setQuestion("");
            }}>
              <textarea
                ref={questionRef}
                className="home-chat-input prompt-composer-input"
                rows={2}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
                  if (!event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                aria-label={questionPlaceholder}
                aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
                placeholder={questionPlaceholder}
                autoComplete="off"
                enterKeyHint="send"
              />
              <div className="home-chat-tools prompt-composer-tools">
                <button className="home-chat-action home-chat-submit prompt-composer-action prompt-composer-submit" type="submit" disabled={!question.trim()} aria-label={m.chatbot.sendAria}><ArrowUpIcon size={18} aria-hidden="true" /></button>
              </div>
            </form>
            <ul className="home-suggestions" aria-label={"推荐问题"}>
              {suggestedQuestions.map(({ id, label, prompt }) => (
                <li key={id}>
                  <button type="button" onClick={() => { setQuestion(prompt); questionRef.current?.focus(); }}>
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <nav className="home-projects" aria-labelledby="home-projects-heading">
        <h2 id="home-projects-heading" className="home-projects-heading">最近项目</h2>
        <div className="home-project-track">
        {featuredProjects.map((project) => (
          <Link key={project.slug} to={`/project/${project.slug}`} className="home-project-card">
            <div className={`home-project-media home-project-media--${project.slug}`}>
              <Suspense fallback={null}><MeshGradientBackground speed={0.6} /></Suspense>
              <img className="home-project-image" src={project.slug === "dataagent" ? "/images/datapilot-application-dialogue.png" : project.image} alt="" loading="lazy" decoding="async" />
            </div>
            <span className="home-project-title">
              <span>{project.navigationTitle?.zh ?? project.title}</span>
              <ArrowUpRightIcon className="home-project-open-icon" size={16} aria-hidden="true" />
            </span>
            <span className="home-project-description" title={projectDescriptions[project.slug]}>{projectDescriptions[project.slug]}</span>
          </Link>
        ))}
        </div>
      </nav>
    </main>
  );
}
