if ((process.env.NODE_ENV || "").trim() === "production") {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
