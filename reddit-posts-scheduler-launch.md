# Reddit Posts — Social Media Scheduler Launch

---

## r/SideProject

**Title:**
I built a free desktop app that schedules posts to X, Reddit, Instagram, Facebook, and Telegram — no subscription

**Body:**
Been running an AI tools review site for e-commerce sellers and kept noticing one thing: sellers know they need to post on social media consistently, almost none of them do, and the reason is always friction.

Buffer costs $6/channel/month minimum. Hootsuite starts at $99. Neither supports Reddit scheduling, which is genuinely useful for sellers in niche communities.

So I built a free alternative.

**What it does:**
- Schedules posts to X, Reddit, Instagram, Facebook, Telegram
- Direct API integration — posts go live automatically at the scheduled time
- All data stored locally in SQLite — nothing leaves your machine
- Web interface at localhost:5000 when running
- Completely free, no trial period

**The tech:**
- Python 3.8+, PyQt5 for the GUI
- APScheduler for scheduling
- Tweepy (X), PRAW (Reddit), requests-oauthlib (everything else)

**The limitation I'm honest about:**
The app needs to be running for scheduled posts to deliver. Keep it minimised in the background and it works fine. A cloud-hosted version that removes this constraint is the obvious next step.

**Why I built this instead of using an existing tool:**
Reddit scheduling. No major paid tool supports it. For sellers in Shopify communities, homesteading subreddits, craft communities — being able to schedule Reddit posts is a real advantage that nobody else offers for free.

Download + full writeup on how it was built: [link to social-media-scheduler.html]

Would love feedback from anyone who actually tries it. Especially curious if the API setup instructions are clear enough for non-technical users.

---

## r/Python

**Title:**
Built a multi-platform social media scheduler in Python (PyQt5 + APScheduler) — feedback welcome

**Body:**
Side project for an e-commerce tools site I'm building. Wanted a free alternative to Buffer/Hootsuite that also supports Reddit scheduling (no major tool does this).

**Stack:**
- PyQt5 desktop GUI
- APScheduler with SQLite job store (persistent across restarts)
- Tweepy for X/Twitter
- PRAW for Reddit
- requests-oauthlib for Facebook, Instagram, Telegram
- SQLite for local storage of credentials and scheduled posts
- Flask web interface on localhost:5000 when running

**The interesting bits:**

APScheduler's SQLAlchemy job store means scheduled posts survive app restarts — important for a scheduler that needs to be reliable. The job is stored in SQLite and reloaded when the app starts.

Instagram was the awkward one. The Graph API requires images at a public URL rather than direct file upload. Ended up making this a documented requirement rather than working around it (Imgur or any public host works fine).

Reddit required the most error handling — subreddit-specific rules (flair requirements, posting restrictions, rate limits) vary a lot. The app catches these cleanly and surfaces the error to the user rather than silently dropping the post.

PyQt5 + Python for a desktop app feels slightly old-fashioned but it produces a lightweight native Windows binary without Electron's memory overhead. Happy with that tradeoff.

**What I'd do differently:**
- Use a proper message queue (Celery + Redis or similar) instead of APScheduler for the cloud version
- Consider Rust for the desktop binary for distribution simplicity

Full writeup: [link to i-built-social-media-scheduler.html]

---

## r/entrepreneur

**Title:**
Built two free tools for e-commerce sellers in 6 weeks with zero budget — current status

**Body:**
Update post from two weeks ago where I shared the AI Stack Finder (free quiz that recommends AI tool stacks for Shopify/Etsy sellers).

Just shipped the second tool: a free desktop app that schedules social media posts to X, Reddit, Instagram, Facebook, and Telegram.

**Business context:**
- Site: AI tools review site for e-commerce sellers
- Revenue: Still $0 (expecting first Tidio affiliate commission soon)
- Traffic: Starting to see Search Console impressions on a few articles
- Affiliate programs: Tidio (approved), Photoroom via Awin (approved), working on Canva and Semrush

**The two tools I've built:**
1. AI Stack Finder quiz — recommends personalised AI tool stacks based on your store situation
2. Social Media Scheduler — free desktop scheduler, posts to 5 platforms including Reddit

**Why build free tools instead of just doing affiliate content?**
Three reasons: they give me something genuine to write about ("I built this" articles perform well on Reddit), they add real value so people share the site, and they're the foundation of a future paid SaaS if enough people use the free version.

**Current challenge:**
Got rejected from Fiverr and PartnerStack affiliate programs. Looking for alternatives in Awin — currently targeting Canva, Semrush, and Grammarly.

**Honest question for the thread:**
The scheduler requires Python 3.8+ installed, which is a barrier for non-technical users. Is it worth building a proper installer that bundles Python, or just accept that the audience is slightly technical and focus on that segment?

Links in comments.

---

## AWIN ALTERNATIVES — Programs to try instead of Fiverr/PartnerStack

Since Fiverr and PartnerStack rejected you, here are alternatives to apply to immediately:

**On Awin (search these in your dashboard):**
- Canva — design tool, huge user base, relevant to every article
- Semrush — SEO tool, $200/sale commission in some programs
- Grammarly — writing tool, easy approval, $20/free signup
- 99designs — design marketplace (alternative to Fiverr)
- PeoplePerHour — freelance marketplace (alternative to Fiverr)
- Envato Elements — creative assets, 30% recurring

**Direct programs (not on Awin):**
- Shopify Affiliate Program — shopify.com/affiliates — $58–$200 per referral, huge brand, easy to write about naturally
- Canva direct — canva.com/affiliates — apply direct AND through Awin for wider coverage
- ConvertKit — convertkit.com/affiliate — email marketing, 30% recurring, alternative to Omnisend for creators

**For the social media scheduler specifically:**
- Buffer affiliate program — buffer.com/overflow/affiliation — you can promote Buffer in articles while also offering your free tool as the alternative. Readers who want the paid cloud version use your Buffer link; readers who want free use your app. Both earn.
- Later affiliate — later.com — social scheduling, recurring commission

The key reframe: being rejected from Fiverr/PartnerStack doesn't matter much at this stage. Canva and Shopify alone are bigger commission opportunities than both combined.
