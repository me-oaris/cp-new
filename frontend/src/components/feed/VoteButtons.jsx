import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

const VoteButtons = ({
  upvotes = 0,
  downvotes = 0,
  userVote = null, // 'up', 'down', or null
  onVote
}) => {
  const handleVoteClick = (voteType) => {
    // Only call onVote if it's provided
    if (onVote) {
      onVote(voteType);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Upvote Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleVoteClick('up')}
        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${
          userVote === 'up'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
        }`}
      >
        <ThumbsUp className="w-4 h-4" />
        <span className="text-sm font-medium">{upvotes}</span>
      </motion.button>

      {/* Downvote Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleVoteClick('down')}
        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${
          userVote === 'down'
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
        }`}
      >
        <ThumbsDown className="w-4 h-4" />
        <span className="text-sm font-medium">{downvotes}</span>
      </motion.button>
    </div>
  )
}

export default VoteButtons
