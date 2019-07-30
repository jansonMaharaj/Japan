var mongoose = require("mongoose");


var locationSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    thingsTitleOne: String,
    thingsTitleTwo: String,
    thingsTitleThree: String,
    thingsDescriptionOne: String,
    thingsDescriptionTwo: String,
    thingsDescriptionThree: String,
    thingsPicOne: String,
    thingsPicTwo: String,
    thingsPicThree: String,
 
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Location", locationSchema);

