var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NewsSchema = new Schema({
    // title is a required string
    title: {
        type: String,
        required: true,
        unique : true
    },
    // link is a required string
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    imgSrc: {
        type: String
     },
    // This only saves one note's ObjectId, ref refers to the Note model
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }]

});

var News = mongoose.model("News", NewsSchema);

module.exports = News;
