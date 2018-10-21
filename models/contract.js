const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ContractSchema = new Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  yearlyPrice: { type: Number, required: true },
  content: String,
  cancelled: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = {
  Contract: mongoose.model('Contract', ContractSchema),
};
