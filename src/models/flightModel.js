import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
    flightNumber: {
        type: String,
        required: true,
        unique: true
    },
    aircraft: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "aircrafts",
        required: true
    },
    airline: {
        type: String,
        required: true
    },

    departureAirport: {
        type: String,
        required: true
    },
    arrivalAirport: {
        type: String,
        required: true
    },
    departureTime: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Scheduled", "Delayed", "Cancelled", "Departed", "Arrived"],
        default: "Scheduled"
    },
    price: {
        type: Number,
        required: true
    }
});

const Flight = mongoose.models.flights || mongoose.model("flights", flightSchema);
export default Flight;
