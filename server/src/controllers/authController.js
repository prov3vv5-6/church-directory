const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');

// Helper — creates a signed JWT containing the user's id and email
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, is_admin: user.is_admin || false },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    console.log('register hit, body:', req.body);
    const { name, email, password, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    console.log('checking for existing user...');
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }

    console.log('hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    console.log('creating user...');
    const user = await createUser(name, email, passwordHash, address, req.imageUrl);

    console.log('user created:', user.id);
    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error('register error:', err);
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Look up the user — findUserByEmail includes password_hash
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Compare the submitted password against the stored hash
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Strip password_hash before sending user data to the frontend
  const { password_hash, ...safeUser } = user;

  const token = generateToken(user);
  res.json({ token, user: safeUser });
}

// GET /api/auth/me — returns the currently logged-in user's profile
async function getMe(req, res) {
  const user = await require('../models/userModel').findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
}

module.exports = { register, login, getMe };
