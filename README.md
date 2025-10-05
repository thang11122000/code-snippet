# CodeSnippet - Code Sharing Platform

A modern web platform where developers can share code snippets, tag them by language and topic, and get basic time complexity estimates.

## 🚀 Features

### Core Features

- ✅ **CRUD Operations** - Create, Read, Update, Delete code snippets
- ✅ **Tagging System** - Tag snippets by programming language and custom topics
- ✅ **User Profiles** - Public profiles displaying user's shared snippets
- ✅ **Shareable URLs** - Unique URLs for both snippets and tags
- ✅ **SEO Optimization** - Meta tags and Open Graph support
- ✅ **Internationalization (i18n)** - English and Vietnamese language support
- ✅ **Authentication** - Email/password-based user authentication UI
- ✅ **Mobile-First Design** - Fully responsive across all devices
- ✅ **Time Complexity Analysis** - Automatic estimation of algorithm complexity

### Additional Features

- 🎨 **Modern UI** - Built with shadcn/ui components
- 🌓 **Dark Mode Support** - Automatic theme detection
- 🔍 **Advanced Search** - Filter by language, tags, and search terms
- 📊 **Snippet Statistics** - Views, likes, and engagement metrics
- 🏷️ **Tag Discovery** - Browse snippets by popular tags
- 💾 **Code Editor** - Syntax-aware code input with line numbers

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 📁 Project Structure

```
client/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── signin/              # Sign in page
│   │   └── signup/              # Sign up page
│   ├── explore/                 # Browse all snippets
│   ├── profile/[id]/            # User profile pages
│   ├── snippets/                # Snippet pages
│   │   ├── [id]/               # Snippet detail page
│   │   └── create/             # Create snippet page
│   ├── tags/[tag]/              # Tag-based filtering
│   ├── layout.tsx               # Root layout with navbar
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   └── not-found.tsx            # 404 page
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── navbar.tsx               # Navigation bar
│   ├── snippet-card.tsx         # Snippet card component
│   ├── code-editor.tsx          # Code input component
│   └── copy-button.tsx          # Copy to clipboard button
├── lib/                         # Utility functions
│   ├── utils.ts                 # General utilities
│   ├── types.ts                 # TypeScript types
│   ├── i18n.ts                  # Internationalization
│   ├── complexity.ts            # Time complexity estimation
│   └── mock-data.ts             # Mock data for development
└── public/                      # Static assets
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd code-snippet/client
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📱 Pages Overview

### Home Page (`/`)

- Hero section with call-to-action
- Popular tags showcase
- Recent snippets grid
- Mobile-first responsive design

### Explore Page (`/explore`)

- Advanced filtering (language, tags, search)
- Sorting options (newest, popular, most viewed)
- Responsive grid layout

### Snippet Detail (`/snippets/[id]`)

- Full code display with syntax highlighting
- Author information
- Tags and complexity badge
- Share functionality
- Related snippets sidebar

### Create Snippet (`/snippets/create`)

- Multi-step form
- Code editor with line numbers
- Language selection
- Tag management
- Real-time complexity estimation

### User Profile (`/profile/[id]`)

- User information and stats
- User's snippets grid
- Liked snippets tab

### Tag Page (`/tags/[tag]`)

- All snippets with specific tag
- Related tags suggestions
- Tag statistics

### Authentication (`/auth/signin`, `/auth/signup`)

- Email/password forms
- Social login UI (Google, GitHub)
- Responsive design

## 🌐 Internationalization

The app supports multiple languages:

- English (en)
- Vietnamese (vi)

Toggle language using the globe icon in the navbar.

## 🎨 Design Features

### Mobile-First Approach

- All pages are fully responsive
- Touch-friendly interactions
- Optimized for small screens first
- Progressive enhancement for larger screens

### Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators

### Performance

- Next.js App Router for optimal performance
- Turbopack for fast development
- Optimized images and assets
- Code splitting

## 🔧 Customization

### Theme Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --primary: /* your color */ ;
  --secondary: /* your color */ ;
  /* ... */
}
```

### Adding Languages

Add translations in `lib/i18n.ts`:

```typescript
export const translations = {
  en: {
    /* ... */
  },
  vi: {
    /* ... */
  },
  // Add your language here
};
```

## 📝 Mock Data

The app currently uses mock data from `lib/mock-data.ts`. To connect to a real backend:

1. Create API routes in `app/api/`
2. Replace mock data calls with API fetches
3. Implement authentication logic
4. Add database integration

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Other Platforms

Build the app and deploy the `.next` folder:

```bash
npm run build
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ using Next.js and TailwindCSS
