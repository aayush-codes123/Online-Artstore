const SiteStats = require('../models/SiteStats');

const trackVisitor = async (req, res) => {
  try {
    let stats = await SiteStats.findOne();
    if (!stats) {
      stats = new SiteStats({ totalVisitors: 1 });
    } else {
      stats.totalVisitors += 1;
    }
    await stats.save();
    res.json({ message: 'Visitor tracked', totalVisitors: stats.totalVisitors });
  } catch (err) {
    console.error('Error tracking visitor:', err);
    res.status(500).json({ message: 'Error tracking visitor' });
  }
};

module.exports = { trackVisitor };
