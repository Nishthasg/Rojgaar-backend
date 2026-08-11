const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    default: 0
  },
  skills: [{
    type: String
  }],
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true 
  },
  hourlyRate: {
    type: Number,
    required: true 
  },
  availability: {
    type: Boolean,
    default: true 
  },
  profileImage: {
    type: String,
    default: ""
  },
  bio:{
    type: String,
    default: ""
  }
}, {
    timestamps: true  
});

const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;