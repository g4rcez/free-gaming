import { Link } from '@tanstack/react-router'
import ParaglideLocaleSwitcher from './LocaleSwitcher.tsx'

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 px-4 py-3"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <nav className="page-wrap flex flex-wrap items-center gap-4">
        <Link
          to="/"
          style={{
            color: 'var(--text-bright)',
            fontWeight: 700,
            fontSize: '1.125rem',
            textDecoration: 'none',
          }}
        >
          Free Gaming
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <ParaglideLocaleSwitcher />
          <div className="flex gap-4">
            <Link
              to="/"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Home
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
