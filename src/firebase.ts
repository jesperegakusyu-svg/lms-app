import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// ★ここもStep1のfirebaseConfigと同じ内容にする
const firebaseConfig = {
  apiKey: "AIzaSyBwYqnTXHkFC-IwTp6wBNOGi19TBnYjStU",
  authDomain: "lms-pwa-3a9f0.firebaseapp.com",
  projectId: "lms-pwa-3a9f0",
  storageBucket: "lms-pwa-3a9f0.firebasestorage.app",
  messagingSenderId: "336136905814",
  appId: "1:336136905814:web:8c89eed540bfba8de947f7",
  measurementId: "G-TXLPESM5ZF",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// 通知許可をもらい、トークン（住所）を取得する関数
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      // ★Step1で生成した「ウェブプッシュ証明書（鍵ペア）」をここに貼る
      vapidKey:
        "BCyRh6AUsUP01FUl-UO27y8LDkbEXsnf-tgQUYISQIHo4YCY8RZ5wBfE0KbSiokAitEfauyDwYoNKwvnanythNI",
    });

    if (currentToken) {
      console.log("通知トークン取得成功:", currentToken);
      return currentToken; // このトークンをDBに保存して、後でこれ宛に送る
    } else {
      console.log("通知トークンがありません。許可が必要です。");
      return null;
    }
  } catch (err) {
    console.log("通知トークン取得エラー:", err);
    return null;
  }
};

// フォアグラウンド（アプリを開いている時）の通知受信
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
