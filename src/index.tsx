import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import './style.css'; 
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// ==========================================
// 1. Firebase (通知機能) の設定エリア
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyBwYqnTXHkFC-IwTp6wBNOGi19TBnYjStU",
  authDomain: "lms-pwa-3a9f0.firebaseapp.com",
  projectId: "lms-pwa-3a9f0",
  storageBucket: "lms-pwa-3a9f0.firebasestorage.app",
  messagingSenderId: "336136905814",
  appId: "1:336136905814:web:8c89eed540bfba8de947f7",
  measurementId: "G-TXLPESM5ZF",
};

// 安全にFirebaseを初期化する
const app = initializeApp(firebaseConfig);
let messaging: any = null;

try {
  if (typeof window !== "undefined") {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.log("通知機能が無効です:", error);
}

// 通知許可＆トークン取得
const requestForToken = async () => {
  if (!messaging) return null;
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BCyRh6AUsUP01FUl-UO27y8LDkbEXsnf-tgQUYISQIHo4YCY8RZ5wBfE0KbSiokAitEfauyDwYoNKwvnanythNI",
    });
    if (currentToken) {
      console.log("Token:", currentToken);
      return currentToken;
    } else {
      console.log("No token.");
      return null;
    }
  } catch (err) {
    console.log("Token error:", err);
    return null;
  }
};

// 通知受信リスナー
const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }
  });

// ==========================================
// 2. アプリ本体のデータとロジック
// ==========================================

const GRADE_CURRICULUM: any = {
  中1: {
    数学: [{ unit: "正の数・負の数", progress: 0 }, { unit: "文字と式", progress: 0 }, { unit: "方程式", progress: 0 }, { unit: "比例・反比例", progress: 0 }, { unit: "平面図形", progress: 0 }, { unit: "空間図形", progress: 0 }, { unit: "データの活用", progress: 0 }],
    英語: [{ unit: "be動詞", progress: 0 }, { unit: "一般動詞", progress: 0 }, { unit: "現在進行形", progress: 0 }, { unit: "助動詞can", progress: 0 }, { unit: "疑問詞", progress: 0 }],
    理科: [{ unit: "植物の生活と種類", progress: 0 }, { unit: "身のまわりの物質", progress: 0 }, { unit: "光・音・力", progress: 0 }, { unit: "大地の変化", progress: 0 }]
  },
  中2: {
    数学: [{ unit: "式の計算", progress: 0 }, { unit: "連立方程式", progress: 0 }, { unit: "一次関数", progress: 0 }, { unit: "図形の性質", progress: 0 }, { unit: "確率", progress: 0 }],
    英語: [{ unit: "未来表現", progress: 0 }, { unit: "助動詞", progress: 0 }, { unit: "不定詞", progress: 0 }, { unit: "動名詞", progress: 0 }, { unit: "比較", progress: 0 }, { unit: "受け身", progress: 0 }],
    理科: [{ unit: "動物の生活", progress: 0 }, { unit: "化学変化", progress: 0 }, { unit: "電流", progress: 0 }, { unit: "気象", progress: 0 }]
  },
  中3: {
    数学: [{ unit: "展開・因数分解", progress: 0 }, { unit: "平方根", progress: 0 }, { unit: "二次方程式", progress: 0 }, { unit: "関数y=ax^2", progress: 0 }, { unit: "相似", progress: 0 }, { unit: "三平方の定理", progress: 0 }],
    英語: [{ unit: "現在完了", progress: 0 }, { unit: "分詞", progress: 0 }, { unit: "関係代名詞", progress: 0 }, { unit: "仮定法", progress: 0 }],
    理科: [{ unit: "生命の連続性", progress: 0 }, { unit: "イオン", progress: 0 }, { unit: "運動とエネルギー", progress: 0 }, { unit: "地球と宇宙", progress: 0 }]
  },
  高1: {
    数学Ⅰ: [{ unit: "数と式", progress: 0 }, { unit: "二次関数", progress: 0 }, { unit: "図形と計量", progress: 0 }, { unit: "データの分析", progress: 0 }],
    数学A: [{ unit: "場合の数と確率", progress: 0 }, { unit: "図形の性質", progress: 0 }, { unit: "整数の性質", progress: 0 }],
    英語: [{ unit: "文型・時制", progress: 0 }, { unit: "助動詞", progress: 0 }, { unit: "不定詞・動名詞", progress: 0 }, { unit: "分詞・関係詞", progress: 0 }],
    化学基礎: [{ unit: "物質の構成", progress: 0 }, { unit: "物質の変化", progress: 0 }],
    生物基礎: [{ unit: "生物と遺伝子", progress: 0 }, { unit: "生物の体内環境", progress: 0 }],
    物理基礎: [{ unit: "物体の運動", progress: 0 }, { unit: "エネルギー", progress: 0 }],
    地学基礎: [{ unit: "地球の構造", progress: 0 }, { unit: "宇宙", progress: 0 }]
  },
  高2: {
    数学Ⅱ: [{ unit: "式と証明", progress: 0 }, { unit: "複素数", progress: 0 }, { unit: "図
