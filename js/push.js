var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BKMbltUjLa5CgcmSTFdGneVLZ-cgm-KyNgRY6wD0ZSTQynNUAmbfC5-HU9szy1PakcXWk61PcBdhpi5SKOGvcbc",
    "privateKey": "4E7Gg4rXZ-phxE31z4o48t5G4Qdgo6j7_376VuHCkgA"
};


webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/eLhajIwYwdQ:APA91bGc2RDpNvV7j4_DawCwWiZUDCxmOs-ry3lVBLO2imIdyl40NxkCUdo2RmR2xEbNMbccFnm1KPILDhoSHdWgzry5FutDJDBGh_kPydawKqS8bTKI_h06PrMKtGLxE1lIEzc1v-RH",
    "keys": {
        "p256dh": "BDa7444g51yVytux+x+LrBQIpV2v5ZxpBLahzBsSdhJEM5wU6ezGKdu6QehcQH5Kc4QUyaYSuvoRI+nURj4+vxg=",
        "auth": "EtytdAPGUaajDN8IZ+w6PQ=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: '633406233114',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);