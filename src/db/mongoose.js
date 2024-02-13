const mongoose = require("mongoose");

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB... ");
    })
    .catch((e) => {
        console.log(e.message);
    });