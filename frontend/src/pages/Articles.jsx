import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import Article from "../Article"
import CreateArticle from "../CreateArticle"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"
import "../App.css"

const ARTICLES_URL = "/articles/"
const SEARCH_URL = "/articles/search"

const Articles = () => {
  const { user } = useAuth()
  const [articles, setArticles] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const selectedArticle = useMemo(
    () => articles.find((article) => article.id === selectedId) || articles[0],
    [articles, selectedId],
  )

  const applyArticles = useCallback((data) => {
    setArticles(data)
    setSelectedId((prev) => {
      if (data.some((article) => article.id === prev)) return prev
      return data[0]?.id ?? null
    })
  }, [])

  const fetchArticles = useCallback(
    async (url) => {
      setLoading(true)
      try {
        const res = await api.get(url)
        applyArticles(res.data)
        setError("")
      } catch (err) {
        const message = err.response?.data?.detail || err.message || "Failed to load articles"
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [applyArticles],
  )

  useEffect(() => {
    const term = searchTerm.trim()
    if (term === "") {
      fetchArticles(ARTICLES_URL)
      return
    }
    const handle = setTimeout(() => {
      const url = `${SEARCH_URL}?q=${encodeURIComponent(term)}`
      fetchArticles(url)
    }, 300)
    return () => clearTimeout(handle)
  }, [searchTerm, fetchArticles])

  const handleCreate = async (payload) => {
    setCreating(true)
    try {
      const res = await api.post(ARTICLES_URL, payload)
      const created = res.data
      setArticles((prev) => [created, ...prev])
      setSelectedId(created.id)
      setError("")
      return { ok: true }
    } catch (err) {
      const message = err.response?.data?.detail || err.message || "Unable to publish article"
      setError(message)
      return { ok: false, message }
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (articleId) => {
    const confirmDelete = window.confirm("Delete this article? This cannot be undone.")
    if (!confirmDelete) return
    setDeletingId(articleId)
    try {
      await api.delete(`${ARTICLES_URL}${articleId}`)
      setArticles((prev) => {
        const next = prev.filter((article) => article.id !== articleId)
        if (selectedId === articleId) {
          setSelectedId(next[0]?.id ?? null)
        }
        return next
      })
      setError("")
    } catch (err) {
      const message = err.response?.data?.detail || err.message || "Unable to delete article"
      setError(message)
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
          {user && (
            <>
              <span className="pill">
                <span className="dot" />
                Signed in as {user.full_name || user.email}
              </span>
              <Link className="ghost danger" to="/logout">
                Sign out
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="layout">
        <div className="column wide" id="feed">
          <div className="section-header">
            <div>
              <p className="kicker">Latest</p>
              <h2>Articles</h2>
            </div>
            <div className="section-actions">
              <div className="search">
                <label className="search-label" htmlFor="search-input">
                  Search
                </label>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Find by title or content"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
              <small>Check that the backend is running and reachable.</small>
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
                  {deletingId === selectedArticle.id ? "Deleting..." : "Delete article"}
                </button>
              </div>
            </div>
          )}
        </aside>
      </section>
    </div>
  )
}

export default Articles
