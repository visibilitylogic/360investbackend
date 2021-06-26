require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "code-idea",
  api_key: "458473971757311",
  api_secret: "XX59QDQsQOb5w-pEK5671r6w9aQ",
});

module.exports = { cloudinary };
