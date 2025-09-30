import mongoose from "mongoose";

const aircraftSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    airline: {
        type: String, // or a reference if you have an Airline model
        required: true
    },
    inService: {
        type: Boolean,
        default: true
    }
});

const Aircraft = mongoose.models.aircrafts || mongoose.model("aircrafts", aircraftSchema);
export default Aircraft;
