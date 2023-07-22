const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../models');
require('dotenv').config();

const { User } = db;

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const payload = await User.create({
      name,
      email,
      password,
      role,
    });
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      payload,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to register user', error });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
    );
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      payload: { token },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to log in', error });
  }
};

module.exports = {
  register,
  signIn,
};
