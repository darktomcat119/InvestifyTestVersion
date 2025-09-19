# 🚀 Investify - AI-First Investment Platform

A modern, professional investment platform built with Next.js 14, Fastify, and real-time capabilities for seamless investor-founder interactions.

## ✨ Features

### 🎯 Core Functionality
- **Real-time Chat System** - Powered by Ably for instant messaging
- **KYC Verification** - Dual-check verification with Persona (ID + Selfie)
- **Video/Voice Calls** - Integrated Jitsi Meet for seamless communication
- **File Sharing** - Secure document upload and sharing
- **Scheduling System** - FullCalendar integration for meeting management
- **Investment Scoring** - AI-powered investability assessment

### 🎨 User Experience
- **Dark/Light Theme** - Seamless theme switching with next-themes
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Professional UI** - Modern design with Font Awesome icons
- **Smooth Animations** - Framer Motion for enhanced interactions
- **Real-time Notifications** - Toast notifications and in-app alerts

### 🔧 Technical Features
- **TypeScript** - Full type safety across frontend and backend
- **Database Integration** - Prisma ORM with SQLite
- **Authentication** - Session-based auth with secure cookies
- **API Validation** - Zod schema validation
- **Error Handling** - Comprehensive error management
- **Environment Configuration** - Secure environment variable management

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Font Awesome** - Icon library
- **React Toastify** - Notification system
- **Ably** - Real-time messaging

### Backend
- **Fastify** - Fast and efficient Node.js framework
- **TypeScript** - Type-safe backend development
- **Prisma** - Modern database ORM
- **SQLite** - Lightweight database
- **Zod** - Schema validation
- **JWT** - Secure authentication

### External Services
- **Persona** - KYC verification service
- **Ably** - Real-time messaging platform
- **Jitsi Meet** - Video conferencing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd InvestifyTestVersion
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**
```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend environment
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your configuration
```

4. **Database Setup**
```bash
cd backend
npx prisma generate
npx prisma db push
```

5. **Start Development Servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret"
PERSONA_API_KEY="your-persona-api-key"
PERSONA_ID_TEMPLATE_ID="your-id-template-id"
PERSONA_SELFIE_TEMPLATE_ID="your-selfie-template-id"
```

#### Frontend (.env)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_ABLY_KEY="your-ably-api-key"
NEXT_PUBLIC_PERSONA_API_KEY="your-persona-api-key"
NEXT_PUBLIC_PERSONA_ID_TEMPLATE_ID="your-id-template-id"
NEXT_PUBLIC_PERSONA_SELFIE_TEMPLATE_ID="your-selfie-template-id"
```

## 📱 Usage

### For Founders
1. **Register** - Create your account and company profile
2. **Complete KYC** - Verify your identity with dual-check verification
3. **Upload Documents** - Share pitch decks and financial documents
4. **Schedule Meetings** - Book calls with potential investors
5. **Chat** - Communicate in real-time with investors

### For Investors
1. **Browse Companies** - View available investment opportunities
2. **Review Profiles** - Access detailed company information
3. **Schedule Calls** - Book meetings with founders
4. **Real-time Chat** - Communicate instantly with founders
5. **File Sharing** - Exchange documents securely

## 🏗️ Project Structure

```
InvestifyTestVersion/
├── backend/                 # Fastify API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Server entry point
│   ├── prisma/             # Database schema
│   └── package.json
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   └── lib/           # Utility libraries
│   └── package.json
├── shared/                 # Shared types
└── docker-compose.yml      # Docker configuration
```

## 🔒 Security Features

- **Session-based Authentication** - Secure cookie-based sessions
- **Input Validation** - Zod schema validation for all inputs
- **File Upload Security** - MIME type and size validation
- **Rate Limiting** - API rate limiting for security
- **CORS Protection** - Configured CORS policies
- **Environment Security** - Secure environment variable handling

## 🚀 Deployment

### Docker Deployment
```bash
docker-compose up -d
```

### Manual Deployment
1. Build the frontend: `cd frontend && npm run build`
2. Start the backend: `cd backend && npm start`
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates
5. Configure environment variables

## 📊 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Company Management
- `GET /api/company` - Get company profile
- `POST /api/company` - Create/update company
- `GET /api/company/score` - Get investability score

### KYC Verification
- `POST /api/persona/create-inquiry` - Create verification inquiry
- `POST /api/persona/complete/:id` - Complete verification
- `GET /api/persona/check-status/:id` - Check verification status

### Messaging
- `GET /api/messages` - Get messages
- `POST /api/messages/send` - Send message
- `GET /api/notifications` - Get notifications

### File Management
- `POST /api/files/upload` - Upload file
- `GET /api/files` - Get files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🎯 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Advanced AI scoring algorithms
- [ ] Multi-language support
- [ ] Advanced security features
- [ ] Performance optimizations

---

**Built with ❤️ for the future of investment technology**
