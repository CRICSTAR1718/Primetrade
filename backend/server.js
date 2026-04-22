import app from "./src/app.js";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB Connected");
        app.listen(5000, () => console.log("Server running"));
    })
    .catch(err => console.log(err));