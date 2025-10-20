import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    flight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "flights",
        required: true
    },
    seatNumber: {
        type: String,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Booked", "Cancelled", "Checked-in"],
        default: "Booked"
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Refunded"],
        default: "Pending"
    }
});

bookingSchema.index({ flight: 1, seatNumber: 1 }, { unique: true });

const Booking = mongoose.models.bookings || mongoose.model("bookings", bookingSchema);
export default Booking;
