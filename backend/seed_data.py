from backend.core.database import Base, SessionLocal, engine
from backend.models.article import Article

SEED_ARTICLES = [
    {
        "id": 1,
        "title": "The Secret Life of Socks: Where Do They Go?",
        "content": "A deep dive into the vanishing act of single socks. Is it a portal? A conspiracy? We interview laundry experts and quantum physicists to uncover the truth behind the great sock mystery. Hint: it involves a lot of lint and possibly a tiny black hole.",
    },
    {
        "id": 2,
        "title": "The Rise of Retro-Computing: Why Old Software Still Matters",
        "content": "Forget 4K graphics and blazing-fast processors. We explore the growing community dedicated to preserving and running decades-old computer hardware and software. Learn about the aesthetic appeal of pixel art and the surprisingly practical skills gained from programming on a Commodore 64.",
    },
    {
        "id": 3,
        "title": "5 Unusual Uses for a Lemon Zester You Never Knew You Needed",
        "content": "Beyond garnishing cocktails, the humble lemon zester holds untapped potential. Discover how this kitchen gadget can revolutionize your gardening, streamline your crafting projects, and even act as an emergency fire starter (with proper caution, of course!).",
    },
    {
        "id": 4,
        "title": "Mastering the Art of the Perfect Nap: A Scientific Guide",
        "content": "From the 'caffeine nap' to the ideal duration for REM cycles, this article breaks down the science of strategic rest. We cover optimal lighting, sound conditions, and even the best post-nap stretch routine to ensure you wake up refreshed, not groggy.",
    },
    {
        "id": 5,
        "title": "DIY Guide: Building a Miniature Terrarium Ecosystem",
        "content": "Bring a tiny slice of nature indoors with this step-by-step guide on creating a self-sustaining terrarium. We discuss drainage layers, choosing the right plants (moss is a must!), and how to maintain the perfect balance of humidity and light for your micro-jungle.",
    },
    {
        "id": 6,
        "title": "Debunking the Myth of the 'Morning Person' vs. 'Night Owl'",
        "content": "It's not just about willpower—it's about chronotypes. We look at the biological clock that dictates your natural sleep-wake cycle and offer tips on how to structure your workday to align with your personal energy peaks, making productivity easier for everyone.",
    },
]


def seed():
    """Create tables and seed default articles if the table is empty."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Article).count() > 0:
            return
        for item in SEED_ARTICLES:
            db.add(Article(id=item["id"], title=item["title"], content=item["content"]))
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
