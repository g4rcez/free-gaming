export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="mt-20 px-4 pb-10 pt-6"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="page-wrap flex items-center justify-between">
        <p
          className="m-0"
          style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}
        >
          &copy; {year} Free Gaming
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}
        >
          GitHub
        </a>
      </div>
    </footer>
  )
}
