importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDEk9rtGb4wIUstkoBsc_rD65orAPBAuuM",
    authDomain: "wbify-869a4.firebaseapp.com",
    projectId: "wbify-869a4",
    storageBucket: "wbify-869a4.firebasestorage.app",
    messagingSenderId: "750324593224",
    appId: "1:750324593224:web:e07543786e367d79bf1e7d"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/shopify.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
