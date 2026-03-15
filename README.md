# ⚡ PulseCheck AI

> **AI-powered community health analytics platform** — Monitor, diagnose, and revive your online communities with real-time insights and intelligent automation.

![PulseCheck AI Dashboard](https://img.shields.io/badge/Status-Live-10B981?style=flat-square&logo=statuspage)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-6366F1?style=flat-square)

---

## 🧠 What is PulseCheck AI?

PulseCheck AI is a **premium SaaS analytics dashboard** built for community managers who need to understand the health of their online communities — whether on Discord, Slack, or Telegram — at a glance.

The platform uses AI to:
- **Detect inactivity** and dead zones before they become irreversible
- **Analyze sentiment** trends across all channels
- **Generate discussion sparks** — AI-crafted prompts that revive engagement
- **Identify at-risk members** and recommend re-engagement actions
- **Surface critical alerts** ranked by priority and impact

The design philosophy is inspired by premium SaaS products like **Linear**, **Vercel**, **Stripe Dashboard**, and **Notion** — minimal, information-rich, and instantly understandable.

---

## 🖥️ Screenshots

| Overview Dashboard | Dead Zone Map |
|---|---|
| Health score, metrics, pulse timeline & AI diagnosis | Color-coded channel heatmap with engagement depth |

| AI Spark Generator | Community Intelligence |
|---|---|
| Manage AI-crafted discussion starters | Member labels, trends, and re-engage actions |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/pulsecheck-ai.git
cd pulsecheck-ai/client

# Install frontend dependencies
npm install

# Start the frontend development server
npm run dev
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```text
pulsecheck-ai/
├── client/                     # React + Vite Frontend
│   ├── public/
│   │   └── icon.svg            # App favicon
│   ├── src/
│   │   ├── main.jsx            # React entry point
│   │   ├── App.jsx             # Router + layout shell
│   │   ├── index.css           # Global design system & CSS variables
│   │   ├── data/
│   │   │   └── mockData.js     # Sample data for all dashboard sections
│   │   ├── components/         # Layout & UI components
│   │   └── pages/              # Dashboard pages
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                     # Spring Boot Backend (To be implemented)
    └── README.md
```

---

## 📄 Pages & Features

### 1. 📊 Overview Dashboard (`/overview`)
The main command center for community managers.

- **Community Health Score** — Overall score out of 100 with weekly trend
- **6 Key Metric Cards** — Active channels, dying channels, discussion depth, sentiment score, AI interventions
- **Community Pulse Timeline** — Multi-line area chart showing messages, member activity, and sentiment over 14 days
- **AI Diagnosis Panel** — Plain-language summary of community state with top concern and quick-win suggestions
- **Top Risk Alerts** — The 3 most critical warnings requiring immediate action
- **Critical Channels List** — Channels needing intervention, click to open the detail panel

### 2. 🗺️ Dead Zone Map (`/dead-zones`)
The most visually striking view in the app — a full heatmap of every monitored channel.

- **Summary chips** showing counts of Critical / Warning / Healthy channels
- **Grid view** — Each channel card shows activity %, engagement %, last active time, messages/24h, and a row of color-coded heatmap dots (red = critical, yellow = warning, green = healthy)
- **List view** — Compact table format with progress bars
- **Filters** — By risk level (Critical / Warning / Healthy) and by category (Tech, Business, General, etc.)
- **Search** — Instant channel name filtering
- Click any channel to open the **Channel Detail Panel**

### 3. 💬 Channels (`/channels`)
A clean table view of all monitored channels.

- Sortable table with activity progress bars, sentiment scores, message volume, and last-active timestamps
- Color-coded sentiment and risk badges
- Click any row to open the detailed side panel

### 4. ✨ AI Sparks (`/sparks`)
The AI copilot for community re-engagement.

- **5 AI-generated spark cards**, each with:
  - Spark title and category
  - The generated discussion question (in italics)
  - AI's reasoning for recommending it
  - Target channel and suggested members to tag
  - Predicted engagement impact with a progress bar
  - Status badge: Draft / Approved / Scheduled / Posted
- **Interactive workflow**: Draft → Approve → Schedule → Post Now
- **Filter tabs**: View All / Draft / Approved / Scheduled

### 5. 🔔 Alerts & Insights (`/alerts`)
Real-time risk detection and prioritized action feed.

- **6 risk alerts** with Priority, Channel, Description, and Detail
- **Priority filter buttons** (Critical / High / Medium) with live counts
- **Dismiss** individual alerts
- Color-coded left borders (red = critical, orange = high, cyan = medium)
- Each alert has a primary action button (e.g., "Post Discussion Spark", "Re-engage")

### 6. 👥 Members (`/members`)
Community intelligence for understanding who's driving (or leaving) the community.

- **Summary stats**: Total tracked, Catalysts, At-Risk, Silent Readers
- **AI Labels**: Catalyst, Expert, At Risk, Re-engage Candidate, Silent Reader (each color-coded)
- **Mini bar charts** showing 7-day activity trends per member
- **Member stats grid**: messages/7d, activity trend, member age
- **Channel tags** showing where each member is active
- **Re-engage button** for at-risk members; **"View Contributions"** for catalysts
- **Label filter tabs** to focus on specific member types

### 7. 🔌 Integrations (`/integrations`)
Connect and manage community data sources.

- **Discord** (connected by default with 12 channels, 3,420 members)
- **Slack** and **Telegram** — connect with a simulated async loading flow
- Per-integration stats (channels, members, sync status)
- Configure and Disconnect options for connected platforms
- **Coming Soon** chips: Reddit, WhatsApp, Twitter/X, GitHub Discussions, Discourse, Circle.so

### 8. ⚙️ Settings (`/settings`)
Admin configuration panel.

- **AI Features** — Toggle: Spark Generator, Sentiment Analysis, Expert Detection, Dead Zone Prediction
- **Inactivity Thresholds** — Dropdown: 12h / 24h / 48h / 72h / 7 days; Critical threshold auto-calculated at 2×
- **Notifications** — Toggle: Email Alerts, Slack DMs, Weekly Health Report
- **Privacy** — Public Health Score Badge toggle
- Save with confirmation toast

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| UI Framework | **React 18** | Component-based UI |
| Build Tool | **Vite 6** | Fast HMR dev server + build |
| Routing | **React Router v6** | Client-side page navigation |
| Charts | **Recharts 2** | Area charts, bar charts |
| Icons | **Lucide React** | Consistent SVG icon set |
| Styling | **Vanilla CSS** | Custom design system, CSS variables |
| Date Utils | **date-fns** | Date formatting helpers |

---

## 🎨 Design System

The entire UI is driven by a CSS custom property design system defined in `src/index.css`.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#080B14` | Main background |
| `--bg-card` | `#141B2D` | Card surfaces |
| `--brand-primary` | `#6366F1` | Indigo — brand, CTAs, active states |
| `--brand-secondary` | `#8B5CF6` | Purple — gradients |
| `--brand-accent` | `#06B6D4` | Cyan — secondary highlights |
| `--healthy` | `#10B981` | Green — good status |
| `--warning` | `#F59E0B` | Amber — caution status |
| `--critical` | `#EF4444` | Red — danger / dead zones |

### Typography

- **Inter** (300–800 weight) — all UI text
- **JetBrains Mono** — channel names, code-like values

### Key Design Decisions

- **Dark mode only** with deep navy backgrounds (not distracting pure black)
- **Glow effects** on brand-colored elements using `box-shadow` with low-opacity brand colors
- **Subtle animations** — `fadeIn` on page load, `pulse-ring` on live dots, slide-in on modals
- **Status semantics** strictly enforced: green/yellow/red always mean healthy/warning/critical
- Cards have **hover lift** (`translateY(-2px)`) and stronger border glow on hover
- **Progress bars** used pervasively as a quick visual encoding for numeric values

---

## 🧩 Key Components

### `<MetricCard />`
Reusable stat card with trend indicator, color theming, and progress bar accent.

```jsx
<MetricCard
  label="Health Score"
  value={73}
  unit="/100"
  change={-3}
  invertTrend={false}
  color="brand"        // brand | healthy | critical | warning | info
  highlight={true}
/>
```

### `<ChannelDetailPanel />`
Slide-in right panel for any channel. Shows health circle, 7-day bar chart, AI-detected issues, discussion spark suggestions, and recommended admin actions.

```jsx
<ChannelDetailPanel
  channel={channelObject}
  onClose={() => setSelected(null)}
/>
```

---

## 📦 Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.28.0",
  "recharts": "^2.14.1",
  "lucide-react": "^0.468.0",
  "framer-motion": "^11.15.0",
  "clsx": "^2.1.1",
  "date-fns": "^4.1.0"
}
```

---

## 🔮 Roadmap

- [ ] Real Discord / Slack API integrations
- [ ] Backend API (Node.js + PostgreSQL) for persistent data
- [ ] AI spark generation via OpenAI / Gemini API
- [ ] Actual NLP sentiment analysis pipeline
- [ ] User authentication and multi-workspace support
- [ ] Email and Slack notification delivery
- [ ] Mobile responsive layout
- [ ] Dark/light mode toggle

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push and open a Pull Request

---

## 📝 License

MIT License — feel free to use this project for hackathons, demos, or as a template for your own analytics dashboard.

---

<p align="center">
  Built with ⚡ for the HOPELY Hackathon &nbsp;•&nbsp; Powered by React + Vite
</p>