const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { get } = require("request");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public")); // To use the all local file we need to put this and drag all the file in a single public folder

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      // This members are from the mailchimp
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName, // Here LNAME and FNAME is from MailChimp API
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us18.api.mailchimp.com/3.0/lists/3eebd4449f";
  const options = {
    method: "POST",
    auth: "pruthviraj:6b49395729f801c6b0207a309f98f2dc-us18", // This API Key
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      // This response is for succes and failure of site load
      res.sendFile(__dirname + "/sucess.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

// Here process.env.PORT will be for the deployed and 8000 for our local
app.listen(process.env.PORT || 8000, function () {
  console.log("Server is running on Port: 8000");
});

// APIkey
// 6b49395729f801c6b0207a309f98f2dc-us18

//Audiance ID
// 3eebd4449f
