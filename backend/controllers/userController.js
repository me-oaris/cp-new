const db = require('../db/database');

const getUserProfile = (req, res) => {
  const { id } = req.params;

  db.get('SELECT id, name, email, avatar, joinDate, bio, posts, likedPosts FROM users WHERE id = ?', [id], (err, user) => {
    if (err) {
      console.error('Error fetching user profile:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.posts = JSON.parse(user.posts);
    user.likedPosts = JSON.parse(user.likedPosts);
    res.status(200).json({ user });
  });
};

const updateProfile = (req, res) => {
  const { name, bio, avatar } = req.body;
  const { userId } = req;

  db.run(
    'UPDATE users SET name = ?, bio = ?, avatar = ? WHERE id = ?',
    [name, bio, avatar, userId],
    function (err) {
      if (err) {
        console.error('Error updating profile:', err.message);
        return res.status(500).json({ message: 'Server error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      db.get('SELECT id, name, email, avatar, joinDate, bio, posts, likedPosts FROM users WHERE id = ?', [userId], (err, updatedUser) => {
        if (err) {
          console.error('Error fetching updated user:', err.message);
          return res.status(500).json({ message: 'Server error' });
        }
        updatedUser.posts = JSON.parse(updatedUser.posts);
        updatedUser.likedPosts = JSON.parse(updatedUser.likedPosts);
        res.status(200).json({ success: true, user: updatedUser });
      });
    }
  );
};

const getAllUsers = (req, res) => {
  db.all('SELECT id, name, email, avatar, joinDate, bio, posts, likedPosts FROM users', [], (err, users) => {
    if (err) {
      console.error('Error fetching all users:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }
    const formattedUsers = users.map(user => ({
      ...user,
      posts: JSON.parse(user.posts),
      likedPosts: JSON.parse(user.likedPosts),
    }));
    res.status(200).json({ users: formattedUsers });
  });
};

module.exports = { getUserProfile, updateProfile, getAllUsers };
