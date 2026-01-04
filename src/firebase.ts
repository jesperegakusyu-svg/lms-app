import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// あなたのFirebaseプロジェクトの鍵設定
const firebaseConfig = {
  apiKey: "AIzaSyBwYqnTXHkFC-IwTp6wBNOGi19TBnYjStU",
  authDomain: "lms-pwa-3a9f0.firebaseapp.com",
  projectId: "lms-pwa-3a9f0",
  storageBucket: "lms-pwa-3a9f0.firebasestorage.app",
  messagingSenderId: "336136905814",
  appId: "1:336136905814:web:8c89eed540bfba8de947f7",
  measurementId: "G-TXLPESM5ZF",
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);

// ★重要：通知機能の安全な初期化
// ブラウザ環境によってはここでエラーが出ることがあるため、
// アプリ全体が真っ白にならないように try-catch で守っています。
let messaging: any = null;

try {
  // windowオブジェクトが存在する（ブラウザである）場合のみ実行
  if (typeof window !== "undefined") {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.error("Firebase Messagingの初期化に失敗しました（このブラウザでは通知が使えない可能性があります）:", error);
  // エラーが出てもアプリ自体は動くように、messagingはnullのままにしておきます
}

export { messaging };

// --- 以下、通知用関数 ---

// 1. 通知の許可を求め、トークン（住所）を取得する関数
export const requestForToken = async () => {
  if (!messaging) {
    console.log("Messaging機能が無効なため、トークン取得をスキップします。");
    return null;
  }

  try {
    const currentToken = await getToken(messaging, {
      // あなたのウェブプッシュ証明書（鍵ペア）
      vapidKey:
        "BCyRh6AUsUP01FUl-UO27y8LDkbEXsnf-tgQUYISQIHo4YCY8RZ5wBfE0KbSiokAitEfauyDwYoNKwvnanythNI",
    });

    if (currentToken) {
      console.log("通知トークン取得成功:", currentToken);
      return currentToken;
    } else {
      console.log("通知トークンがありません。許可が必要です。");
      return null;
    }
  } catch (err) {
    console.log("通知トークン取得エラー:", err);
    return null;
  }
};

// 2. アプリを開いている時に通知を受け取る関数
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }
  });
