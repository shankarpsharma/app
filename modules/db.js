var mongoose = require("mongoose");
var conn = mongoose.createConnection("mongodb://localhost:27017/master", {
  useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
if (conn) {
  console.log("monogodb connected.");
}
exports.mongoose = mongoose;
exports.conn = conn;
