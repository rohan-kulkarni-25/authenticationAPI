const mongoose = require("mongoose");

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log(`DB Connection Successfully :)`))
    .catch((error) => {
      console.log(`DB Connection Failed :(`);
      console.log(error);
      process.exit(1);
    });
};
