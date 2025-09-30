import mongoose from "mongoose";

const airlineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  country: { type: String, required: true },
});

const Airline = mongoose.models.airlines || mongoose.model("airlines", airlineSchema);
export default Airline;
