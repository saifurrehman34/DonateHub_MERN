const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');


exports.donate = async (req, res) => {
const { campaignId, amount } = req.body;
if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
try {
const campaign = await Campaign.findById(campaignId);
if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
// create donation
const donation = new Donation({ donorId: req.user._id, campaignId, amount });
await donation.save();
// update campaign
campaign.raisedAmount += Number(amount);
await campaign.save();
res.json({ donation, campaign });
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};


exports.getDonorDonations = async (req, res) => {
try {
const donations = await Donation.find({ donorId: req.user._id }).populate('campaignId', 'title');
res.json(donations);
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};


exports.getCampaignDonations = async (req, res) => {
try {
const donations = await Donation.find({ campaignId: req.params.id }).populate('donorId', 'name email');
res.json(donations);
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};