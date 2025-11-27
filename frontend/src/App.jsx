import { useEffect, useMemo, useState } from 'react'
import CreateArticle from './CreateArticle'
import Article from './Article'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const ARTICLES_URL =
  import.meta.env.VITE_ARTICLES_URL ||
  `${API_BASE_URL.replace(/\/$/, '')}/api/articles/`

function App() {
  const [articles, setArticles] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const selectedArticle = useMemo(
    () => articles.find((article) => article.id === selectedId) || articles[0],
    [articles, selectedId]
  )

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(ARTICLES_URL)
        if (!res.ok) throw new Error('Failed to load articles')
        const data = await res.json()
        setArticles(data)
        setError('')
        if (data.length) {
          setSelectedId((prev) => prev ?? data[0].id)
        }
      } catch (err) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const handleCreate = async (payload) => {
    setCreating(true)
    try {
      const res = await fetch(ARTICLES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Unable to publish article')
      const created = await res.json()
      setArticles((prev) => [created, ...prev])
      setSelectedId(created.id)
      setError('')
      return { ok: true }
    } catch (err) {
      setError(err.message || 'Unable to publish article')
      return { ok: false, message: err.message }
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (articleId) => {
    const confirmDelete = window.confirm('Delete this article? This cannot be undone.')
    if (!confirmDelete) return
    setDeletingId(articleId)
    try {
      const res = await fetch(`${ARTICLES_URL}${articleId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Unable to delete article')
      setArticles((prev) => {
        const next = prev.filter((article) => article.id !== articleId)
        if (selectedId === articleId) {
          setSelectedId(next[0]?.id ?? null)
        }
        return next
      })
      setError('')
    } catch (err) {
      setError(err.message || 'Unable to delete article')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page">
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />
      <div className="ambient ambient-3" />
      <header className="hero">
        <div className="eyebrow">ESGI - Stories</div>
        <h1>
          Craft bold stories
          <span className="accent"> and share them</span>
        </h1>
        <p className="lede">
          A modern canvas for your ideas. Write, publish, and showcase articles with a vibrant,
          editorial-inspired experience.
        </p>
        <div className="hero-actions">
          <a className="cta" href="#create">
            Start writing
          </a>
          <a className="ghost" href="#feed">
            Browse articles
          </a>
        </div>
      </header>

      <section className="layout">
        <div className="column wide" id="feed">
          <div className="section-header">
            <div>
              <p className="kicker">Latest</p>
              <h2>Articles</h2>
            </div>
            <div className="pill">
              API: <span className="pill-strong">{ARTICLES_URL}</span>
            </div>
          </div>

          {loading ? (
            <div className="panel loading">
              <div className="spinner" />
              <p>Loading stories...</p>
            </div>
          ) : error ? (
            <div className="panel error">
              <p>{error}</p>
              <small>Check that the backend is running on the API URL above.</small>
            </div>
          ) : (
            <div className="grid">
              {articles.map((article) => (
                <Article
                  key={article.id}
                  article={article}
                  active={selectedArticle?.id === article.id}
                  onSelect={() => setSelectedId(article.id)}
                />
              ))}
              {!articles.length && (
                <div className="panel empty">
                  <p>No articles yet.</p>
                  <small>Use the composer to create the first one.</small>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="column sidebar" id="create">
          <CreateArticle onCreate={handleCreate} busy={creating} />
          {selectedArticle && (
            <div className="detail">
              <p className="kicker">Focus</p>
              <h3>{selectedArticle.title}</h3>
              <p className="detail-body">{selectedArticle.content}</p>
              <div className="detail-actions">
                <button
                  className="ghost danger"
                  type="button"
                  onClick={() => handleDelete(selectedArticle.id)}
                  disabled={deletingId === selectedArticle.id}
                >
                  {deletingId === selectedArticle.id ? 'Deleting...' : 'Delete article'}
                </button>
              </div>
            </div>
          )}
        </aside>
      </section>
    </div>
  )
}

export default App
