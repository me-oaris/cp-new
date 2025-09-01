const db = require('../db/database');
const fs = require('fs'); // Added fs for image deletion

const createPost = (req, res) => {
  const { title, content, type } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null; // Get image path if uploaded
  const { userId } = req;

  if (!title || !content || !type) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  const id = Date.now().toString();
  const createdAt = new Date().toISOString();
  const newPost = {
    id,
    title,
    content,
    type,
    authorId: userId,
    createdAt,
    upvotes: 0,
    downvotes: 0,
    comments: JSON.stringify([]),
    image,
  };

  db.run(
    'INSERT INTO posts (id, title, content, type, authorId, createdAt, upvotes, downvotes, comments, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    Object.values(newPost),
    function (err) {
      if (err) {
        console.error('Error creating post:', err.message);
        return res.status(500).json({ message: 'Server error' });
      }

      // Update user's posts array
      db.get('SELECT posts FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
          console.error('Error fetching user posts during post creation:', err.message);
          return res.status(500).json({ message: 'Server error' });
        }
        const userPosts = JSON.parse(user.posts || '[]');
        userPosts.push(id);
        db.run('UPDATE users SET posts = ? WHERE id = ?', [JSON.stringify(userPosts), userId], (err) => {
          if (err) {
            console.error('Error updating user posts during post creation:', err.message);
            return res.status(500).json({ message: 'Server error' });
          }
          res.status(201).json({ success: true, post: { ...newPost, comments: [] } });
        });
      });
    }
  );
};

const getPosts = (req, res) => {
  db.all('SELECT * FROM posts ORDER BY createdAt DESC', [], (err, posts) => {
    if (err) {
      console.error('Error fetching posts:', err.message);
      return res.status(500).json({ message: err.message });
    }
    
    // For each post, fetch the author and their liked/downvoted posts
    const postsWithVoteStatus = posts.map(async (post) => {
      const author = await new Promise((resolve, reject) => {
        db.get('SELECT likedPosts, downvotedPosts FROM users WHERE id = ?', [post.authorId], (err, user) => {
          if (err) reject(err);
          else resolve(user);
        });
      });
      
      return {
        ...post,
        comments: JSON.parse(post.comments || '[]'),
        likedPosts: author ? JSON.parse(author.likedPosts || '[]') : [],
        downvotedPosts: author ? JSON.parse(author.downvotedPosts || '[]') : [],
      };
    });

    Promise.all(postsWithVoteStatus)
      .then(results => res.status(200).json({ posts: results }))
      .catch(error => {
        console.error('Error processing posts with vote status:', error.message);
        res.status(500).json({ message: error.message });
      });
  });
};

const getPostById = (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM posts WHERE id = ?', [id], async (err, post) => {
    if (err) {
      console.error('Error fetching single post:', err.message);
      return res.status(500).json({ message: err.message });
    }
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    };

    const author = await new Promise((resolve, reject) => {
      db.get('SELECT likedPosts, downvotedPosts FROM users WHERE id = ?', [post.authorId], (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    const formattedPost = {
      ...post,
      comments: JSON.parse(post.comments || '[]'),
      likedPosts: author ? JSON.parse(author.likedPosts || '[]') : [],
      downvotedPosts: author ? JSON.parse(author.downvotedPosts || '[]') : [],
    };

    res.status(200).json({ post: formattedPost });
  });
};

const updatePost = (req, res) => {
  const { id } = req.params;
  const { title, content, type } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || null; // Handle optional image update
  const { userId } = req;

  db.get('SELECT authorId FROM posts WHERE id = ?', [id], (err, post) => {
    if (err) {
      console.error('Error checking post author:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    db.run(
      'UPDATE posts SET title = ?, content = ?, type = ?, image = ? WHERE id = ?',
      [title, content, type, image, id],
      function (err) {
        if (err) {
          console.error('Error updating post:', err.message);
          return res.status(500).json({ message: 'Server error' });
        }
        db.get('SELECT * FROM posts WHERE id = ?', [id], (err, updatedPost) => {
          if (err) {
            console.error('Error fetching updated post:', err.message);
            return res.status(500).json({ message: 'Server error' });
          }
          updatedPost.comments = JSON.parse(updatedPost.comments || '[]');
          res.status(200).json({ success: true, post: updatedPost });
        });
      }
    );
  });
};

const deletePost = (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  db.get('SELECT authorId, image FROM posts WHERE id = ?', [id], (err, post) => { // Get image path for deletion
    if (err) {
      console.error('Error checking post author for deletion:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    db.run('DELETE FROM posts WHERE id = ?', [id], function (err) {
      if (err) {
        console.error('Error deleting post:', err.message);
        return res.status(500).json({ message: 'Server error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Post not found (after check)' });
      }

      // Delete image file if it exists
      if (post.image) {
        const imagePath = `./uploads${post.image.split('/uploads')[1]}`;
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting image file:', err);
        });
      }

      // Remove post ID from author's posts array
      db.get('SELECT posts FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
          console.error('Error fetching user posts during post deletion:', err.message);
          return res.status(500).json({ message: 'Server error' });
        }
        const userPosts = JSON.parse(user.posts || '[]');
        const updatedUserPosts = userPosts.filter(postId => postId !== id);
        db.run('UPDATE users SET posts = ? WHERE id = ?', [JSON.stringify(updatedUserPosts), userId], (err) => {
          if (err) {
            console.error('Error updating user posts during post deletion:', err.message);
            return res.status(500).json({ message: 'Server error' });
          }
          res.status(200).json({ success: true, message: 'Post deleted' });
        });
      });
    });
  });
};

