// models/RecurringPayment.js

import mongoose from "mongoose";
const RecurringPaymentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  purpose: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'utensils', 'food', 'subscription', 'entertainment', 'groceries',
      'education', 'healthcare', 'transportation', 'utilities', 'other'
    ],
    required: true
  },
  platform: {
    type: String,
    enum: [
      'netflix', 'amazon', 'aws', 'spotify', 'hulu', 'google-cloud', 
      'apple-music', 'microsoft-365', 'disney-plus', 'dropbox', 'zoom'
    ],
    required: true
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  submitDate: { type: Date, default: Date.now }
});


const RequiringPayment = mongoose.model('RecurringPayment', RecurringPaymentSchema);
export default RequiringPayment;
