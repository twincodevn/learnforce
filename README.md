# LearnForce - Duolingo-style Learning Platform

A gamified learning platform built with Next.js 15, featuring XP systems, streaks, achievements, and interactive lessons.

## Features

- 🎮 **Gamification**: XP system, levels, streaks, and achievements
- 📚 **Interactive Lessons**: Multiple choice, fill-in-the-blank, and coding challenges
- 🏆 **Leaderboards**: Compete with other learners
- 🔐 **Authentication**: Secure user registration and login
- 📊 **Progress Tracking**: Detailed analytics and learning statistics
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: Zustand

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── learn/            # Learning interface
│   └── api/              # API routes
├── components/            # React components
│   ├── features/         # Feature-specific components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── auth/             # Authentication config
│   ├── database/         # Database connection
│   └── utils/            # Helper functions
└── types/                # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd learnforce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users**: User accounts with gamification data (XP, level, streak)
- **Subjects**: Learning categories (e.g., JavaScript, React)
- **Lessons**: Individual learning units with content and exercises
- **UserProgress**: Tracks completion and performance
- **Achievements**: Unlockable rewards for milestones
- **Leaderboards**: Rankings and competition data

## Key Components

### Gamification System

- **XP & Levels**: Progressive experience system with level titles
- **Streaks**: Daily learning consistency tracking
- **Achievements**: Milestone-based rewards
- **Progress Tracking**: Detailed learning analytics

### Learning Interface

- **Lesson Types**: Multiple choice, fill-in-the-blank, coding challenges
- **Progress Visualization**: Real-time progress bars and statistics
- **Adaptive Difficulty**: Content adjusts based on performance

### Authentication

- **Secure Registration**: Password hashing with bcrypt
- **Session Management**: JWT-based authentication
- **User Profiles**: Customizable user information

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints
- `GET /api/users/progress` - User progress data
- `POST /api/lessons/complete` - Mark lesson as complete
- `GET /api/leaderboard` - Leaderboard data

## Customization

### Adding New Lesson Types

1. Extend the `LessonContent` type in `src/types/index.ts`
2. Create a new component in `src/components/features/lessons/`
3. Update the lesson renderer to handle the new type

### Adding New Achievements

1. Add achievement data to the database
2. Update the achievement checking logic in `src/lib/utils/gamification.ts`
3. Add achievement display components

### Styling

The application uses Tailwind CSS with a custom design system. Key design tokens:

- **Primary Colors**: Blue (#3B82F6) and Purple (#8B5CF6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using Next.js and Tailwind CSS