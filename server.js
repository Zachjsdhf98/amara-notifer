const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());

let authTokens = [];
let lastStates = {}; // لتخزين آخر حالة لكل مستخدم

app.post('/tokens', (req, res) => {
  const token = req.body.token;
  if (token && !authTokens.includes(token)) {
    authTokens.push(token);
    console.log('📥 Token جديد مضاف:', token);
  }
  res.json({ status: 'تم الاستلام' });
});

function sendNotification(message) {
  fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic os_v2_app_ehukktuszvdhv7o5y3pllbyb4sep0zsytqjwwt3n3kk4ye3wbhl1wqev0zdruóg4nubs0z33zsy3t3okwnfpneu7ym4q4m1tfdsbnfy"
    },
    body: JSON.stringify({
      app_id: "21e8a552-591d-4f5f-bbb8-dbd2b0e03c91",
      included_segments: ["All"],
      headings: { en: "OnlyFans إشعار" },
      contents: { en: message }
    }),
  })
    .then(res => res.json())
    .then(json => console.log('🔔 إشعار مرسل:', json))
    .catch(err => console.error('❌ خطأ عند إرسال الإشعار:', err));
}

setInterval(() => {
  authTokens.forEach(async token => {
    try {
      const res = await fetch("https://onlyfans.com/api2/v2/users/me", {
        headers: { "x-bc": token }
      });
      const data = await res.json();

      const id = data.id;
      if (!lastStates[id]) {
        lastStates[id] = {
          messages: data.new_messages,
          subscriptions: data.subscriptions?.length || 0,
          livestreams: data.livestreams?.length || 0
        };
        return;
      }

      if (data.new_messages > lastStates[id].messages) {
        sendNotification("📩 وصلك رسالة جديدة!");
      }

      if ((data.subscriptions?.length || 0) > lastStates[id].subscriptions) {
        sendNotification("👤 اشتراك جديد على حسابك!");
      }

      if ((data.livestreams?.length || 0) > lastStates[id].livestreams) {
        sendNotification("🎥 بدأ بث مباشر الآن!");
      }

      lastStates[id] = {
        messages: data.new_messages,
        subscriptions: data.subscriptions?.length || 0,
        livestreams: data.livestreams?.length || 0
      };

    } catch (err) {
      console.error('⚠️ فشل التحقق من التوكن:', err);
    }
  });
}, 5000);

app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل على المنفذ ${PORT}`);
});