var mongoose = require("mongoose");

//connecting to a database
mongoose.connect("mongodb://localhost/cat_app");

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

var Cat = mongoose.model("Cat", catSchema);



//adding new cat to the database
// var tom = new Cat({
//     name:"Mrs. Norris",
//     age:7,
//     temperament:"Evil"
// });

// tom.save(function(err, cat) {
//     if(err) {
//         console.log("something went wrong!")
//     } else {
//         console.log("we just saved a cat to the database")
//         console.log(cat);
//     }
// });

Cat.create({
    name: "Snow White",
    age: 15,
    temperament: "bland"
}, function (err, cat) {
    if (err) {
        console.log("ERROR MADE, COULD NOT SAVE CAT TO DB!");
        console.log(err);
    } else {
        console.log("CAT SAVED TO DB");
        console.log(cat);
    }
})


//retrieve all cats from database

Cat.find({}, function (err, cats) {
    if (err) {
        console.log("oh no! ERROR");
        console.log(err);
    } else {
        console.log("ALL THE CATS");
        console.log(cats);
    }
})