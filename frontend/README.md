# CivicPulse Frontend

A modern, responsive community platform for Bharatpur users built with React, featuring a dark purple theme and comprehensive user engagement features.

## 🚀 Features

### Authentication
- **User Registration & Login**: Secure authentication with form validation
- **Demo Credentials**: Pre-configured test accounts for easy testing
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Persistent Sessions**: User data stored in localStorage

### Community Feed
- **Post Types**: Issues, Announcements, and Progress updates
- **Interactive Voting**: Upvote/downvote system with real-time updates
- **Search & Filtering**: Find posts by content and type
- **Comments System**: View and interact with post comments
- **Image Support**: Upload and display images with posts

### User Profiles
- **Personal Dashboard**: View user information and activity
- **Post Management**: See all posts created by the user
- **Settings Panel**: Edit profile information
- **Grid/List Views**: Flexible post display options

### Modern UI/UX
- **Dark Purple Theme**: Beautiful dark mode with purple accents
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion powered transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Loading States**: Visual feedback for all interactions

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and dev server

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd civicpulse-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Demo Credentials

Use these credentials to test the application:

- **Email**: `priya@example.com`
- **Password**: `password123`

Additional test accounts:
- `rajesh@example.com` / `password123`
- `meera@example.com` / `password123`
- `amit@example.com` / `password123`
- `sunita@example.com` / `password123`

## 📱 Features Overview

### Authentication Flow
1. **Registration**: Create a new account with validation
2. **Login**: Sign in with email and password
3. **Protected Routes**: Automatic redirection to login
4. **Logout**: Secure session termination

### Community Interaction
1. **Browse Feed**: View all community posts
2. **Filter Posts**: Filter by type (Issues, Announcements, Progress)
3. **Search**: Find posts by title or content
4. **Vote**: Upvote or downvote posts
5. **Comment**: View post comments and interactions

### Content Creation
1. **Create Posts**: Share issues, announcements, or progress updates
2. **Image Upload**: Add images to posts
3. **Form Validation**: Real-time validation feedback
4. **Preview**: See post preview before publishing

### User Management
1. **Profile View**: See user information and activity
2. **Post History**: View all posts by a user
3. **Settings**: Edit profile information
4. **Responsive Design**: Works on all device sizes

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#8b5cf6, #7c3aed, #6d28d9)
- **Background**: Dark grays (#0f0f23, #1a1a2e, #16213e)
- **Text**: Light grays (#f8fafc, #e2e8f0, #cbd5e1)
- **Cards**: Dark with subtle borders (#374151, #4b5563)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately across devices

### Components
- **Buttons**: Primary, secondary, outline, and ghost variants
- **Cards**: Consistent styling with hover effects
- **Forms**: Validated inputs with error states
- **Modals**: Overlay dialogs with backdrop blur

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Reusable UI components
│   ├── feed/           # Feed and post components
│   └── layout/         # Layout components
├── contexts/           # React contexts
├── data/              # Mock data and helpers
├── pages/             # Page components
└── hooks/             # Custom React hooks
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌟 Key Features

### Responsive Design
- **Mobile First**: Designed for mobile, enhanced for desktop
- **Breakpoints**: 320px to 1920px+ support
- **Touch Friendly**: Proper touch targets and interactions
- **Adaptive Layout**: Sidebar collapses on mobile

### Performance
- **Code Splitting**: Automatic route-based code splitting
- **Optimized Images**: Proper image handling and fallbacks
- **Smooth Animations**: 60fps animations with Framer Motion
- **Fast Loading**: Vite-powered fast development and builds

### Accessibility
- **ARIA Labels**: Proper accessibility attributes
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus handling in modals
- **Screen Reader**: Compatible with screen readers

## 🔧 Customization

### Styling
The application uses Tailwind CSS with a custom configuration. You can modify:
- Colors in `tailwind.config.js`
- Component styles in `src/index.css`
- Individual component styling

### Mock Data
Edit `src/data/mockData.js` to:
- Add more users
- Modify posts
- Change community statistics

### Features
The modular architecture makes it easy to:
- Add new post types
- Implement real backend integration
- Add more user features
- Extend the authentication system

## 📄 License

This project is created for demonstration purposes. Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue in the repository.

---

**Built with ❤️ for the Bharatpur community**
