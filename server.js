const fetch = require("node-fetch");

// توكنات المستخدمين
const authTokens = [
  "auth_id_1",
  "auth_id_2"
];

// إعداد OneSignal
const ONESIGNAL_APP_ID = "21e8a552-591d-4f5f-bbb8-dbd2b0e03c91";
const ONESIGNAL_API_KEY = "Basic os_v2_app_ehukkuszdvhv7o5y3pjlbyb4sep6zsytqjwut3n3kk4ye3wbhliwlgev6zdru6g4mubsoz33zsy3t3okwnfpneu7ym4q4mitfdsbnfy"; // عدّلها بالمفتاح الصحيح

// تخزين آخر حالة لتفادي التكرار
const lastState = {};

function sendNotification(title, message) {
  fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": ONESIGNAL_API_KEY
    },
    body: JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      included_segments: ["All"],
      headings: { en: title },
      contents: { en: message }
    })
  })
    .then(res => res.json())
    .then(json => console.log("إشعار:", json))
    .catch(err => console.error("خطأ في الإشعار:", err));
}

setInterval(() => {
  authTokens.forEach(auth_id => {
    const cookie = `auth_id=${auth_id}`;

    // الرسائل
    fetch("https://onlyfans.com/api2/v2/chats", {
      headers: { cookie, "user-agent": "Mozilla/5.0", accept: "application/json" }
    })
      .then(res => res.json())
      .then(data => {
        const chat = data?.list?.[0];
        const msg = chat?.last_message?.text;
        const id = chat?.id;
        if (msg && lastState[`chat_${id}`] !== msg) {
          lastState[`chat_${id}`] = msg;
          sendNotification(`رسالة من ${chat.with_user.username}`, msg);
        }
      }).catch(console.error);

    // اللايف
    fetch("https://onlyfans.com/api2/v2/users/me/subscribe/streams", {
      headers: { cookie, "user-agent": "Mozilla/5.0", accept: "application/json" }
    })
      .then(res => res.json())
      .then(data => {
        const username = data?.[0]?.username;
        if (username && !lastState[`live_${username}`]) {
          lastState[`live_${username}`] = true;
          sendNotification("بث مباشر", `${username} بدأ بثًا مباشرًا`);
        }
      }).catch(console.error);

    // الاشتراكات
    fetch("https://onlyfans.com/api2/v2/subscriptions/count", {
      headers: { cookie, "user-agent": "Mozilla/5.0", accept: "application/json" }
    })
      .then(res => res.json())
      .then(data => {
        const total = data?.subscriptions?.active;
        if (total !== lastState[`subs_${auth_id}`]) {
          lastState[`subs_${auth_id}`] = total;
          sendNotification("اشتراكات جديدة", `لديك الآن ${total} اشتراك`);
        }
      }).catch(console.error);
  });
}, 60000); // كل دقيقة