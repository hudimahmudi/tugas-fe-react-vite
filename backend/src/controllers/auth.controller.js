const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({ message: 'Nama, email, dan password wajib diisi' });
    }
    if (password.length < 8) {
      return res.status(422).json({ message: 'Password minimal 8 karakter' });
    }

    const existing = await db('users').where({ email }).first();
    if (existing) {
      return res.status(422).json({ message: 'Email already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [id] = await db('users').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash: passwordHash,
      role: 'creator',
    });

    const user = await db('users').where({ id }).first();
    res.status(201).json(publicUser(user));
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ message: 'Email dan password wajib diisi' });
    }

    const user = await db('users').where({ email: email.trim().toLowerCase() }).first();
    const valid = user && (await bcrypt.compare(password, user.password_hash));

    if (!valid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    res.json({ token: createToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };