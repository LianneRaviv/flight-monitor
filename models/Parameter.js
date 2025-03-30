

const mongoose = require('mongoose');

const parameterSchema = new mongoose.Schema({
    altitude: {type: Number, repuired: true },
    HSI: { type: Number, required: true },
    ADI: { type: Number, required: true },

});

module.exports = mongoose.model('parameter', parameterSchema);