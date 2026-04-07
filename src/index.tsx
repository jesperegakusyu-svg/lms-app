import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom/client';
import './style.css'; 
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore"; 

// ==========================================
// 1. Firebase の設定エリア
// ==========================================
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "lms-pwa-3a9f0.firebaseapp.com",
  projectId: "lms-pwa-3a9f0",
  storageBucket: "lms-pwa-3a9f0.firebasestorage.app",
  messagingSenderId: "336136905814",
  appId: "1:336136905814:web:8c89eed540bfba8de947f7",
  measurementId: "G-TXLPESM5ZF",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// 2. カリキュラムデータ定義
// ==========================================
const GRADE_CURRICULUM: any = {
  中1: { 数学: [{ unit: "正の数・負の数", progress: 0 }, { unit: "文字と式", progress: 0 }, { unit: "方程式", progress: 0 }, { unit: "比例・反比例", progress: 0 }, { unit: "平面図形", progress: 0 }, { unit: "空間図形", progress: 0 }, { unit: "データの活用", progress: 0 }], 英語: [{ unit: "be動詞", progress: 0 }, { unit: "一般動詞", progress: 0 }, { unit: "現在進行形", progress: 0 }, { unit: "助動詞can", progress: 0 }, { unit: "疑問詞", progress: 0 }], 理科: [{ unit: "植物の生活と種類", progress: 0 }, { unit: "身のまわりの物質", progress: 0 }, { unit: "光・音・力", progress: 0 }, { unit: "大地の変化", progress: 0 }], 社会: [{ unit: "地理：世界の姿", progress: 0 }, { unit: "歴史：古代", progress: 0 }], 国語: [{ unit: "現代文", progress: 0 }, { unit: "古文", progress: 0 }] },
  中2: { 数学: [{ unit: "式の計算", progress: 0 }, { unit: "連立方程式", progress: 0 }, { unit: "一次関数", progress: 0 }, { unit: "図形の性質", progress: 0 }, { unit: "確率", progress: 0 }], 英語: [{ unit: "未来表現", progress: 0 }, { unit: "助動詞", progress: 0 }, { unit: "不定詞", progress: 0 }, { unit: "動名詞", progress: 0 }, { unit: "比較", progress: 0 }, { unit: "受け身", progress: 0 }], 理科: [{ unit: "動物の生活", progress: 0 }, { unit: "化学変化", progress: 0 }, { unit: "電流", progress: 0 }, { unit: "気象", progress: 0 }], 社会: [{ unit: "地理：日本の地域", progress: 0 }, { unit: "歴史：近世", progress: 0 }], 国語: [{ unit: "現代文", progress: 0 }, { unit: "漢文", progress: 0 }] },
  中3: { 数学: [{ unit: "展開・因数分解", progress: 0 }, { unit: "平方根", progress: 0 }, { unit: "二次方程式", progress: 0 }, { unit: "関数y=ax^2", progress: 0 }, { unit: "相似", progress: 0 }, { unit: "三平方の定理", progress: 0 }], 英語: [{ unit: "現在完了", progress: 0 }, { unit: "分詞", progress: 0 }, { unit: "関係代名詞", progress: 0 }, { unit: "仮定法", progress: 0 }], 理科: [{ unit: "生命の連続性", progress: 0 }, { unit: "イオン", progress: 0 }, { unit: "運動とエネルギー", progress: 0 }, { unit: "地球と宇宙", progress: 0 }], 社会: [{ unit: "公民：現代社会", progress: 0 }, { unit: "歴史：近現代", progress: 0 }], 国語: [{ unit: "現代文", progress: 0 }, { unit: "古文・漢文", progress: 0 }] },
  高1: { 数学Ⅰ: [{ unit: "数と式", progress: 0 }, { unit: "二次関数", progress: 0 }, { unit: "図形と計量", progress: 0 }, { unit: "データの分析", progress: 0 }], 数学A: [{ unit: "場合の数と確率", progress: 0 }, { unit: "図形の性質", progress: 0 }, { unit: "整数の性質", progress: 0 }], 英語: [{ unit: "文型・時制", progress: 0 }, { unit: "助動詞", progress: 0 }, { unit: "不定詞・動名詞", progress: 0 }, { unit: "分詞・関係詞", progress: 0 }], 化学基礎: [{ unit: "物質の構成", progress: 0 }, { unit: "物質の変化", progress: 0 }], 生物基礎: [{ unit: "生物と遺伝子", progress: 0 }, { unit: "生物の体内環境", progress: 0 }], 物理基礎: [{ unit: "物体の運動", progress: 0 }, { unit: "エネルギー", progress: 0 }], 地学基礎: [{ unit: "地球の構造", progress: 0 }, { unit: "宇宙", progress: 0 }] },
  高2: { 数学Ⅱ: [{ unit: "式と証明", progress: 0 }, { unit: "複素数", progress: 0 }, { unit: "図形と方程式", progress: 0 }, { unit: "三角関数", progress: 0 }, { unit: "指数・対数", progress: 0 }, { unit: "微積分", progress: 0 }], 数学B: [{ unit: "数列", progress: 0 }, { unit: "統計", progress: 0 }], 英語: [{ unit: "比較・仮定法", progress: 0 }, { unit: "否定・倒置", progress: 0 }], 物理: [{ unit: "力学", progress: 0 }, { unit: "電磁気", progress: 0 }], 化学: [{ unit: "物質の状態", progress: 0 }, { unit: "無機物質", progress: 0 }, { unit: "有機化合物", progress: 0 }], 生物: [{ unit: "細胞と分子", progress: 0 }, { unit: "代謝", progress: 0 }, { unit: "遺伝", progress: 0 }], 地学: [{ unit: "地球内部", progress: 0 }, { unit: "地層", progress: 0 }] },
  高3: { 数学Ⅲ: [{ unit: "極限", progress: 0 }, { unit: "微積分", progress: 0 }], 数学C: [{ unit: "ベクトル", progress: 0 }, { unit: "複素数平面", progress: 0 }], 英語: [{ unit: "長文読解", progress: 0 }, { unit: "英作文", progress: 0 }], 物理: [{ unit: "原子", progress: 0 }], 化学: [{ unit: "高分子", progress: 0 }], 生物: [{ unit: "生態系", progress: 0 }, { unit: "進化", progress: 0 }], 地学: [{ unit: "宇宙の構造", progress: 0 }] }
};

