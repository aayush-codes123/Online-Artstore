const User = require('../models/User');
const Artwork = require('../models/Artwork');
const Order = require('../models/Order');

exports.getDashboardStats = async (req, res) => {
  try {
    // Total counts
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalArtworks = await Artwork.countDocuments();
    const totalSales = await Order.countDocuments({ paymentStatus: 'Paid' });

    // Total revenue
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Top buyer
    const topBuyerResult = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: '$buyer', totalPurchases: { $sum: 1 }, totalSpent: { $sum: '$amount' } } },
      { $sort: { totalPurchases: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'buyerInfo'
        }
      },
      { $unwind: '$buyerInfo' }
    ]);

    const topBuyer = topBuyerResult.length > 0 ? {
      name: topBuyerResult[0].buyerInfo.fullName,
      purchases: topBuyerResult[0].totalPurchases,
      totalSpent: topBuyerResult[0].totalSpent
    } : null;

    // Sales by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const salesByMonth = await Order.aggregate([
      { $match: { paymentStatus: 'Paid', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format sales by month for frontend
    const formattedSalesByMonth = salesByMonth.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      sales: item.count,
      revenue: item.revenue
    }));

    // Artworks by category
    const artworksByCategory = await Artwork.aggregate([
      { $group: { _id: '$label', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const formattedArtworksByCategory = artworksByCategory.map(item => ({
      category: item._id || 'Uncategorized',
      count: item.count
    }));

    // Top 5 selling artworks
    const topSellingArtworks = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: '$artwork', salesCount: { $sum: 1 } } },
      { $sort: { salesCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'artworks',
          localField: '_id',
          foreignField: '_id',
          as: 'artworkInfo'
        }
      },
      { $unwind: '$artworkInfo' }
    ]);

    const formattedTopArtworks = topSellingArtworks.map(item => ({
      title: item.artworkInfo.title,
      sales: item.salesCount
    }));

    // Total visitors
    const siteStats = await require('../models/SiteStats').findOne();
    const totalVisitors = siteStats ? siteStats.totalVisitors : 0;

    // Most viewed artworks
    const mostViewedArtworks = await Artwork.find({}).sort({ views: -1 }).limit(5).select('title views imageUrl');

    // Send response
    res.json({
      totalSellers,
      totalBuyers,
      totalArtworks,
      totalSales,
      totalRevenue,
      totalVisitors,
      topBuyer,
      salesByMonth: formattedSalesByMonth,
      artworksByCategory: formattedArtworksByCategory,
      topSellingArtworks: formattedTopArtworks,
      mostViewedArtworks
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics', error: error.message });
  }
};

exports.getPendingArtworks = async (req, res) => {
  try {
    // Find artworks where status is Pending OR the field doesn't exist (for older records)
    const artworks = await Artwork.find({
      $or: [
        { verificationStatus: 'Pending' },
        { verificationStatus: { $exists: false } }
      ]
    }).populate('seller', 'fullName email');
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending artworks' });
  }
};

exports.verifyArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved' or 'Rejected'

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const artwork = await Artwork.findByIdAndUpdate(id, { verificationStatus: status }, { new: true });
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    res.json({ message: `Artwork ${status}`, artwork });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying artwork' });
  }
};

// Get all sellers/artists with their artwork count
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).select('-password');

    // Get artwork count for each seller
    const sellersWithArtworks = await Promise.all(
      sellers.map(async (seller) => {
        const artworks = await Artwork.find({ seller: seller._id });
        return {
          ...seller.toObject(),
          artworkCount: artworks.length,
          artworks: artworks
        };
      })
    );

    res.json(sellersWithArtworks);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ message: 'Error fetching sellers' });
  }
};

// Delete a seller and all their artworks
exports.deleteSeller = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete all artworks by this seller
    await Artwork.deleteMany({ seller: id });

    // Delete the seller
    const seller = await User.findByIdAndDelete(id);

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json({ message: 'Seller and their artworks deleted successfully' });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ message: 'Error deleting seller' });
  }
};
