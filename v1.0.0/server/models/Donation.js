const mongoose = require('mongoose');
const donationSchema = new mongoose.Schema({
donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
amount: { type: Number, required: true },
donatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Donation', donationSchema);