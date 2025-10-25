import mongoose from "mongoose";

const taxiSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true, // link booking to a registered user
    },

    pickupLocation: {
      type: String,
      required: [true, "Please provide a pickup location"],
    },

    dropoffLocation: {
      type: String,
      required: [true, "Please provide a dropoff location"],
    },

    pickupTime: {
      type: Date,
      required: [true, "Please provide a pickup time"],
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },

    price: {
      type: Number,
      required: [true, "Please provide a price for the booking"],
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true, collection: "taxis" } 
);

const Taxi = mongoose.models.Taxi || mongoose.model("Taxi", taxiSchema);

export default Taxi;
