const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        required: false
    }],
    path: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("File", fileSchema);