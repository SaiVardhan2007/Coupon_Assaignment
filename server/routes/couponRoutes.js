const express = require('express');
const Coupon = require('../models/Coupon');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new coupon
router.post('/api/coupons', protect, admin, async (req, res) => {
  try {
    const { code, type, expiresAt, maxUses, assignedUsers } = req.body;
    const couponData = { code, type };
    if (type === 'INDIVIDUAL') {
      couponData.expiresAt = expiresAt;
      couponData.assignedUsers = assignedUsers || [];
    } else if (type === 'GROUP') {
      couponData.maxUses = maxUses;
    }
    const coupon = new Coupon(couponData);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all coupons
router.get('/api/coupons', protect, admin, async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle coupon status
router.put('/api/coupons/:id/status', protect, admin, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    coupon.status = coupon.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign coupon to users and send email
router.post('/api/coupons/:id/assign', protect, admin, async (req, res) => {
  const { userIds } = req.body;
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    // Get User model
    const User = require('../models/User');
    const sendEmail = require('../emailSender');
    // Fetch user details
    const users = await User.find({ _id: { $in: userIds } });
    // Assign users to coupon
    userIds.forEach((userId) => {
      if (!coupon.assignedUsers.some(u => u.userId.toString() === userId)) {
        coupon.assignedUsers.push({ userId });
      }
    });
    await coupon.save();
    // Send email to each user
    for (const user of users) {
      await sendEmail({
        to: user.email,
        subject: 'You have been assigned a coupon!',
        text: `Your coupon code is: ${coupon.code}`,
        html: `<p>Your coupon code is: <b>${coupon.code}</b></p>`
      });
    }
    res.json({ message: 'Users assigned and emails sent.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Redeem coupon (user-facing)
router.post('/api/coupons/redeem', protect, async (req, res) => {
  const userId = req.user.id;
  const { couponCode } = req.body;
  try {
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon || coupon.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Coupon not found or inactive' });
    }
    if (coupon.type === 'INDIVIDUAL') {
      const assigned = coupon.assignedUsers.find(
        u => u.userId.toString() === userId
      );
      if (!assigned) {
        return res.status(403).json({ message: 'You are not assigned this coupon' });
      }
      if (assigned.status !== 'SENT') {
        return res.status(400).json({ message: `Coupon already ${assigned.status.toLowerCase()}` });
      }
      if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
        assigned.status = 'EXPIRED';
        await coupon.save();
        return res.status(400).json({ message: 'Coupon expired' });
      }
      assigned.status = 'REDEEMED';
      coupon.uses = (coupon.uses || 0) + 1;
      await coupon.save();
      return res.json({ message: 'Coupon redeemed successfully' });
    } else if (coupon.type === 'GROUP') {
      if (coupon.uses >= coupon.maxUses) {
        return res.status(400).json({ message: 'Coupon usage limit reached' });
      }
      if (coupon.redeemedBy.some(uid => uid.toString() === userId)) {
        return res.status(400).json({ message: 'You have already redeemed this coupon' });
      }
      coupon.redeemedBy.push(userId);
      coupon.uses = (coupon.uses || 0) + 1;
      await coupon.save();
      return res.json({ message: 'Coupon redeemed successfully' });
    }
    res.status(400).json({ message: 'Invalid coupon type' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
