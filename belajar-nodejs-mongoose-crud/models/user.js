const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    string_1: {
        type: String,
        default: "Default String",
        required: false
    },
    number_1: {
        type: Number,
        default: 36,
        required: false
    },
    boolean_1: {
        type: Boolean,
        default: true,
        required: false
    },
    enum_1: {
        type: String,
        enum: [
            'Administrator',
            'Member',
            'Guest'
        ],
        default: 'Administrator',
        required: false
    },
    date_1: {
        type: Date,
        default: Date.now,
        required: false
    },
    array_1: {
        type: [String],
        default: [
            'Satu',
            'Dua',
            'Tiga'
        ],
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);