const upvotePost = (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  db.get('SELECT upvotes, downvotes FROM posts WHERE id = ?', [id], (err, post) => {
    if (err) {
      console.error('Error fetching post for upvote:', err.message);
      return res.status(500).json({ message: err.message });
    }
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    db.get('SELECT likedPosts, downvotedPosts FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        console.error('Error fetching user vote status:', err.message);
        return res.status(500).json({ message: err.message });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      let likedPosts = JSON.parse(user.likedPosts || '[]');
      let downvotedPosts = JSON.parse(user.downvotedPosts || '[]');
      let newUpvotes = post.upvotes;
      let newDownvotes = post.downvotes;

      const hasUpvoted = likedPosts.includes(id);
      const hasDownvoted = downvotedPosts.includes(id);

      if (hasUpvoted) {
        // User is un-upvoting
        newUpvotes--;
        likedPosts = likedPosts.filter(postId => postId !== id);
      } else {
        // User is upvoting
        newUpvotes++;
        likedPosts.push(id);
        if (hasDownvoted) {
          // If previously downvoted, remove downvote
          newDownvotes--;
          downvotedPosts = downvotedPosts.filter(postId => postId !== id);
        }
      }

      db.run('UPDATE posts SET upvotes = ?, downvotes = ? WHERE id = ?', [newUpvotes, newDownvotes, id], function (err) {
        if (err) {
          console.error('Error updating post vote counts:', err.message);
          return res.status(500).json({ message: err.message });
        }
        db.run('UPDATE users SET likedPosts = ?, downvotedPosts = ? WHERE id = ?', [JSON.stringify(likedPosts), JSON.stringify(downvotedPosts), userId], function (err) {
          if (err) {
            console.error('Error updating user vote status:', err.message);
            return res.status(500).json({ message: err.message });
          }
          db.get('SELECT * FROM posts WHERE id = ?', [id], (err, updatedPost) => {
            if (err) {
              console.error('Error fetching updated post after upvote:', err.message);
              return res.status(500).json({ message: err.message });
            }
            updatedPost.comments = JSON.parse(updatedPost.comments || '[]');
            res.status(200).json({ success: true, post: updatedPost });
          });
        });
      });
    });
  });
};

const downvotePost = (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  db.get('SELECT upvotes, downvotes FROM posts WHERE id = ?', [id], (err, post) => {
    if (err) {
      console.error('Error fetching post for downvote:', err.message);
      return res.status(500).json({ message: err.message });
    }
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    db.get('SELECT likedPosts, downvotedPosts FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        console.error('Error fetching user vote status:', err.message);
        return res.status(500).json({ message: err.message });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      let likedPosts = JSON.parse(user.likedPosts || '[]');
      let downvotedPosts = JSON.parse(user.downvotedPosts || '[]');
      let newUpvotes = post.upvotes;
      let newDownvotes = post.downvotes;

      const hasUpvoted = likedPosts.includes(id);
      const hasDownvoted = downvotedPosts.includes(id);

      if (hasDownvoted) {
        // User is un-downvoting
        newDownvotes--;
        downvotedPosts = downvotedPosts.filter(postId => postId !== id);
      } else {
        // User is downvoting
        newDownvotes++;
        downvotedPosts.push(id);
        if (hasUpvoted) {
          // If previously upvoted, remove upvote
          newUpvotes--;
          likedPosts = likedPosts.filter(postId => postId !== id);
        }
      }

      db.run('UPDATE posts SET upvotes = ?, downvotes = ? WHERE id = ?', [newUpvotes, newDownvotes, id], function (err) {
        if (err) {
          console.error('Error updating post vote counts:', err.message);
          return res.status(500).json({ message: err.message });
        }
        db.run('UPDATE users SET likedPosts = ?, downvotedPosts = ? WHERE id = ?', [JSON.stringify(likedPosts), JSON.stringify(downvotedPosts), userId], function (err) {
          if (err) {
            console.error('Error updating user vote status:', err.message);
            return res.status(500).json({ message: err.message });
          }
          db.get('SELECT * FROM posts WHERE id = ?', [id], (err, updatedPost) => {
            if (err) {
              console.error('Error fetching updated post after downvote:', err.message);
              return res.status(500).json({ message: err.message });
            }
            updatedPost.comments = JSON.parse(updatedPost.comments || '[]');
            res.status(200).json({ success: true, post: updatedPost });
          });
        });
      });
    });
  });
};

const addComment = (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const { userId } = req;

  if (!content) {
    return res.status(400).json({ message: 'Comment content cannot be empty' });
  }

  db.get('SELECT comments FROM posts WHERE id = ?', [id], (err, post) => {
    if (err) {
      console.error('Error fetching post comments for new comment:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    db.get('SELECT name FROM users WHERE id = ?', [userId], (err, user) => {
      if (err || !user) {
        console.error('Error fetching author name for new comment:', err ? err.message : 'User not found');
        return res.status(500).json({ message: 'Server error' });
      }

      const comments = JSON.parse(post.comments || '[]');
      const newComment = {
        id: Date.now().toString(),
        authorId: userId,
        authorName: user.name, // Add author name for easier display on frontend
        content,
        createdAt: new Date().toISOString(),
      };
      comments.push(newComment);

      db.run('UPDATE posts SET comments = ? WHERE id = ?', [JSON.stringify(comments), id], function (err) {
        if (err) {
          console.error('Error adding comment to post:', err.message);
          return res.status(500).json({ message: 'Server error' });
        }
        res.status(201).json({ success: true, comment: newComment });
      });
    });
  });
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost, upvotePost, downvotePost, addComment };
