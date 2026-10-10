const https = require("https");
const apiKey = process.env.BREAKOUT_ADMIN_API_KEY || "RAHASIA_SUPER_KUAT";
const options = {
    hostname: 'breakoutmusicrecord.com',
    path: '/api/admin/dashboard/summary',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${apiKey}`
    }
};

const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    let data = '';
    res.on('data', d => { data += d; });
    res.on('end', () => { console.log('Response:', data); });
});

req.on('error', error => { console.error(error); });
req.end();
