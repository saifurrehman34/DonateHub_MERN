const Campaign = require('../models/Campaign');
try {
const campaign = new Campaign({ title, description, category, goalAmount, createdBy: req.user._id });
await campaign.save();
res.json(campaign);
} catch (err) {
res.status(500).json({ message: 'Server error' });
};


exports.getCampaigns = async (req, res) => {
const { q, category } = req.query;
const filter = {};
if (q) filter.$or = [ { title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') } ];
if (category) filter.category = category;
try {
const campaigns = await Campaign.find(filter).populate('createdBy', 'name email');
res.json(campaigns);
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};


exports.getCampaign = async (req, res) => {
try {
const campaign = await Campaign.findById(req.params.id).populate('createdBy', 'name email');
if (!campaign) return res.status(404).json({ message: 'Not found' });
res.json(campaign);
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};


exports.updateCampaign = async (req, res) => {
try {
const campaign = await Campaign.findById(req.params.id);
if (!campaign) return res.status(404).json({ message: 'Not found' });
if (!campaign.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized' });
const fields = ['title','description','category','goalAmount','status'];
fields.forEach(f => { if (req.body[f] !== undefined) campaign[f] = req.body[f]; });
await campaign.save();
res.json(campaign);
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};


exports.deleteCampaign = async (req, res) => {
try {
const campaign = await Campaign.findById(req.params.id);
if (!campaign) return res.status(404).json({ message: 'Not found' });
if (!campaign.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized' });
await campaign.remove();
res.json({ message: 'Deleted' });
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};