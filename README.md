# Rira - AI Social Media Manager

An intelligent social media management platform powered by AI that helps brands create, schedule, and manage their social media content effortlessly.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      SvelteKit Frontend                     │
└────────────────────────────┬────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
      ┌──────────────┐  ┌─────────┐  ┌──────────────┐
      │   AI Chat    │  │   API   │  │  File Mgmt   │
      │   Endpoint   │  │  Routes │  │   Endpoints  │
      └──────┬───────┘  └────┬────┘  └──────┬───────┘
             │               │               │
             │          ┌────┴────┐          │
             │          │  Auth   │          │
             │          └────┬────┘          │
             │               │               │
             ▼               ▼               ▼
      ┌──────────────────────────────────────────┐
      │         Google Gemini 2.5 Flash          │
      │      (Photocard & Post AI Tools)         │
      └──────────────────┬───────────────────────┘
                         │
                         ▼
      ┌──────────────────────────────────────────┐
      │      SQLite DB (Drizzle ORM)             │
      │  • Users    • Posts      • Photocards    │
      │  • Orgs     • Schedules  • Integrations  │
      └──────────────────────────────────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  Facebook   │
                  │  Graph API  │
                  └─────────────┘
```

## Features

### Content Creation
- AI-powered chat interface for content ideation and creation
- Photocard generation and editing
- Post creation with captions and visuals

### Brand Management
- Customizable brand profiles (name, tagline, description)
- Logo upload and management
- Brand identity settings (colors, fonts, design instructions)

### Scheduling
- Schedule posts for future publishing
- Intelligent schedule management with automatic cleanup
- Timestamp formatting in localized timezones

### Social Media Integration
- Facebook Page integration
- Secure credential storage
- Multi-platform publishing support

### Post Management
- Create, read, update, and delete posts
- Associate photocards with posts
- View recent posts with formatted schedules

## Tech Stack

- **Frontend**: SvelteKit
- **Backend**: SvelteKit API Routes
- **Database**: SQLite with Drizzle ORM
- **Authentication**: Better Auth
- **AI**: Google Gemini 2.5 Flash (via AI SDK)
- **File Storage**: Local file system
- **Social Media**: Facebook Graph API

## Database Schema

The application uses the following main tables:

- `user` - User accounts and authentication
- `organization` - Brand/organization profiles
- `photocard` - Generated visual content
- `post` - Social media posts
- `schedule` - Post scheduling information
- `integration` - Social media platform credentials
- `session` / `account` / `verification` - Authentication tables

## API Endpoints

### AI & Content
- `POST /api/chat` - AI chat with streaming responses

### File Management
- `POST /api/upload/logo` - Upload brand logos (max 5MB, PNG/JPEG/WebP/SVG)
- `GET /api/files/[directory]/[filename]` - Serve uploaded files

### Brand & Settings
- `PATCH /api/update/brand` - Update organization details
- `PATCH /api/update/integration` - Manage social media integrations

### Post Operations
- `PATCH /api/update/post` - Update post content and schedule
- `DELETE /api/delete/post` - Delete posts and associated schedules

## Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

```sh
# Clone the repository
git clone https://github.com/AdidR10/Rira-AISocialMediaManager.git
cd Rira-AISocialMediaManager

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with required credentials:
# - BETTER_AUTH_URL
# - Database connection
# - Google Gemini API key
# - Facebook API credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

### Development

```sh
# Start development server
npm run dev

# Open in browser
npm run dev -- --open
```

### Building for Production

```sh
# Create production build
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory:

```env
BETTER_AUTH_URL=your_auth_url
DATABASE_URL=path_to_sqlite_db
GEMINI_API_KEY=your_gemini_api_key
```

## Database Migrations

Drizzle ORM is used for database management:

```sh
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## Project Structure

```
├── src/
│   ├── lib/
│   │   ├── server/
│   │   │   ├── ai/           # AI tools and providers
│   │   │   ├── auth/         # Authentication logic
│   │   │   └── db/           # Database schema and connection
│   │   └── components/       # Svelte components
│   └── routes/
│       ├── api/              # API endpoints
│       └── (app)/            # Application pages
├── drizzle/                  # Database migrations
└── images/                   # Uploaded files (logos, photocards)
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes with detailed messages
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Deployment

To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment (Vercel, Netlify, Node.js, etc.).
