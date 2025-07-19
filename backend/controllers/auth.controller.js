const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log('📝 Signup attempt:', username, email);

    console.log("Signup attempt:");
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password (raw):", password); // Only for debugging

    // check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    // create user
    const newUser = await User.create({ username, email, password: hashedPassword, role: role || 'user' });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login request for:', email);

    // find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`❌ Login failed: user not found for email: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`❌ Login failed: incorrect password for email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // create token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userObj = { id: user.id, username: user.username, email: user.email, role: user.role };
    console.log('Login response:', { token, user: userObj });
    res.json({ token, user: userObj });
  } catch (error) {
    console.error('Login failed:', error.message);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'created_at']
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch profile', error: error.message });
  }
};

module.exports = {
  signup,
  login,
  profile
};
