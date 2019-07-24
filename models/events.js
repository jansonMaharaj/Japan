var mongoose = require("mongoose");


var eventSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    imageCity: String,
    descriptionCity: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Event", eventSchema);

// save campground to db
// Campground.create({
//         name: "City 22",
//         image: " ",
//         imageCity: "",
//         description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
//         descriptionCity: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
//     },
//     function (err, campground) {
//         if (err) {
//             console.log("some error was made when creating a new campground");
//             console.log(err);
//         } else {
//             console.log("campground has benn saved to db");
//             console.log(campground);
//         }
//     })