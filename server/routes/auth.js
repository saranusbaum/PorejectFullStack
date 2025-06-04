const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.json({ message: 'נרשמת בהצלחה!' });
  } catch (err) {
    res.status(400).json({ error: 'הרשמה נכשלה' });
  }
});

router.get('/check-user', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'אימייל חסר' });

  const user = await User.findOne({ email });
  res.json({ exists: !!user });
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'אימייל או סיסמה לא נכונים' });
  }

  const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({ token, name: user.name });
});

module.exports = router;
