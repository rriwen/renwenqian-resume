import { Link } from 'react-router-dom'
import { getProjectTitle, projects } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'

export function SiteFooter() {
  const { locale } = useLanguage()

  return (
    <footer className="site-footer-redesign">
      <div className="site-footer-inner">
        <div className="footer-columns">
          <div>
            <h3>{locale === 'zh' ? '站内导航' : 'Navigation'}</h3>
            <Link to="/">{locale === 'zh' ? '首页' : 'Home'}</Link>
            <Link to="/about">{locale === 'zh' ? '关于我' : 'About me'}</Link>
            <Link to="/blog">{locale === 'zh' ? '博客' : 'Journal'}</Link>
            <Link to="/photography">{locale === 'zh' ? '摄影' : 'Photography'}</Link>
          </div>
          <div>
            <h3>{locale === 'zh' ? '产品' : 'Products'}</h3>
            {projects.slice(0, 5).map((project) => (
              <Link key={project.id} to={`/project/${project.slug}`}>
                {locale === 'zh' && project.slug === 'dataagent'
                  ? 'AI 智能问数'
                  : getProjectTitle(project, locale)}
              </Link>
            ))}
          </div>
          <div>
            <h3>{locale === 'zh' ? '关于我' : 'About me'}</h3>
            <p>{locale === 'zh' ? '产品设计师，专注于 AI 产品、数据工具与复杂系统体验' : 'Product designer focused on AI products, data tools, and complex systems.'}</p>
            <a href="mailto:rriwen@gmail.com">rriwen@gmail.com</a>
            <a href="tel:18362976211">18362976211</a>
            <a href="#chat">{locale === 'zh' ? '和我聊聊 ↗' : 'Chat with me ↗'}</a>
          </div>
        </div>
        <div className="footer-copyright"><span>© {new Date().getFullYear()} DESIGN.4X</span></div>
      </div>
    </footer>
  )
}
