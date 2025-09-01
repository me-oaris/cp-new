import { useState, useEffect, useCallback } from 'react' // Add useCallback
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios' // Import axios
import {
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Megaphone,
  CheckCircle,
  Home
} from 'lucide-react'
// import { mockPosts, getPostsByType } from '../../data/mockData' // Remove mockData import
import PostCard from './PostCard'
import Button from '../common/Button'
import CreatePost from './CreatePost'
import { useAuth } from '../../contexts/AuthContext' // Corrected import path

const API_BASE_URL = 'http://localhost:5000/api'

const Feed = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([]) // Initialize with empty array
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(true) // Add loading state
  const [error, setError] = useState('') // Add error state
  const { user } = useAuth() // Destructure user from useAuth

  // Get filter from URL params
  const typeFilter = searchParams.get('type')

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`)
      setPosts(response.data.posts)
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('Failed to load posts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    if (typeFilter) {
      setSelectedType(typeFilter)
    } else {
      setSelectedType('All')
    }
  }, [typeFilter])

  // Filter posts based on search query and type
  useEffect(() => {
    let currentFiltered = posts

    // Filter by type
    if (selectedType !== 'All') {
      currentFiltered = currentFiltered.filter(post => post.type === selectedType)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      currentFiltered = currentFiltered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
      )
    }

    setFilteredPosts(currentFiltered)
  }, [posts, searchQuery, selectedType])

  const handleTypeFilter = (type) => {
    setSelectedType(type)
    if (type === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ type })
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Search is handled by useEffect
  }

  const handleVote = async (postId, voteType) => {
    try {
      const token = localStorage.getItem('civicpulse_user') ? JSON.parse(localStorage.getItem('civicpulse_user')).token : null;
      if (!token) {
        setError('You need to be logged in to vote.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let response;
      if (voteType === 'up') {
        response = await axios.put(`${API_BASE_URL}/posts/${postId}/upvote`, {}, config);
      } else if (voteType === 'down') {
        response = await axios.put(`${API_BASE_URL}/posts/${postId}/downvote`, {}, config);
      }

      if (response && response.data.success) {
        setPosts(prevPosts => prevPosts.map(post => 
          post.id === postId ? { ...post, ...response.data.post } : post
        ));
        // No need to call fetchPosts() here anymore
      }
    } catch (err) {
      console.error('Error voting on post:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to cast vote.');
    }
  };

  const handleCommentAdded = (postId, newComment) => {
    // Ideally, update the specific post's comments, but for simplicity, re-fetch all posts
    fetchPosts();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Issue':
        return <AlertTriangle className="w-4 h-4" />
      case 'Announcement':
        return <Megaphone className="w-4 h-4" />
      case 'Progress':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Home className="w-4 h-4" />
    }
  }

  const getTypeCount = (type) => {
    if (type === 'All') return posts.length // Use posts state
    return posts.filter(post => post.type === type).length // Use posts state
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Community Feed</h1>
          <p className="text-gray-400">Stay updated with the latest community news and issues</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Post</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </form>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Issue', 'Announcement', 'Progress'].map((type) => (
            <button
              key={type}
              onClick={() => handleTypeFilter(type)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              {getTypeIcon(type)}
              <span>{type}</span>
              <span className="bg-gray-600/50 px-1.5 py-0.5 rounded text-xs">
                {getTypeCount(type)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-200 mb-2">No posts found</h3>
                <p className="text-gray-400">
                  {searchQuery
                    ? `No posts match "${searchQuery}"`
                    : `No ${selectedType.toLowerCase()} posts available`
                  }
                </p>
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                variant="outline"
              >
                Create the first post
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PostCard
                    post={post}
                    onVote={(voteType) => handleVote(post.id, voteType)}
                    onCommentAdded={handleCommentAdded} 
                    currentUserId={user?.id} // Pass current user ID for vote status
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Post Modal */}
      <CreatePost
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={fetchPosts} // Pass fetchPosts to refresh feed after new post
      />
    </div>
  )
}

export default Feed
