const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  cities:[{
    type: String,
    trim: true
  }]
  },{
    timestamps: true
  });

 const Location = mongoose.model('Location', locationSchema);
 
 module.exports = Location;