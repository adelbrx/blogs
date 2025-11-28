const Article = ({ article, active = false, onSelect }) => {
  const snippet =
    article.content.length > 140
      ? `${article.content.slice(0, 137).trimEnd()}...`
      : article.content

  return (
    <article
      className={`card ${active ? "card-active" : ""}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
    >
      <div className="card-top">
        <div className="pill-ghost">#{article.id}</div>
        <span className="dot" />
      </div>
      <h3>{article.title}</h3>
      <p className="snippet">{snippet}</p>
      <div className="card-footer">
        <span>Read more</span>
        <div className="chevron">{">"}</div>
      </div>
    </article>
  )
}

export default Article
