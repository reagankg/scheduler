const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

// Password validation regex
// const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
const passwordRegex = /^.{6,}$/;

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, initialPassword, role, password } = req.body;
    
    // Validate password strength
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Password must be 6+ characters with 1 uppercase and 1 special character'
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ firstName, lastName, email, initialPassword, role, password: hashedPassword });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Set secure HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000
    });

    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Set secure HTTP-only cookie
    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 3600000
    // });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 12 * 60 * 60 * 1000
    });

    res.json({ 
      message: 'Login successful',
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, token: token, special: user.special }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error: 'Password must be 6+ characters'
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.initialPassword = "Password-Reset"; // Update initial password if needed
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   UPDATE USER
========================= */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (email) {
      const emailTaken = await User.findOne({ email, _id: { $ne: id } });
      if (emailTaken) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 🔴 SOCKET EMIT (UPDATE)
    // req.app.get('io').emit('user-change', {
    //   operationType: 'update',
    //   documentKey: { _id: updatedUser._id },
    //   updateDescription: {
    //     updatedFields: updatedUser.toObject()
    //   }
    // });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   DELETE USER
========================= */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 🔴 SOCKET EMIT (DELETE)
    // req.app.get('io').emit('user-change', {
    //   operationType: 'delete',
    //   documentKey: { _id: deletedUser._id }
    // });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
};

exports.verifyToken = (req, res) => {
  res.json({ valid: true, user: req.user });
};