const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const SECRET_KEY = '08a18ea48574549d7476c97ee6192d3e';

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = Date.now().toString();
    const joinDate = new Date().toISOString();
    const avatar = `https://picsum.photos/200/200?random=${Date.now()}`;

    db.run(
      'INSERT INTO users (id, name, email, password, avatar, joinDate, bio, posts, likedPosts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, email, hashedPassword, avatar, joinDate, '', JSON.stringify([]), JSON.stringify([])],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ message: 'User with that email already exists' });
          }
          console.error('Error during registration:', err.message);
          return res.status(500).json({ message: 'Server error' });
        }

        const user = { id, name, email, avatar, joinDate, bio: '', posts: [], likedPosts: [] };
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ success: true, user, token });
      }
    );
  } catch (err) {
    console.error('Error during password hashing:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.error('Error during login:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userData = { ...user };
    delete userData.password;
    userData.posts = JSON.parse(userData.posts);
    userData.likedPosts = JSON.parse(userData.likedPosts);

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ success: true, user: userData, token });
  });
};

module.exports = { registerUser, loginUser };