// ==========================================
// 3. アプリケーション本体
// ==========================================
function App() {
  const [students, setStudents] = useState<any>({});
  const [teachers, setTeachers] = useState<any>({}); 
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<"student" | "parent" | "teacher">("student");
  const [inputId, setInputId] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetId, setResetId] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [currentView, setCurrentView] = useState<"calendar" | "progress" | "test" | "mock" | "homework" | "materials">("calendar");

  const [isFirstLoginSetup, setIsFirstLoginSetup] = useState(false);
  const [setupData, setSetupData] = useState({ newPass: "", parentPass: "", lastName: "", firstName: "", email: "", gender: "未回答", address: "", schoolPref: "", schoolName: "", schoolGrade: "" });
  const [isTeacherSetup, setIsTeacherSetup] = useState(false);
  const [setupTeacherId, setSetupTeacherId] = useState("");
  const [teacherSetupPass, setTeacherSetupPass] = useState("");
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());
  const [matTitle, setMatTitle] = useState("");
  const [matUrl, setMatUrl] = useState("");
  const [testTitle, setTestTitle] = useState("");
  const [graphSubject, setGraphSubject] = useState("数学");
  const [adminTab, setAdminTab] = useState<"students" | "teachers">("students");
  const [newTeacherId, setNewTeacherId] = useState("");
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherPass, setNewTeacherPass] = useState("");
  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("中1");
  const [newStudentSubjects, setNewStudentSubjects] = useState<string[]>([]);
  const [isEditingSubjects, setIsEditingSubjects] = useState(false);
  const [calendarSubView, setCalendarSubView] = useState<"chat" | "parentChat" | "report">("chat");
  const [chatInput, setChatInput] = useState("");
  const [publicReport, setPublicReport] = useState("");
  const [internalReport, setInternalReport] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [studyStartTime, setStudyStartTime] = useState<number | null>(null);

  // ====================================================
  // クラウド同期 & 既読管理
  // ====================================================
  useEffect(() => {
    const docRef = doc(db, "lms_system", "main_data");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        setStudents(d.students || {});
        setTeachers(d.teachers || {}); 
      }
      setIsDataLoaded(true);
    });
    return () => unsubscribe(); 
  }, []);

  const updateStudentsData = async (newStudents: any) => {
    setStudents(newStudents);
    await setDoc(doc(db, "lms_system", "main_data"), { students: newStudents }, { merge: true });
  };

  const updateTeachersData = async (newTeachers: any) => {
    setTeachers(newTeachers);
    await setDoc(doc(db, "lms_system", "main_data"), { teachers: newTeachers }, { merge: true });
  };

  // ★ 既読時間を更新する関数
  const markAsRead = (type: "chat" | "parentChat" | "report") => {
    if (!currentStudentId || role === "teacher") return; // 先生側の未読管理は今回は生徒単位なのでシンプル化
    const updated = { ...students };
    if (!updated[currentStudentId].lastRead) updated[currentStudentId].lastRead = {};
    updated[currentStudentId].lastRead[type] = Date.now();
    updateStudentsData(updated);
  };

  // チャットを開いたら既読にする
  useEffect(() => {
    if (currentView === "calendar") {
      if (calendarSubView === "chat") markAsRead("chat");
      if (calendarSubView === "parentChat") markAsRead("parentChat");
      if (calendarSubView === "report") markAsRead("report");
    }
  }, [currentView, calendarSubView]);

  // ★ 宿題忘れチェック（5日後）
  const checkHomeworkDeadline = () => {
    if (!currentStudent || !currentStudent.reports) return false;
    // 最新の授業報告日を取得
    const lastReport = [...currentStudent.reports].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    if (!lastReport) return false;

    const reportTime = new Date(lastReport.date).getTime();
    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    // 授業から5日経過しているか
    if (now - reportTime > fiveDaysInMs) {
      // その授業日以降に宿題が提出されているか
      const hasNewHomework = currentStudent.homeworks?.some((h:any) => new Date(h.date).getTime() >= reportTime);
      return !hasNewHomework;
    }
    return false;
  };

  // ====================================================
  // 各種ハンドラ
  // ====================================================
  const handleLogin = () => {
    if (role === "student" || role === "parent") {
      const s = students[inputId];
      if (s) {
        const isPassCorrect = role === "student" ? s.password === inputPass : s.parentPassword === inputPass;
        if (isPassCorrect) {
          setCurrentStudentId(inputId);
          if (role === "student" && s.isFirstLogin) {
            setSetupData({ ...setupData, schoolGrade: s.grade });
            setIsFirstLoginSetup(true);
          } else {
            setSubject(Object.keys(s.subjects)[0] || "");
            setCalendarSubView(role === "parent" ? "parentChat" : "chat");
            setLoggedIn(true);
          }
        } else alert("パスワードが違います");
      } else alert("IDが見つかりません");
    } else {
      if (inputId === "1250001" && inputPass === "katagiriT") { setLoggedIn(true); setCurrentStudentId(null); }
      else {
        const t = teachers[inputId];
        if (t && t.password === inputPass) {
          if (t.isFirstLogin) { setSetupTeacherId(inputId); setIsTeacherSetup(true); }
          else { setLoggedIn(true); setCurrentStudentId(null); }
        } else alert("ログイン失敗");
      }
    }
  };

  const handleFirstLoginSetup = () => {
    const { newPass, parentPass, lastName, firstName, email, gender, address, schoolPref, schoolName, schoolGrade } = setupData;
    if (!newPass || !parentPass || !lastName || !firstName || !email || !address || !schoolName) return alert("必須項目を入力してください");
    const updated = { ...students };
    const s = updated[currentStudentId!];
    s.password = newPass; s.parentPassword = parentPass; s.name = `${lastName} ${firstName}`; 
    s.profile = { lastName, firstName, email, gender, address, schoolPref, schoolName, schoolGrade };
    s.isFirstLogin = false; 
    updateStudentsData(updated); 
    setIsFirstLoginSetup(false); setLoggedIn(true); setSubject(Object.keys(s.subjects)[0] || "");
  };

  const createStudent = () => {
    const name = (document.getElementById("nName") as HTMLInputElement).value;
    const pass = (document.getElementById("nPass") as HTMLInputElement).value;
    if (!name || !pass || newStudentSubjects.length === 0) return alert("入力不足です");
    const selectedSubjectsData: any = {};
    newStudentSubjects.forEach(subj => { selectedSubjectsData[subj] = JSON.parse(JSON.stringify(GRADE_CURRICULUM[newStudentGrade][subj])); });
    const newStudent = { name, password: pass, parentPassword: "p" + pass, grade: newStudentGrade, subjects: selectedSubjectsData, isFirstLogin: true, tests: [], records: [], homeworks: [], materials: [], messages: [], parentMessages: [], reports: [], studySessions: [], lastRead: {} };
    updateStudentsData({ ...students, [newStudentId]: newStudent }); 
    alert(`ID: ${newStudentId} 登録完了`);
  };

  const createTeacher = () => {
    if (!newTeacherName || !newTeacherPass) return alert("入力不足です");
    updateTeachersData({ ...teachers, [newTeacherId]: { name: newTeacherName, password: newTeacherPass, isFirstLogin: true, role: "teacher" } });
    alert(`講師ID: ${newTeacherId} 登録しました`);
  };

  const sendMessage = () => {
    if (!currentStudentId || !chatInput.trim()) return;
    const updated = { ...students };
    const now = new Date();
    const timeString = `${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMessage = { sender: role, text: chatInput, timestamp: timeString, createdAt: Date.now() };
    if (calendarSubView === "parentChat") {
      if (!updated[currentStudentId].parentMessages) updated[currentStudentId].parentMessages = [];
      updated[currentStudentId].parentMessages.push(newMessage);
    } else {
      if (!updated[currentStudentId].messages) updated[currentStudentId].messages = [];
      updated[currentStudentId].messages.push(newMessage);
    }
    updateStudentsData(updated); setChatInput("");
  };

  const getTodayStudyTime = () => {
    if (!currentStudent || !currentStudent.studySessions) return 0;
    const today = new Date().toLocaleDateString();
    return currentStudent.studySessions.filter((s:any) => s.date === today).reduce((acc:number, curr:any) => acc + curr.minutes, 0);
  };

  // ★ バッジ判定ロジック
  const hasUnread = (type: "chat" | "parentChat" | "report") => {
    if (!currentStudent || role === "teacher") return false;
    const lastRead = currentStudent.lastRead?.[type] || 0;
    if (type === "chat") return (currentStudent.messages || []).some((m:any) => m.sender === "teacher" && m.createdAt > lastRead);
    if (type === "parentChat") return (currentStudent.parentMessages || []).some((m:any) => m.sender === "teacher" && m.createdAt > lastRead);
    if (type === "report") return (currentStudent.reports || []).some((r:any) => r.public && new Date(r.date).getTime() > lastRead);
    return false;
  };

  if (!isDataLoaded) return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-slate-400 font-bold">Loading Database...</div>;

  const currentStudent = currentStudentId ? students[currentStudentId] : null;
  const isHomeworkOverdue = checkHomeworkDeadline();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-20">
      
      {/* 宿題忘れアラート (生徒・保護者用) */}
      {loggedIn && role !== "teacher" && isHomeworkOverdue && (
        <div className="bg-rose-500 text-white p-3 text-center text-xs font-black animate-bounce">
          ⚠️ 授業から5日が経過しています。宿題を提出しましょう！
        </div>
      )}

      {/* モーダル類 (初回設定など) */}
      {isFirstLoginSetup && (
        <div className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-black text-center mb-2">👋 プロフィール設定</h2>
            <div className="space-y-4 mt-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100"><label className="text-[10px] font-black text-blue-500 block mb-1">生徒用PW</label><input className="w-full bg-white p-2 rounded-xl font-bold border border-blue-200" type="password" value={setupData.newPass} onChange={e => setSetupData({...setupData, newPass: e.target.value})} /></div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100"><label className="text-[10px] font-black text-emerald-600 block mb-1">保護者用PW</label><input className="w-full bg-white p-2 rounded-xl font-bold border border-emerald-200" type="password" value={setupData.parentPass} onChange={e => setSetupData({...setupData, parentPass: e.target.value})} /></div>
              </div>
              <div><label className="text-[10px] font-black text-slate-400 ml-2">Email (保護者連絡用)</label><input className="w-full bg-slate-100 p-3 rounded-xl font-bold" type="email" value={setupData.email} onChange={e => setSetupData({...setupData, email: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="姓" value={setupData.lastName} onChange={e => setSetupData({...setupData, lastName: e.target.value})} />
                <input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="名" value={setupData.firstName} onChange={e => setSetupData({...setupData, firstName: e.target.value})} />
              </div>
              <input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="住所" value={setupData.address} onChange={e => setSetupData({...setupData, address: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="学校名" value={setupData.schoolName} onChange={e => setSetupData({...setupData, schoolName: e.target.value})} />
                <input className="w-full bg-slate-100 p-3 rounded-xl font-bold" placeholder="学年" value={setupData.schoolGrade} onChange={e => setSetupData({...setupData, schoolGrade: e.target.value})} />
              </div>
              <button onClick={handleFirstLoginSetup} className="w-full py-4 mt-6 bg-slate-800 text-white rounded-2xl font-black shadow-lg">登録してスタート！</button>
            </div>
          </div>
        </div>
      )}

      {/* ログイン画面 */}
      {!loggedIn ? (
        <div className={`fixed inset-0 flex items-center justify-center ${role === "student" ? "bg-blue-50" : role === "parent" ? "bg-emerald-50" : "bg-rose-50"}`}>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-sm">
            <h1 className="text-3xl font-black text-center mb-8 italic tracking-tighter">LMS <span className={role === "student" ? "text-blue-500" : role === "parent" ? "text-emerald-500" : "text-rose-500"}>V20</span></h1>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 text-[10px] font-black">
              <button onClick={() => setRole("student")} className={`flex-1 py-3 rounded-xl ${role === "student" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>生徒</button>
              <button onClick={() => setRole("parent")} className={`flex-1 py-3 rounded-xl ${role === "parent" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}>保護者</button>
              <button onClick={() => setRole("teacher")} className={`flex-1 py-3 rounded-xl ${role === "teacher" ? "bg-white text-rose-600 shadow-sm" : "text-slate-400"}`}>講師</button>
            </div>
            <input className="w-full p-4 mb-4 bg-slate-50 rounded-2xl outline-none font-bold" placeholder="ID" value={inputId} onChange={(e) => setInputId(e.target.value)} />
            <input className="w-full p-4 mb-6 bg-slate-50 rounded-2xl outline-none font-bold" type="password" placeholder="PASS" value={inputPass} onChange={(e) => setInputPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            <button onClick={handleLogin} className={`w-full py-4 rounded-2xl font-black text-white shadow-lg ${role === "student" ? "bg-blue-600" : role === "parent" ? "bg-emerald-600" : "bg-rose-600"}`}>LOGIN</button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-4 md:p-10">
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic text-slate-300 tracking-tighter uppercase">{role} DASHBOARD</h2>
            <button onClick={() => setLoggedIn(false)} className="px-6 py-2 text-xs font-bold text-slate-400 bg-white border border-slate-200 rounded-xl">LOGOUT</button>
          </header>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* 左カラム */}
            <div className="lg:col-span-4 space-y-6">
              {role === "teacher" ? (
                <>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 font-black text-xs">
                    <button onClick={() => setAdminTab("students")} className={`flex-1 py-3 rounded-xl ${adminTab === "students" ? "bg-white shadow-sm" : "text-slate-400"}`}>👥 生徒管理</button>
                    <button onClick={() => setAdminTab("teachers")} className={`flex-1 py-3 rounded-xl ${adminTab === "teachers" ? "bg-white shadow-sm" : "text-slate-400"}`}>👔 講師管理</button>
                  </div>
                  {adminTab === "students" ? (
                    <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scroll">
                      {Object.entries(students).map(([id, s]: any) => (
                        <button key={id} onClick={() => { setCurrentStudentId(id); setSubject(Object.keys(s.subjects)[0] || ""); }} className={`w-full text-left p-5 rounded-[1.8rem] border transition-all ${currentStudentId === id ? "bg-white border-rose-400 shadow-xl ring-4 ring-rose-50" : "bg-white opacity-70"}`}>
                          <p className="text-[10px] font-black text-slate-300">#{id}</p><p className="font-black text-slate-800 text-lg">{s.name}</p>
                        </button>
                      ))}
                      <div className="p-6 bg-slate-800 rounded-[2rem] text-white mt-4">
                         <h4 className="text-xs font-black mb-4">＋ 新規生徒登録</h4>
                         <input id="nName" placeholder="生徒名" className="w-full p-3 mb-2 bg-slate-700 rounded-xl text-sm outline-none" />
                         <input id="nPass" placeholder="初期PW" className="w-full p-3 mb-4 bg-slate-700 rounded-xl text-sm outline-none" />
                         <button onClick={createStudent} className="w-full py-3 bg-rose-500 rounded-xl font-black text-xs">生徒を作成</button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(teachers).map(([id, t]: any) => (
                        <div key={id} className="p-5 bg-white rounded-2xl border flex justify-between items-center"><p className="font-black">{t.name}</p><span className="text-[9px] bg-slate-100 px-2 py-1 rounded">{id}</span></div>
                      ))}
                      <div className="p-6 bg-indigo-900 rounded-[2rem] text-white">
                         <input placeholder="講師名" value={newTeacherName} onChange={e => setNewTeacherName(e.target.value)} className="w-full p-3 mb-2 bg-indigo-800 rounded-xl text-sm outline-none" />
                         <input placeholder="初期PW" value={newTeacherPass} onChange={e => setNewTeacherPass(e.target.value)} className="w-full p-3 mb-4 bg-indigo-800 rounded-xl text-sm outline-none" />
                         <button onClick={createTeacher} className="w-full py-3 bg-indigo-500 rounded-xl font-black text-xs">講師を登録</button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className={`p-10 bg-gradient-to-br ${role === "parent" ? "from-emerald-500 to-teal-700" : "from-blue-600 to-indigo-700"} rounded-[2.5rem] text-white shadow-xl relative overflow-hidden`}>
                  <p className="text-[10px] font-black bg-white/20 px-4 py-1.5 rounded-full inline-block uppercase">{currentStudent!.grade}</p>
                  <h2 className="text-3xl font-black mt-4 mb-2">{currentStudent!.name} {role === "parent" && "様"}</h2>
                  <div className="bg-white/10 p-4 rounded-xl mb-6 text-center">
                    <p className="text-xs font-bold text-white/80 mb-2">本日の学習: <span className="text-xl text-white">{getTodayStudyTime()}</span> 分</p>
                    {role === "student" && (!studyStartTime ? <button onClick={startStudy} className="w-full py-3 bg-emerald-500 rounded-xl font-black text-xs">▶️ 勉強スタート</button> : <button onClick={() => { if(window.confirm("学習を終了して記録しますか？")) endStudy(); }} className="w-full py-3 bg-rose-500 rounded-xl font-black text-xs animate-pulse">⏹️ 勉強おわり</button>)}
                  </div>
                  {currentStudent.meetingUrl && <a href={currentStudent.meetingUrl} target="_blank" rel="noreferrer" className="block w-full py-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-black text-center text-xs mb-4">🎥 授業URLを開く</a>}
                  {role === "student" && <label className="flex items-center justify-center gap-2 w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs cursor-pointer">📸 宿題を提出<input type="file" accept="image/*" className="hidden" onChange={handleHomeworkUpload} /></label>}
                  {isHomeworkOverdue && <div className="mt-4 p-3 bg-rose-600/50 rounded-xl text-[10px] font-bold border border-rose-400">🚨 宿題の提出期限（5日）を過ぎています</div>}
                </div>
              )}
            </div>

            {/* 右カラム */}
            <div className="lg:col-span-8">
              {currentStudent ? (
                <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sm min-h-[600px] border border-slate-100 flex flex-col">
                  
                  <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit relative">
                    {[{ k: "calendar", l: "📅 CALENDAR & CHAT" }, { k: "progress", l: "📊 PROGRESS" }, { k: "test", l: "📝 TESTS" }, { k: "homework", l: "🏠 HOMEWORK" }].map((tab) => (
                      <button key={tab.k} onClick={() => setCurrentView(tab.k as any)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all relative ${currentView === tab.k ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}>
                        {tab.l}
                        {/* カレンダータブに未読バッジを集約 */}
                        {tab.k === "calendar" && (hasUnread("chat") || hasUnread("parentChat") || hasUnread("report")) && <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>}
                      </button>
                    ))}
                  </div>

                  {currentView === "calendar" && (
                    <div className="grid md:grid-cols-2 gap-10 flex-1 overflow-hidden">
                      <div className="shrink-0">
                        <div className="flex justify-between items-center mb-6"><h3 className="font-black text-xl">{viewDate.getFullYear()}.{viewDate.getMonth()+1}</h3><div className="flex gap-2"><button onClick={()=>setViewDate(new Date(viewDate.setMonth(viewDate.getMonth()-1)))} className="p-2 bg-slate-50 rounded-lg text-xs">◀</button><button onClick={()=>setViewDate(new Date(viewDate.setMonth(viewDate.getMonth()+1)))} className="p-2 bg-slate-50 rounded-lg text-xs">▶</button></div></div>
                        <div className="grid grid-cols-7 gap-2">
                          {getCalendarDays().map((date, i) => {
                             const hasReport = date && currentStudent.reports?.some((r: any) => r.date === date);
                             return <button key={i} disabled={!date} onClick={() => date && setSelectedDate(date)} className={`aspect-square rounded-2xl text-xs font-bold relative ${selectedDate === date ? "bg-slate-800 text-white shadow-lg" : "bg-slate-50 text-slate-600"} ${!date && "invisible"}`}>{date ? date.split("/")[2] : ""}{hasReport && <span className="w-1.5 h-1.5 rounded-full absolute bottom-2 bg-rose-400" />}</button>;
                          })}
                        </div>
                      </div>
                      <div className="flex flex-col h-[500px] border border-slate-100 rounded-[2rem] overflow-hidden bg-slate-50">
                        <div className="flex bg-white border-b p-2 font-black text-[10px]">
                          {role !== "parent" && <button onClick={()=>setCalendarSubView("chat")} className={`flex-1 py-3 rounded-xl relative ${calendarSubView === "chat" ? "bg-slate-800 text-white" : "text-slate-400"}`}>💬 生徒連絡 {hasUnread("chat") && <span className="inline-block w-2 h-2 bg-rose-500 rounded-full ml-1"></span>}</button>}
                          {role !== "student" && <button onClick={()=>setCalendarSubView("parentChat")} className={`flex-1 py-3 rounded-xl relative ${calendarSubView === "parentChat" ? "bg-slate-800 text-white" : "text-slate-400"}`}>👪 保護者連絡 {hasUnread("parentChat") && <span className="inline-block w-2 h-2 bg-rose-500 rounded-full ml-1"></span>}</button>}
                          <button onClick={()=>setCalendarSubView("report")} className={`flex-1 py-3 rounded-xl relative ${calendarSubView === "report" ? "bg-slate-800 text-white" : "text-slate-400"}`}>📝 報告 {hasUnread("report") && <span className="inline-block w-2 h-2 bg-rose-500 rounded-full ml-1"></span>}</button>
                        </div>
                        {calendarSubView !== "report" ? (
                          <div className="flex flex-col flex-1 overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll" ref={chatScrollRef}>
                              {currentChatMessages.map((m: any, i: number) => (
                                <div key={i} className={`flex flex-col ${m.sender === role ? "items-end" : "items-start"}`}>
                                  <div className={`max-w-[85%] p-3 text-sm font-bold rounded-2xl shadow-sm ${m.sender === role ? "bg-slate-700 text-white rounded-tr-none" : "bg-white text-slate-700 border rounded-tl-none"}`}>{m.text}</div>
                                  <span className="text-[8px] text-slate-400 mt-1">{m.timestamp}</span>
                                </div>
                              ))}
                            </div>
                            <div className="p-4 bg-white border-t flex gap-2"><input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()} placeholder="メッセージ..." className="flex-1 bg-slate-100 p-3 rounded-xl text-sm font-bold outline-none" /><button onClick={sendMessage} className="px-5 bg-blue-600 text-white rounded-xl font-black text-xs">送信</button></div>
                          </div>
                        ) : (
                          <div className="p-6 overflow-y-auto custom-scroll flex-1">
                            <div className="bg-slate-800 text-white px-3 py-1 rounded-lg text-[10px] font-black inline-block mb-4">{selectedDate} の報告</div>
                            {role === "teacher" ? (
                              <div className="space-y-4">
                                <textarea value={publicReport} onChange={e=>setPublicReport(e.target.value)} placeholder="【公開】授業内容・宿題内容など" className="w-full h-24 p-3 rounded-xl border-2 text-sm outline-none" />
                                <textarea value={internalReport} onChange={e=>setInternalReport(e.target.value)} placeholder="【非公開】内部メモ" className="w-full h-24 p-3 rounded-xl bg-rose-50 border-rose-100 border-2 text-sm outline-none" />
                                <button onClick={() => {
                                  const updated = {...students};
                                  if(!updated[currentStudentId!].reports) updated[currentStudentId!].reports = [];
                                  const idx = updated[currentStudentId!].reports.findIndex((r:any)=>r.date === selectedDate);
                                  if(idx>=0) { updated[currentStudentId!].reports[idx].public = publicReport; updated[currentStudentId!].reports[idx].internal = internalReport; }
                                  else updated[currentStudentId!].reports.push({date: selectedDate, public: publicReport, internal: internalReport});
                                  updateStudentsData(updated); alert("保存完了");
                                }} className="w-full py-3 bg-slate-800 text-white rounded-xl font-black text-xs">保存する</button>
                              </div>
                            ) : <div className="p-5 bg-white rounded-2xl border min-h-[200px] text-sm font-bold text-slate-700 whitespace-pre-wrap">{publicReport || "未入力です。"}</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentView === "progress" && (
                    <div className="grid md:grid-cols-2 gap-6 animate-in fade-in">
                      {Object.keys(currentStudent.subjects).map(s => (
                        <div key={s} className="p-5 bg-slate-50 rounded-2xl border">
                          <p className="text-xs font-black mb-2">{s}</p>
                          {currentStudent.subjects[s].map((u:any, i:number) => (
                            <div key={i} className="mb-3">
                              <div className="flex justify-between text-[10px] font-bold mb-1"><span>{u.unit}</span><span>{u.progress}%</span></div>
                              <input type="range" value={u.progress} disabled={role !== "teacher"} onChange={e => {
                                const updated = {...students}; updated[currentStudentId!].subjects[s][i].progress = Number(e.target.value); updateStudentsData(updated);
                              }} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {currentView === "homework" && (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in">
                       {currentStudent.homeworks?.map((h: any, i: number) => (
                         <div key={i} className="aspect-square bg-slate-100 rounded-2xl overflow-hidden cursor-zoom-in" onClick={() => setPreviewImg(h.img)}>
                           <img src={h.img} className="w-full h-full object-cover" />
                           <div className="absolute bottom-0 left-0 right-0 bg-black/40 p-2 text-[8px] text-white font-bold">{h.date}</div>
                         </div>
                       ))}
                     </div>
                  )}

                  {currentView === "test" && (
                    <div className="space-y-6 animate-in fade-in">
                      <SimpleLineChart data={currentStudent.tests?.filter((t:any)=>t.status==="approved").map((t:any)=>Number(t.scores[graphSubject]?.result || 0)) || []} color="#e11d48" />
                      <div className="grid gap-4">
                        {currentStudent.tests?.map((t:any, i:number) => (
                          <div key={i} className="p-4 border rounded-2xl bg-white"><p className="font-black text-sm">{t.title}</p></div>
                        )).reverse()}
                      </div>
                    </div>
                  )}

                </div>
              ) : <div className="h-full flex items-center justify-center text-slate-300 border-4 border-dashed rounded-[3rem] min-h-[600px]">SELECT STUDENT</div>}
            </div>
          </div>
        </div>
      )}

      {previewImg && <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8 cursor-zoom-out" onClick={() => setPreviewImg(null)}><img src={previewImg} className="max-w-full max-h-full rounded-lg" /></div>}
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .custom-scroll::-webkit-scrollbar { width: 4px; } .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode><App /></React.StrictMode>);
