const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs")

const app = express();
app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  console.log(`Received event: ${event}`);

  fs.appendFileSync("logs.json", JSON.stringify(payload, null, 2) + ",\n");

  if (event === "push") {
    console.log("🔄 Push event detected.");
  }

  if (event === "pull_request") {
    const action = payload.action;
    const merged = payload.pull_request && payload.pull_request.merged;

    console.log(`PR action: ${action}, Merged: ${merged}`);
    if (action === "closed" && merged) {
      console.log("✅ Merge event detected!");
    }
  }

  res.sendStatus(200).send("✅ Event received");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
});
