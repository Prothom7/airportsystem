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
        type: mongoose.Schema.Types.ObjectId,
        ref: "airlines",
        required: true
    },
    departureAirport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "airports",
        required: true
    },
    arrivalAirport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "airports",
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
