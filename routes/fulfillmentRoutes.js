var express = require("express");
var router = express.Router();
const chalk = require("chalk");

const { WebhookClient } = require("dialogflow-fulfillment");

require("../models/Demand");
const mongoose = require("mongoose");
const Demand = mongoose.model("demand");

require("../models/Coupons");
const Coupon = mongoose.model("coupon");

router.post("/", async function (req, res, next) {
  console.log(chalk.bgGreen("router for intent is working"));
  try {
    const agent = new WebhookClient({ request: req, response: res });

    function snoopyFun(agent) {
      console.log(chalk.bgBlue("internal working ok"));
      agent.add("welcome to my snoopy fulfillment");
    }

    async function learn(agent) {
      Demand.findOne({ course: agent.parameters.course }, function (
        err,
        course
      ) {
        if (course !== null) {
          course.counter++;
          course.save();
        } else {
          const demand = new Demand({ course: agent.parameters.course });
          demand.save();
        }
      });
      let responseText = `You want to learn about ${agent.parameters.course}. 
                Here is a link to all of my courses: https://www.udemy.com/user/jana-bergant`;

      let coupon = await Coupon.findOne({ course: agent.parameters.course });
      console.log(chalk.bgGray(coupon.link));
      console.log(chalk.bgGray(coupon.course));
      if (coupon !== null) {
        responseText = `You want to learn about ${agent.parameters.course}. 
          Here is a link to the course: ${coupon.link}`;
      }
      agent.add(responseText);
    }

    function fallback(agent) {
      agent.add("I didn't understand");
      agent.add("I'm sorry, can you try that again");
    }

    let intentMap = new Map();
    intentMap.set("snoopy", snoopyFun);
    intentMap.set("learn courses", learn);
    intentMap.set("Default Fallback Intent", fallback);

    agent.handleRequest(intentMap);
  } catch (err) {
    console.log(chalk.bgRed(err));
  }
});

module.exports = router;
