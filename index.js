var os = require("os");
var express = require("express");
const requestIp = require("request-ip");
require("dotenv").config();
var cors = require("cors");

var app = express();

// Enable CORS so that your API is remotely testable
app.use(cors({ optionsSuccessStatus: 200 }));

// Serve static files from 'public' directory
app.use(express.static("public"));

// Main page route
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// Function to get local machine's IPv4 address
function getLocalIPv4() {
  var networkInterfaces = os.networkInterfaces();
  let localIp = null;

  // Loop through network interfaces and find the first non-internal IPv4 address
  for (let iface in networkInterfaces) {
    networkInterfaces[iface].forEach(function (details) {
      if (details.family === "IPv4" && !details.internal) {
        localIp = details.address;
      }
    });
  }

  return localIp;
}

// API endpoint to show client info and local machine's IPv4
app.get("/api/whoami", function (req, res) {
  var clientIp = requestIp.getClientIp(req);

  // Get local machine's IPv4 address
  var localIp = getLocalIPv4();

  // Return JSON with the client's IP, language, software, and the local machine's IP
  res.json({
    ipaddress: localIp,
    language: req.headers["accept-language"],
    software: req.headers["user-agent"],
  });
});

// Start the server on PORT or 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
