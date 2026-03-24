import { getLocale, locales, setLocale } from '#/paraglide/runtime'
import { m } from '#/paraglide/messages'

export default function ParaglideLocaleSwitcher() {
  const currentLocale = getLocale()
  return (
    <div
      style={{ display: 'flex', gap: '4px', alignItems: 'center' }}
      aria-label={m.language_label()}
    >
      {locales.map((locale) => {
        const isActive = locale === currentLocale
        return (
          <button
            key={locale}
            onClick={() => setLocale(locale)}
            aria-pressed={isActive}
            style={{
              cursor: 'pointer',
              padding: '3px 10px',
              borderRadius: '999px',
              border: isActive ? 'none' : '1px solid var(--border)',
              background: isActive ? 'var(--accent)' : 'transparent',
              color: isActive ? 'var(--bg-base)' : 'var(--text-secondary)',
              fontFamily: 'inherit',
              fontSize: '0.75rem',
              fontWeight: 600,
              transition: 'all 0.1s',
            }}
          >
            {locale.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
