const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 3031;

// Enable CORS for development
app.use(cors());
app.use(express.json());

// Workshop users with different roles for access control demo
const WORKSHOP_USERS = [
  {
    email: 'admin@tpch.com',
    name: 'Admin User',
    role: 'global_admin',
    password: 'password'
  },
  {
    email: 'director_na@tpch.com',
    name: 'North America Director',
    role: 'regional_director',
    password: 'password'
  },
  {
    email: 'director_eu@tpch.com',
    name: 'Europe Director',
    role: 'regional_director',
    password: 'password'
  },
  {
    email: 'sarah_jones@tpch.com',
    name: 'Sarah Jones',
    role: 'sales_rep',
    password: 'password'
  },
  {
    email: 'mike_chen@tpch.com',
    name: 'Mike Chen',
    role: 'sales_rep',
    password: 'password'
  }
];

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Find user
  const user = WORKSHOP_USERS.find(u => u.email === username);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token using Cube API secret with user_id field
  const token = jwt.sign(
    { user_id: user.email },
    process.env.CUBEJS_API_SECRET,
    { expiresIn: '30d' }
  );

  // Return user info and token
  res.json({
    user: {
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  });
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});