const mongoose = require('mongoose');
const cors = require('cors');
mongoose.set('useCreateIndex', true);


const registrationSchema = new mongoose.Schema({
  PartName: {
    type: String,
    trim: true,
  },
  PartNo: {
    type: String,
    trim: true,
  },
  Quantity: {
    type: String,
    trim: true,
  },
  DrawingNo:{
    type: String,
    trim: true,
  },
  Group:{
    type: String,
    trim: true,
  },
  Model:{
    type: String,
    trim: true,
  },
  Tags:{
    type: Array,
    trim: true,
  }

});



registrationSchema.index({ PartName: 'text' });

module.exports = mongoose.model('Registration', registrationSchema);

