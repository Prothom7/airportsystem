import mongoose from "mongoose";

const airportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  iataCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    minlength: 3,
    maxlength: 3
  },
  icaoCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    minlength: 4,
    maxlength: 4
  },
  timezone: {
    type: String,
    required: true
  }
});

const Airport = mongoose.models.airports || mongoose.model("airports", airportSchema);
export default Airport;