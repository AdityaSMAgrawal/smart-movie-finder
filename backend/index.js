const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  age: Number,
  gender: String,
  country: String,
  language: String
});
const UserModel = mongoose.model('User', UserSchema);

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define a schema & model
const DataSchema = new mongoose.Schema({ 
  feedback: String,
  rating: Number,
  movieId: String,
  tags: [String],
  watched: { type: Boolean, default: false },
  timeSpent: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
 });
const DataModel = mongoose.model('Data', DataSchema);

// API Route
app.post('/data', async (req, res) => {
  try {
    if (req.body.userId && typeof req.body.userId === "string") {
      req.body.userId = new mongoose.Types.ObjectId(req.body.userId);
    }
    const newData = new DataModel(req.body);
    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));

app.post('/register', async (req, res) => {
  const { username, password, age, gender, country, language } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = new UserModel({
      username,
      password: hashed,
      age,
      gender,
      country,
      language
    });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

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