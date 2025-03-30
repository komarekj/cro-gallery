import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  rank: {
    type: Number,
    default: null,
  },
  isShopify: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: null,
  },
  productLinks: [{
    type: String,
  }],
  lastScanned: {
    type: Date,
    default: null,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  analysis: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Check if the model exists before creating it to prevent errors in development
const Store = mongoose.models.Store || mongoose.model('Store', storeSchema);

export default Store; 