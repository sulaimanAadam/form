const mongoose = require('mongoose');

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb+srv://muhammadsulaiman0817327:GcSPS2EDT7GCOEY4@node.ypazv.mongodb.net/signup');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

connectToDatabase();

const loginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const collection = mongoose.model('signup', loginSchema);

module.exports = collection;
