const express = require("express");
const path = require("path");
const router = express.Router()
const webpush = require("web-push");
const config = require('../config');


const dummyDb = { subscription: null }; //dummy in memory store

/* web push */
const vapidKeys = {
  publicKey:
    "BLHxWiNVmr7ROB8O3KpPRJFAMhMypwe4X9TdWMmhsPSzHszo32PDkndpvWx3H0OY2HwFCQRU98JBpZ_AEsVxWG4",
  privateKey: "VXcSZD3mdKyXEmDZNrB02WTxgUZmdIpAEo5tnXR4OH4"
};

webpush.setVapidDetails(
  `mailto:${config.mail}`,
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const sendNotification = (subscription, dataToSend = "") => {
  webpush.sendNotification(subscription, dataToSend);
};



const saveToDatabase = async subscription => {
  dummyDb.subscription = subscription;
};
router.post("/save-subscription", async (req, res) => {
  const subscription = req.body;
  console.log(subscription);
  await saveToDatabase(subscription); //Method to save the subscription to Database
  res.json({ message: "success" });
});

router.get("/send-notification", (req, res) => {
  const subscription = dummyDb.subscription; //get subscription from your databse here.
  const message = "Hello World from server";
  sendNotification(subscription, message);
  res.json({ message: "message sent" });
});

module.exports = router;
