const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const nutritionGoalSchema = new mongoose.Schema({
  title: String,
  description: String,
  targetCalories: Number,
  targetCarbs: Number,
  targetProtein: Number,
  targetFat: Number
}, { _id: false });



const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String},
  googleId: { type: String, unique: true, sparse: true },
  nutritionGoals: [nutritionGoalSchema],
 // healthData: healthDataSchema
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
