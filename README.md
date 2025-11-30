# Backlog.rip

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fgsabater%2Fbacklog.rip.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fgsabater%2Fbacklog.rip?ref=badge_shield)
![Discord](https://img.shields.io/discord/297380113673355264?logo=discord&logoColor=%23ffffff&label=Discord&cacheSeconds=6000)
[![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/5535-shield.svg)](https://madewithvuejs.com/p/backlogrip/shield-link)
![Static Badge](https://img.shields.io/badge/patreon-backlog.rip-ffffff?logo=patreon&logoColor=%23ffffff&label=Patreon&link=https%3A%2F%2Fpatreon.com)

![GitHub Repo stars](https://img.shields.io/github/stars/gsabater/backlog.rip?style=social)
![GitHub contributors](https://img.shields.io/github/contributors/gsabater/backlog.rip?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/gsabater/backlog.rip?style=social)
![GitHub issues](https://img.shields.io/github/issues/gsabater/backlog.rip?style=social)


🚀 **Backlog.rip** is a **free and open-source library manager** for all your games. It works **in the cloud** without any launchers, allowing you to **organize and manage your game collection effortlessly**.

🔗 **Website**: [backlog.rip](https://backlog.rip)

## ✨ Features

- **Local First**: Works entirely in the browser. All data is stored locally using IndexedDB (via Dexie.js).
- **Cross-Platform**: Manage games from any platform (PC, Console, etc.).
- **Import Capabilities**: Easily import your library from sources like Steam.
- **Organization**: Categorize, tag, and track your backlog.
- **Progress Tracking**: Mark games as completed, in progress, or on hold.
- **Modern UI**: Built with Vuetify and Tabler for a sleek, responsive experience.

## 🛠 Tech Stack

| Technology | Description |
| :--- | :--- |
| **[Nuxt.js](https://nuxt.com/)** | The Hybrid Vue Framework (SSR & Static) |
| **[Vue.js](https://vuejs.org/)** | The Progressive JavaScript Framework |
| **[Vuetify](https://vuetifyjs.com/)** | Material Design Component Framework |
| **[Dexie.js](https://dexie.org/)** | Wrapper for IndexedDB |
| **[Pinia](https://pinia.vuejs.org/)** | Intuitive, type-safe, light and flexible Store for Vue |
| **[Tabler](https://tabler.io/)** | UI Kit and Icons |
| **[VueUse](https://vueuse.org/)** | Collection of Essential Vue Composition Utilities |
| **[Supabase](https://supabase.com/)** | Open Source Firebase Alternative (Auth/DB) |
| **[RxJS](https://rxjs.dev/)** | Reactive Extensions for JavaScript |

## 📂 Project Structure

```bash
.
├── assets/          # Static assets (images, styles)
├── components/      # Vue components
├── content/         # Markdown content (if using Nuxt Content)
├── layouts/         # App layouts
├── middleware/      # Route middleware
├── modules/         # Nuxt modules
├── pages/           # Application routes/pages
├── plugins/         # Vue/Nuxt plugins
├── public/          # Public static files
├── services/        # Service logic
├── stores/          # Pinia state stores
├── utils/           # Utility functions
└── nuxt.config.ts   # Nuxt configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js v22.11
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gsabater/backlog.rip.git
   cd backlog.rip
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server on `http://localhost:1337`:

```bash
npm run dev
```

### Build

Build the application for production:

```bash
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

*License not yet decided*

## 💖 Support

If you find Backlog.rip useful, consider starring ⭐ the repo or supporting the project:

- [Patreon](https://patreon.com)
