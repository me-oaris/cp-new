const express = require('express');
const multer = require('multer'); // Import multer
const { createPost, getPosts, getPostById, updatePost, deletePost, upvotePost, downvotePost, addComment } = require('../controllers/postController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Multer for file uploads (specific to posts routes)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post('/', protect, upload.single('image'), createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/upvote', protect, upvotePost);
router.put('/:id/downvote', protect, downvotePost);
router.post('/:id/comments', protect, addComment);

module.exports = router;
