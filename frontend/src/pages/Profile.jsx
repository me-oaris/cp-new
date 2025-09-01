import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import {
  Edit,
  Calendar,
  MapPin,
  Mail,
  User,
  Heart,
  Settings,
  Grid,
  List
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
// import { getUserById, getPostsByUserId } from '../data/mockData' // Remove mockData import
import Avatar from '../components/common/Avatar'
import Button from '../components/common/Button'
import PostCard from '../components/feed/PostCard'
import Input from '../components/common/Input'

const API_BASE_URL = 'http://localhost:5000/api'

const Profile = () => {
  const { userId } = useParams()
  const { user: currentUser, updateProfile: updateAuthProfile } = useAuth()
  const [profileUser, setProfileUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('posts')
  const [viewMode, setViewMode] = useState('list')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')

  const targetUserId = userId || currentUser?.id

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!targetUserId) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      try {
        const userResponse = await axios.get(`${API_BASE_URL}/users/${targetUserId}`)
        setProfileUser(userResponse.data.user)
        setEditName(userResponse.data.user.name)
        setEditBio(userResponse.data.user.bio)

        // Fetch posts by user ID
        const postsResponse = await axios.get(`${API_BASE_URL}/posts?authorId=${targetUserId}`)
        setUserPosts(postsResponse.data.posts)

        // Filter liked posts from all posts
        const allPostsResponse = await axios.get(`${API_BASE_URL}/posts`); // Fetch all posts to find liked ones
        const allPosts = allPostsResponse.data.posts;
        const liked = allPosts.filter(post => userResponse.data.user.likedPosts.includes(post.id));
        setLikedPosts(liked);

      } catch (err) {
        console.error('Error fetching user profile or posts:', err)
        setError('Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [targetUserId])

  const handleUpdateProfile = async () => {
    setIsEditingProfile(false) // Temporarily set to false, can be loading state
    setError('')
    try {
      await updateAuthProfile({ name: editName, bio: editBio })
      setProfileUser(prev => ({
        ...prev,
        name: editName,
        bio: editBio,
      }))
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.message)
    } finally {
      // setIsEditingProfile(false) // If you add a loading state for this specific action
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        <p>{error}</p>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">User not found</h2>
        <p className="text-gray-400">The user you're looking for doesn't exist.</p>
      </div>
    )
  }

  const isOwnProfile = targetUserId === currentUser?.id

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const tabs = [
    { id: 'posts', label: 'My Posts', count: userPosts.length },
    { id: 'liked', label: 'Liked Posts', count: likedPosts.length || 0 },
    { id: 'settings', label: 'Settings', count: null }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="space-y-6">
            {userPosts.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-200 mb-2">No posts yet</h3>
                <p className="text-gray-400 mb-4">Start sharing with the community!</p>
                {isOwnProfile && <Button>Create your first post</Button>}
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                {userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <PostCard post={post} onVote={() => {}} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )
      case 'liked':
        return (
          <div className="space-y-6">
            {likedPosts.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-200 mb-2">No Liked Posts</h3>
                <p className="text-gray-400">Posts you've liked will appear here.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                {likedPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <PostCard post={post} onVote={() => {}} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Profile Settings</h3>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <div className="space-y-4">
                <div>
                  <Input
                    label="Display Name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <Button onClick={handleUpdateProfile}>Save Changes</Button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar src={profileUser.avatar} alt={profileUser.name} size="xl" />
            {isOwnProfile && (
              <Button variant="outline" size="sm" onClick={() => setActiveTab('settings')}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-100 mb-2">{profileUser.name}</h1>
              <p className="text-gray-400">{profileUser.bio}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined {formatDate(profileUser.joinDate)}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Bharatpur</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{profileUser.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <User className="w-4 h-4" />
                <span className="text-sm">{userPosts.length} posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className="bg-gray-600/50 px-1.5 py-0.5 rounded text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* View Mode Toggle (only for posts tab) */}
          {(activeTab === 'posts' && userPosts.length > 0) || (activeTab === 'liked' && likedPosts.length > 0) && (
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
