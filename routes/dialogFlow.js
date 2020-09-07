var express = require("express");
var router = express.Router();

const structjson = require("structjson");
const dialogflow = require("dialogflow");
const uuid = require("uuid");
const config = require("../config/keys.js");

const mongoose = require("mongoose");
mongoose.connect(config.mongoURL, { useNewUrlParser: true });
require("../models/Registration");
const Registration = mongoose.model("registration");

// const { response } = require("express");     // i think every thing should work fine

const projectID = config.googleProjectID;

const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey,
};

const sessionClient = new dialogflow.SessionsClient({ projectID, credentials });
// const sessionPath = sessionClient.sessionPath(
//   config.googleProjectID,
//   config.dialogFlowSessionID
// );

async function saveRegistration(fields) {
  console.log("saving registrations");
  const registration = new Registration({
    name: fields.name.stringValue,
    address: fields.address.stringValue,
    phone: fields.phone.stringValue,
    email: fields.email.stringValue,
    dateSent: Date.now(),
  });
  try {
    console.table(["registering", `${registration}`]);
    let reg = await registration.save();
    console.table(["registered", `${reg}`]);
  } catch (err) {
    console.log(err);
  }
}

function handleAction(responses) {
  let queryResult = responses[0].queryResult;

  switch (queryResult.action) {
    case "recommendcourses-yes":
      if (queryResult.allRequiredParamsPresent) {
        console.log("case kicked");
        saveRegistration(queryResult.parameters.fields);
      }
      break;
  }

  console.table([
    ["responses", `${responses}`],
    [
      "queryResult.allRequiredParamsPresent",
      `${queryResult.allRequiredParamsPresent}`,
    ],
    ["queryResult.action", `${queryResult.action}`],
    ["queryResult.fulfillmentMessages", `${queryResult.fulfillmentMessages}`],
    ["queryResult.parameters.fields", `${queryResult.parameters.fields}`],
  ]);

  return responses;
}

/* GET home page. */
router.post("/api/df_text_query", async (req, res, next) => {
  const request = {
    session: sessionClient.sessionPath(
      config.googleProjectID,
      config.dialogFlowSessionID + req.body.userID
    ),
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: req.body.text,
        userID: req.body.userID,
        // The language used by the client (en-US)
        languageCode: config.dialogFlowSessionLanguageCode,
      },
    },
  };

  let responses = await sessionClient.detectIntent(request);
  responses = handleAction(responses);
  console.log("Detected text query");
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Responses: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }

  res.send(responses[0].queryResult);
});

router.post("/api/df_event_query", async (req, res, next) => {
  const request = {
    session: sessionClient.sessionPath(
      config.googleProjectID,
      config.dialogFlowSessionID + req.body.userID
    ),
    queryInput: {
      event: {
        // The query to send to the dialogflow agent
        name: req.body.event,
        parameters: structjson.jsonToStructProto(req.body.parameters),
        userID: req.body.userID,
        // The language used by the client (en-US)
        languageCode: config.dialogFlowSessionLanguageCode,
      },
    },
  };

  let responses = await sessionClient.detectIntent(request);
  responses = handleAction(responses);
  console.log("Detected event query");
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Responses: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }

  res.send(responses[0].queryResult);
});

module.exports = router;

// console.log(googleProjectId);
