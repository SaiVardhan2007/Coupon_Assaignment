const mongoose = require('mongoose');
const { Schema } = mongoose;

const assignedUserSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'SENT', enum: ['SENT', 'REDEEMED', 'EXPIRED'] },
});

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['INDIVIDUAL', 'GROUP'],
    required: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
  },
  expiresAt: {
    type: Date,
  },
  maxUses: {
    type: Number,
  },
  uses: {
    type: Number,
    default: 0,
  },
  assignedUsers: [assignedUserSchema], // For INDIVIDUAL coupons
  redeemedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], // For GROUP coupons
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
