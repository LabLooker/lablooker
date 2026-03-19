'use client'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', background: '#f0f7f6' }}>
        <div style={{ maxWidth: '600px', margin: '4rem auto', background: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #e0ebe9' }}>
          <h2 style={{ color: '#b85c5c', marginTop: 0 }}>Something went wrong</h2>
          <p style={{ color: '#577572', fontSize: '0.9rem' }}>
            Please try refreshing the page. If the problem persists, note the error below and contact support.
          </p>
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', color: '#2d6a5e', fontSize: '0.85rem' }}>Error details</summary>
            <pre style={{ fontSize: '0.75rem', background: '#f0f7f6', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto', marginTop: '0.5rem', color: '#1a2e2b' }}>
              {error?.message || 'Unknown error'}
              {error?.digest ? `\nDigest: ${error.digest}` : ''}
            </pre>
          </details>
          <button
            onClick={reset}
            style={{ marginTop: '1.5rem', background: '#2d6a5e', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Try again
          </button>
          <a href="/" style={{ marginLeft: '1rem', color: '#577572', fontSize: '0.85rem' }}>← Back to home</a>
        </div>
      </body>
    </html>
  )
}
