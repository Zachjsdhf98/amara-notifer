const https = require('https');

const data = JSON.stringify({
  app_id: "21e8a552-591d-4f5f-bbb8-dbd2b0e03c91",
  included_segments: ["All"],
  headings: { en: "OnlyFans إشعار" },
  contents: { en: "وصلك شيء جديد" }
});

const options = {
  hostname: "onesignal.com",
  port: 443,
  path: "/api/v1/notifications",
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic os_v2_app_ehukkuszdvhv7o5y3pjlbyb4sep6zsytqjwut3n3kk4ye3wbhliwlgev6zdru6g4mubsoz33zsy3t3okwnfpneu7ym4q4mitfdsbnfy"
  }
};

const req = https.request(options, res => {
  res.on("data", d => {
    process.stdout.write(d);
  });
});

req.on("error", error => {
  console.error(error);
});

req.write(data);
req.end();
