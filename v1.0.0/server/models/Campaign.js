const mongoose = require('mongoose');
const campaignSchema = new mongoose.Schema({
title: { type: String, required: true },
description: { type: String, required: true },
category: { type: String, enum: ['health','education','disaster','others'], default: 'others' },
goalAmount: { type: Number, required: true },
raisedAmount: { type: Number, default: 0 },
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
createdAt: { type: Date, default: Date.now },
status: { type: String, enum: ['active','closed'], default: 'active' }
});
module.exports = mongoose.model('Campaign', campaignSchema);