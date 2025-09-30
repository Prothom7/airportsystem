import mongoose from "mongoose";

const baggageSchema = new mongoose.Schema({
    
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bookings"
    },

    weight: Number,

    dimensions: String,

    isOverweight: {
        type: Boolean,
        default: false
    }
});
