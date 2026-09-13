import bcrypt from 'bcrypt';
import pool from '../db.js';

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (!['PROJECT_MANAGER', 'DEVELOPER'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be PROJECT_MANAGER or DEVELOPER.' });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name, email, passwordHash, role]
    );

    res.status(201).json({ 
      message: 'Team member created successfully.', 
      user: newUser.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating user.' });
  }
};