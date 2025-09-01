import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  User, 
  TrendingUp, 
  AlertTriangle, 
  Megaphone, 
  CheckCircle,
  Users,
  BookOpen,
  Shield
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const postTypes = [
    { name: 'All Posts', href: '/', icon: Home, count: 15 },
    { name: 'Issues', href: '/?type=Issue', icon: AlertTriangle, count: 4 },
    { name: 'Announcements', href: '/?type=Announcement', icon: Megaphone, count: 6 },
    { name: 'Progress', href: '/?type=Progress', icon: CheckCircle, count: 5 },
  ]

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <aside className="hidden lg:block w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 min-h-screen">
      <div className="p-6 space-y-8">
        {/* User Info */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-gray-100 font-medium">{user?.name}</h3>
              <p className="text-gray-400 text-sm">Community Member</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Navigation
          </h3>
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Post Types */}
        <div className="space-y-2">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Post Types
          </h3>
          {postTypes.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                <span className="text-xs bg-gray-600 px-2 py-1 rounded-full">
                  {item.count}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Community Stats */}
        <div className="space-y-2">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Community Stats
          </h3>
          <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">Members</span>
              </div>
              <span className="text-gray-100 font-semibold">1,247</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">Posts</span>
              </div>
              <span className="text-gray-100 font-semibold">15</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">Active</span>
              </div>
              <span className="text-gray-100 font-semibold">89</span>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="space-y-2">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Guidelines
          </h3>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-primary-400 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-gray-100 mb-1">Community Guidelines</p>
                <p>Be respectful, constructive, and follow local laws. Report inappropriate content.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
