const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB Connected");
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    })
    .catch(err => {
        console.error("DB Error:", err);
        process.exit(1); // optional but good practice
    });