const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://kiki0828:3PhGMv87IRSBxIFt@cluster0.gzp4vqt.mongodb.net/?retryWrites=true&w=majority'
    );
    console.log('Success: Connected to MongoDB');
  } catch (err) {
    console.log('Fail: Unconnected to MongoDB');
    throw new Error();
  }
};
module.exports = connectDB;
