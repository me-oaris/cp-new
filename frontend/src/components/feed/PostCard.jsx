import { useState, useEffect } from 'react' // Import useState and useEffect
import { motion } from 'framer-motion'
import {
  MessageCircle,
  Clock,
  AlertTriangle,
  Megaphone,
  CheckCircle,
  Image as ImageIcon,
  Send
} from 'lucide-react' // Import Send icon
// import { getUserById } from '../../data/mockData' // Remove mockData import
import Avatar from '../common/Avatar'
import VoteButtons from './VoteButtons'
import Input from '../common/Input' // Import Input component
import Button from '../common/Button' // Import Button component
import axios from 'axios' // Import axios
import { useAuth } from '../../contexts/AuthContext' // Import useAuth

const API_BASE_URL = 'http://localhost:5000/api'

const PostCard = ({ post, onVote, onCommentAdded, currentUserId }) => {
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)
  const [commentError, setCommentError] = useState('')
  const { user } = useAuth()

  // Function to fetch author details (or use the one from post object if available)
  const fetchAuthor = async (authorId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${authorId}`);
      return response.data.user;
    } catch (error) {
      console.error('Error fetching author:', error);
      return null;
    }
  };

  // Using a local state for author for now, will refactor if needed.
  // This ensures the author is available even if not pre-fetched with the post.
  const [author, setAuthor] = useState(null);
  useEffect(() => {
    if (post.authorId) {
      fetchAuthor(post.authorId).then(setAuthor);
    }
  }, [post.authorId]);

  const userVote = post.likedPosts?.includes(currentUserId) 
    ? 'up' 
    : (post.downvotedPosts?.includes(currentUserId) ? 'down' : null);

  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      setCommentError('Comment cannot be empty.');
      return;
    }
    if (!user || !user.token) {
      setCommentError('You need to be logged in to comment.');
      return;
    }

    setIsCommenting(true);
    setCommentError('');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.post(
        `${API_BASE_URL}/posts/${post.id}/comments`,
        { content: commentContent },
        config
      );
      if (response.data.success) {
        // Call a prop function to update the feed with the new comment
        onCommentAdded(post.id, response.data.comment);
        setCommentContent('');
        setShowCommentInput(false);
      }
    } catch (err) {
      console.error('Error adding comment:', err.response?.data?.message || err.message);
      setCommentError(err.response?.data?.message || 'Failed to add comment.');
    } finally {
      setIsCommenting(false);
    }
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
        return null
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Issue':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Announcement':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Progress':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar src={author?.avatar} alt={author?.name} size="md" />
          <div>
            <h3 className="font-semibold text-gray-100">{author?.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Post Type Badge */}
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${getTypeColor(post.type)}`}>
          {getTypeIcon(post.type)}
          <span>{post.type}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100 leading-tight">
          {post.title}
        </h2>
        <p className="text-gray-300 leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={`http://localhost:5000${post.image}`}
            alt="Post"
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div className="hidden absolute inset-0 bg-gray-700 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Image not available</p>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="space-y-4">
        {post.comments && post.comments.length > 0 && (
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments.length} comments</span>
            </div>
            {post.comments.slice(0, 2).map((comment) => (
                <div key={comment.id} className="flex items-start space-x-2 mb-2 last:mb-0">
                  <Avatar src={comment.authorAvatar} alt={comment.authorName} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-200">{comment.authorName}</span>
                      <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            {post.comments.length > 2 && (
              <p className="text-sm text-gray-400 mt-2">
                View {post.comments.length - 2} more comments
              </p>
            )}
          </div>
        )}

        {showCommentInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <Input
              type="text"
              placeholder="Write a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              error={commentError}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCommentInput(false)}
                disabled={isCommenting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddComment}
                loading={isCommenting}
                disabled={isCommenting || !commentContent.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Comment
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <VoteButtons
          upvotes={post.upvotes}
          downvotes={post.downvotes}
          userVote={userVote} // Pass the calculated userVote
          onVote={onVote}
        />

        <button
          onClick={() => setShowCommentInput(!showCommentInput)}
          className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">Comment ({post.comments.length})</span>
        </button>
      </div>
    </motion.div>
  )
}

export default PostCard
