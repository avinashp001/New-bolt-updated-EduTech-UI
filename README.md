# AI-Powered EdTech Platform

A comprehensive educational technology platform powered by AI for personalized exam preparation and study management.

## Features

- 🤖 **AI-Powered Study Mentor** - Get personalized guidance and study recommendations
- 📊 **Real-Time Analytics** - Track your progress with detailed charts and insights
- ⏱️ **Study Session Timer** - Time your study sessions with performance tracking
- 📅 **AI Study Plan Generator** - Create personalized study schedules
- 📚 **Subject Management** - Organize and track multiple subjects
- 📈 **Progress Tracking** - Monitor your improvement over time
- 🔐 **Secure Authentication** - Powered by Clerk for reliable user management

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase
- **AI**: Mistral AI
- **Charts**: Recharts
- **Icons**: Lucide React

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-edtech-platform
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Mistral AI Configuration (Optional)
VITE_MISTRAL_API_KEY=your_mistral_api_key
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the database migrations (located in `supabase/migrations/`)
3. Enable Row Level Security (RLS) on all tables
4. Copy your project URL and anon key to the `.env` file

### 4. Clerk Setup

1. Create a new Clerk application
2. Configure your sign-in/sign-up options
3. Copy your publishable key to the `.env` file
4. Set up redirect URLs in Clerk dashboard

### 5. Mistral AI Setup (Optional)

1. Create a Mistral AI account
2. Generate an API key
3. Add it to your `.env` file
4. The app works with mock AI responses if no API key is provided

### 6. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Schema

The application uses the following main tables:

- `users` - User profiles and preferences
- `study_sessions` - Individual study session records
- `study_plans` - AI-generated study plans
- `progress_reports` - Subject-wise progress tracking
- `uploaded_materials` - Study materials and AI analysis

## Features Overview

### Authentication
- Secure sign-in/sign-up with Clerk
- Automatic user profile creation in Supabase
- Session management and logout functionality

### Study Session Tracking
- Timer with start/pause/stop functionality
- Subject selection and topic tracking
- Performance scoring (1-10 scale)
- Automatic progress analysis

### AI-Powered Features
- Study plan generation based on exam type and preferences
- Progress analysis with personalized recommendations
- PDF content extraction and analysis
- Interactive AI mentor chat

### Analytics Dashboard
- Real-time progress charts
- Subject-wise performance tracking
- Study time distribution analysis
- Weekly and overall statistics

### Study Plan Management
- AI-generated personalized study schedules
- Weekly breakdowns and milestones
- Subject rotation and time allocation
- Progress tracking against plan

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.