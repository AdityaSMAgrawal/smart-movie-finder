// Add to backend/index.js or a separate models/User.js
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});
const UserModel = mongoose.model('User', UserSchema);

const bcrypt = require('bcryptjs');

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = new UserModel({ username, password: hashed });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key'; // Use env variable in production

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, userId: user._id });
});