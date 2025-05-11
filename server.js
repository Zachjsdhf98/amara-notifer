const express = require("express");
const sendNotification = require("./send");
const app = express();

app.use(express.json());

app.post("/notify", (req, res) => {
  const { title, message } = req.body;
  sendNotification(title || "تنبيه", message || "إشعار جديد من OnlyFans");
  res.send({ success: true });
});

app.listen(3030, () => {
  console.log("خادم التنبيهات يعمل على http://localhost:3030");
});