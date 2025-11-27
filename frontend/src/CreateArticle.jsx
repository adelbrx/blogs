import { useState } from 'react'

const CreateArticle = ({ onCreate, busy = false }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('')
    if (!title.trim() || !content.trim()) {
      setStatus('Please provide a title and content.')
      return
    }
    const result = await onCreate({ title: title.trim(), content: content.trim() })
    if (result.ok) {
      setStatus('Published ✔')
      setTitle('')
      setContent('')
    } else if (result.message) {
      setStatus(result.message)
    }
  }

  return (
    <div className="panel composer">
      <p className="kicker">Compose</p>
      <h2>Create an article</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            placeholder="A bold headline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Content
          <textarea
            placeholder="Share your perspective..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />
        </label>
        <button type="submit" className="cta" disabled={busy}>
          {busy ? 'Publishing…' : 'Publish article'}
        </button>
      </form>
      {status && <p className="status">{status}</p>}
    </div>
  )
}

export default CreateArticle
