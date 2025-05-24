const billSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now }, // Bill timestamp
  totalAmount: { type: Number, required: true } // Final total
});

const Bill = mongoose.model("Bill", billSchema);
