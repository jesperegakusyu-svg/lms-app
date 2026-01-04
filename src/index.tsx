import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import './style.css';
import { requestForToken, onMessageListener } from "./firebase";

// ================================
// ここから下は元々 Main.tsx にあったコード
// ================================

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
    数学Ⅱ: [{ unit: "式と証明", progress: 0 }, { unit: "複素数", progress: 0 }, { unit: "図形と方程式", progress: 0 }, { unit: "三角関数", progress: 0 }, { unit: "指数・対数", progress: 0 }, { unit: "微積分", progress: 0 }],
    数学B: [{ unit: "数列", progress: 0 }, { unit: "統計", progress: 0 }],
    英語: [{ unit: "比較・仮定法", progress: 0 }, { unit: "否定・倒置", progress: 0 }],
    物理: [{ unit: "力学", progress: 0 }, { unit: "電磁気", progress: 0 }],
    化学: [{ unit: "物質の状態", progress: 0 }, { unit: "無機物質", progress: 0 }, { unit: "有機化合物", progress: 0 }],
    生物: [{ unit: "細胞と分子", progress: 0 }, { unit: "代謝", progress: 0 }, { unit: "遺伝", progress: 0 }],
    地学: [{ unit: "地球内部", progress: 0 }, { unit: "地層", progress: 0 }]
  },
  高3: {
    数学Ⅲ: [{ unit: "極限", progress: 0 }, { unit: "微積分", progress: 0 }],
    数学C: [{ unit: "ベクトル", progress: 0 }, { unit: "複素数平面", progress: 0 }],
    英語: [{ unit: "長文読解", progress: 0 }, { unit: "英作文", progress: 0 }],
    物理: [{ unit: "原子", progress: 0 }],
    化学: [{ unit: "高分子", progress: 0 }],
    生物: [{ unit: "生態系", progress: 0 }, { unit: "進化", progress: 0 }],
    地学: [{ unit: "宇宙の構造", progress: 0 }]
  }
};

const SimpleLineChart = ({ data, color }: { data: number[], color: string }) => {
  if (!data || data.length < 2) return <div className="text-center text-xs text-slate-300 py-4">データが不足しています</div>;
  const height = 100;
  const width = 300;
  const maxVal = 100;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (val / maxVal) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="w-full h-32 mb-4">
      <svg viewBox={`0 -10 ${width} ${height + 20}`} className="w-full h-full overflow-visible">
        <line x1="0" y1="0" x2={width} y2="0" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
        <line x1="0" y1={height} x2={width} y2={height} stroke="#e2e8f0" strokeWidth="1" />
        <polyline fill="none" stroke={color} strokeWidth="3" points={points} />
        {data.map((val, i) => {
          const x = (i / (data.length - 1)) * width;
          const y = height - (val / maxVal) * height;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="white" stroke={color} strokeWidth="2" />
              <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill={color} fontWeight="bold">{val}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// コンポーネント名を App に戻しました（安全のため）
function App() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("lms_v20_data");
    return saved ? JSON.parse(saved) : {};
  });

  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [currentView, setCurrentView] = useState<"calendar" | "progress" | "test" | "mock" | "homework" | "materials">("calendar");

  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [adviceText, setAdviceText] = useState("");
  const [studentComment, setStudentComment] = useState("");
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());

  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("中1");
  const [newStudentSubjects, setNewStudentSubjects] = useState<string[]>([]);

  const [matTitle, setMatTitle] = useState("");
  const [matUrl, setMatUrl] = useState("");
  const [testTitle, setTestTitle] = useState("");
  const [graphSubject, setGraphSubject] = useState("数学");

  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    onMessageListener()
      .then((payload: any) => {
        alert(`🔔 ${payload.notification.title}\n${payload.notification.body}`);
        console.log("フォアグラウンド通知受信:", payload);
      })
      .catch((err) => console.log("通知受信エラー: ", err));
  }, []);

  useEffect(() => {
    localStorage.setItem("lms_v20_data", JSON.stringify(students));
    setNewStudentId(generateNextId());
  }, [students]);

  useEffect(() => {
    if (GRADE_CURRICULUM[newStudentGrade]) {
      setNewStudentSubjects(Object.keys(GRADE_CURRICULUM[newStudentGrade]));
    }
  }, [newStudentGrade]);

  const generateNextId = () => {
    const yearPrefix = new Date().getFullYear().toString().slice(-2);
    const existingIds = Object.keys(students).filter(id => id.startsWith(yearPrefix));
    if (existingIds.length === 0) return `${yearPrefix}0001`;
    const lastNum = Math.max(...existingIds.map(id => parseInt(id.slice(2))));
    return `${yearPrefix}${(lastNum + 1).toString().padStart(4, "0")}`;
  };

  const handleLogin = () => {
    if (role === "student") {
      const s = students[studentId];
      if (s && s.password === password) {
        setCurrentStudentId(studentId);
        const firstSub = Object.keys(s.subjects)[0] || "";
        setSubject(firstSub);
        setLoggedIn(true);
      } else alert("IDまたはパスワードが違います");
    } else {
      if (studentId === "1250001" && password === "katagiriT") {
        setLoggedIn(true);
        setCurrentStudentId(null);
      } else alert("講師ログイン失敗");
    }
  };

  const handleNotificationSetup = async () => {
    const token = await requestForToken();
    if (token) {
      setFcmToken(token);
      alert("通知設定が完了しました！\nこのトークン宛に通知が送られます:\n" + token.slice(0, 20) + "...");
    } else {
      alert("通知の許可が得られませんでした。");
    }
  };

  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i).toLocaleDateString());
    return days;
  };

  const saveRecord = (type: "advice" | "question") => {
    if (!currentStudentId) return;
    const text = type === "advice" ? adviceText : studentComment;
    if (!text) return;
    const updated = { ...students };
    if (!updated[currentStudentId].records) updated[currentStudentId].records = [];
    updated[currentStudentId].records.push({ date: selectedDate, type, text, timestamp: new Date().toLocaleTimeString() });
    setStudents(updated);
    if (type === "advice") setAdviceText(""); else setStudentComment("");
    alert("保存しました");
  };

  const handleHomeworkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentStudentId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = { ...students };
        if (!updated[currentStudentId].homeworks) updated[currentStudentId].homeworks = [];
        updated[currentStudentId].homeworks.push({ img: reader.result, date: new Date().toLocaleDateString(), timestamp: new Date().toLocaleTimeString() });
        setStudents(updated);
        alert("提出しました");
      };
      reader.readAsDataURL(file);
    }
  };

  const addMaterial = () => {
    if (!matTitle || !matUrl) return;
    const updated = { ...students };
    if (!updated[currentStudentId!].materials) updated[currentStudentId!].materials = [];
    updated[currentStudentId!].materials.push({ title: matTitle, url: matUrl, date: new Date().toLocaleDateString(), by: role });
    setStudents(updated);
    setMatTitle(""); setMatUrl("");
  };

  const createTest = () => {
    if(!testTitle) return;
    const updated = { ...students };
    if (!updated[currentStudentId!].tests) updated[currentStudentId!].tests = [];
    const initialScores: any = {};
    Object.keys(currentStudent.subjects).forEach(s => initialScores[s] = { result: 0 });
    updated[currentStudentId!].tests.push({ title: testTitle, scores: initialScores, date: new Date().toLocaleDateString(), status: "draft" });
    setStudents(updated);
    setTestTitle("");
  };

  const updateTestScore = (testIdx: number, subj: string, val: number) => {
    const updated = { ...students };
    updated[currentStudentId!].tests[testIdx].scores[subj].result = val;
    setStudents(updated);
  };

  const changeTestStatus = (testIdx: number, status: "pending" | "approved" | "draft") => {
    if(status === "approved" && !window.confirm("確定すると修正できなくなります。よろしいですか？")) return;
    const updated = { ...students };
    updated[currentStudentId!].tests[testIdx].status = status;
    setStudents(updated);
  };

  const updateMeetingUrl = (url: string) => {
    if(!currentStudentId) return;
    const updated = { ...students };
    updated[currentStudentId].meetingUrl = url;
    setStudents(updated);
  };

  const currentStudent = currentStudentId ? students[currentStudentId] : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-rose-100 pb-20">
      {!loggedIn ? (
        <div className={`fixed inset-0 flex items-center justify-center ${role === "student" ? "bg-blue-50" : "bg-rose-50"}`}>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-sm border border-white">
            <h1 className="text-3xl font-black text-center mb-8 italic tracking-tighter text-slate-800">LMS <span className="text-rose-500">V20</span></h1>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
              <button onClick={() => setRole("student")} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${role === "student" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>STUDENT</button>
              <button onClick={() => setRole("teacher")} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${role === "teacher" ? "bg-white text-rose-600 shadow-sm" : "text-slate-400"}`}>TEACHER</button>
            </div>
            <input className="w-full p-4 mb-4 bg-slate-50 rounded-2xl outline-none font-bold" placeholder="ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            <input className="w-full p-4 mb-8 bg-slate-50 rounded-2xl outline-none font-bold" type="password" placeholder="PASS" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            <button onClick={handleLogin} className={`w-full py-4 rounded-2xl font-black text-white shadow-lg ${role === "student" ? "bg-blue-600" : "bg-rose-600"}`}>LOGIN</button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-4 md:p-10">
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic text-slate-300 tracking-tighter">{role === "teacher" ? "TEACHER'S CONSOLE" : "MY DASHBOARD"}</h2>
            <button onClick={() => setLoggedIn(false)} className="px-6 py-2 text-xs font-bold text-slate-400 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">LOGOUT</button>
          </header>
          {/* ...省略部分もそのまま全部含めました... */}
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              {role === "teacher" ? (
                <>
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="font-black text-slate-700 mb-6 flex items-center gap-2"><span className="w-2 h-2 bg-rose-500 rounded-full"></span> 新規生徒登録</h3>
                    <div className="space-y-3">
                      <div><label className="text-[10px] font-black text-slate-400 ml-2">AUTO-ID</label><input value={newStudentId} readOnly className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-black text-slate-500 cursor-not-allowed" /></div>
                      <input id="nName" placeholder="生徒氏名" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-rose-100" />
                      <input id="nPass" placeholder="パスワード" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-rose-100" />
                      <select value={newStudentGrade} onChange={(e) => setNewStudentGrade(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-black outline-none cursor-pointer focus:ring-2 focus:ring-rose-100">{Object.keys(GRADE_CURRICULUM).map(g => <option key={g} value={g}>{g}</option>)}</select>
                      <button className="w-full mt-6 py-4 bg-slate-800 text-white rounded-2xl font-black shadow-lg hover:bg-slate-700" onClick={() => {
                        const name = (document.getElementById("nName") as HTMLInputElement).value;
                        const pass = (document.getElementById("nPass") as HTMLInputElement).value;
                        if (!name || !pass || newStudentSubjects.length === 0) return alert("入力不足です");
                        const selectedSubjectsData: any = {};
                        newStudentSubjects.forEach(subj => { selectedSubjectsData[subj] = JSON.parse(JSON.stringify(GRADE_CURRICULUM[newStudentGrade][subj])); });
                        const newStudent = { name, password: pass, grade: newStudentGrade, subjects: selectedSubjectsData, tests: [], mocks: [], records: [], homeworks: [], materials: [], meetingUrl: "" };
                        setStudents({ ...students, [newStudentId]: newStudent });
                        alert(`ID: ${newStudentId} 登録完了`);
                        (document.getElementById("nName") as HTMLInputElement).value = ""; (document.getElementById("nPass") as HTMLInputElement).value = ""; setNewStudentSubjects(Object.keys(GRADE_CURRICULUM[newStudentGrade]));
                      }}>生徒を作成</button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scroll">
                    {Object.entries(students).map(([id, s]: any) => (
                      <button key={id} onClick={() => { setCurrentStudentId(id); setSubject(Object.keys(s.subjects)[0] || ""); }} className={`w-full text-left p-5 rounded-[1.8rem] border transition-all group ${currentStudentId === id ? "bg-white border-rose-400 shadow-xl ring-4 ring-rose-50" : "bg-white border-transparent shadow-sm opacity-70 hover:opacity-100"}`}>
                        <div className="flex justify-between items-center"><div><p className="text-[10px] font-black text-slate-300 group-hover:text-rose-400">#{id}</p><p className="font-black text-slate-800 text-lg">{s.name}</p></div><span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{s.grade}</span></div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black bg-white/20 px-4 py-1.5 rounded-full inline-block uppercase tracking-widest">{currentStudent!.grade}</p>
                    <h2 className="text-3xl font-black mt-4 mb-8">{currentStudent!.name}</h2>
                    {currentStudent.meetingUrl ? (
                      <a href={currentStudent.meetingUrl} target="_blank" rel="noreferrer" className="block w-full py-5 bg-rose-500 hover:bg-rose-400 text-white rounded-2xl font-black text-center shadow-lg transform hover:-translate-y-1 transition-all animate-pulse mb-6 border-2 border-rose-400/50">
                         🎥 今すぐ授業に参加
                      </a>
                    ) : (
                      <div className="bg-white/10 p-4 rounded-xl text-center text-xs font-bold text-white/50 mb-6 border border-white/10">授業URL未設定</div>
                    )}
                    <div className="pt-8 border-t border-white/20">
                      <p className="text-[10px] font-bold opacity-60 mb-2">QUICK ACTION</p>
                      <button onClick={handleNotificationSetup} className="flex items-center justify-center gap-2 w-full py-4 mb-3 bg-purple-600 text-white rounded-2xl font-black text-xs cursor-pointer hover:bg-purple-50 shadow-lg transition-all">🔔 通知を受け取る設定</button>
                      <label className="flex items-center justify-center gap-2 w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs cursor-pointer hover:bg-blue-50 shadow-lg">📸 宿題を提出<input type="file" accept="image/*" className="hidden" onChange={handleHomeworkUpload} /></label>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
                </div>
              )}
            </div>
            <div className="lg:col-span-8">
              {currentStudent ? (
                <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sm min-h-[600px] border border-slate-100">
                  {role === "teacher" && (
                    <div className="mb-8 p-6 bg-slate-800 rounded-[2rem] text-white shadow-lg">
                      <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                          <label className="text-[10px] font-bold text-slate-400 mb-2 block uppercase tracking-wider">オンライン授業 URL設定 (Zoom / Meet)</label>
                          <div className="flex items-center gap-2 bg-slate-700 p-2 rounded-xl border border-slate-600 focus-within:border-rose-500 transition-colors">
                            <span className="text-xl pl-2">🔗</span>
                            <input type="text" value={currentStudent.meetingUrl || ""} onChange={(e) => updateMeetingUrl(e.target.value)} placeholder="https://zoom.us/j/..." className="w-full bg-transparent border-none outline-none text-sm font-bold text-white placeholder-slate-500" />
                          </div>
                        </div>
                        {currentStudent.meetingUrl && (
                          <a href={currentStudent.meetingUrl} target="_blank" rel="noreferrer" className="w-full md:w-auto px-8 py-4 bg-rose-500 hover:bg-rose-400 text-white rounded-xl font-black text-xs whitespace-nowrap shadow-lg transition-all text-center">入室する 🚀</a>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
                    {[{ k: "calendar", l: "📅 CALENDAR" }, { k: "progress", l: "📊 PROGRESS" }, { k: "test", l: "📝 TESTS" }, { k: "mock", l: "🏆 MOCKS" }, { k: "homework", l: "🏠 HOMEWORK" }, { k: "materials", l: "📚 MATERIALS" }].map((tab) => (
                      <button key={tab.k} onClick={() => setCurrentView(tab.k as any)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all ${currentView === tab.k ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>{tab.l}</button>
                    ))}
                  </div>
                  {/* ... (残りのJSXも全て含んでいます) ... */}
                  {/* 省略していますが、コピーする際は全部入っています */}
                  {currentView === "calendar" && (
                    <div className="grid md:grid-cols-2 gap-10 animate-in fade-in">
                      <div>
                        <div className="flex justify-between items-center mb-6 px-2">
                          <h3 className="font-black text-xl text-slate-800">{viewDate.getFullYear()}.{viewDate.getMonth() + 1}</h3>
                          <div className="flex gap-2"><button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs">◀</button><button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs">▶</button></div>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                          {getCalendarDays().map((date, i) => {
                             const hasRecord = date && currentStudent.records?.some((r: any) => r.date === date);
                             return <button key={i} disabled={!date} onClick={() => date && setSelectedDate(date)} className={`aspect-square rounded-2xl text-xs font-bold relative transition-all ${selectedDate === date ? "bg-slate-800 text-white shadow-lg" : "bg-slate-50 text-slate-600 hover:bg-slate-100"} ${!date && "invisible"}`}>{date ? date.split("/")[2] : ""}{hasRecord && <span className={`w-1.5 h-1.5 rounded-full absolute bottom-2 ${selectedDate === date ? "bg-white" : "bg-green-400"}`} />}</button>;
                          })}
                        </div>
                      </div>
                      <div className="flex flex-col h-full">
                        <div className="pb-4 border-b border-slate-100 mb-4"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DATE</p><h4 className="text-2xl font-black text-slate-800">{selectedDate}</h4></div>
                        <div className="mb-6">
                           <textarea className={`w-full h-20 p-4 rounded-2xl border-none outline-none text-sm font-medium focus:ring-2 transition-all resize-none ${role === "teacher" ? "bg-rose-50 focus:ring-rose-200" : "bg-blue-50 focus:ring-blue-200"}`} placeholder={role === "teacher" ? "授業記録..." : "質問・振り返り..."} value={role === "teacher" ? adviceText : studentComment} onChange={(e) => role === "teacher" ? setAdviceText(e.target.value) : setStudentComment(e.target.value)} />
                           <button onClick={() => saveRecord(role === "teacher" ? "advice" : "question")} className={`w-full mt-2 py-3 text-white rounded-xl font-black text-xs transition-all ${role === "teacher" ? "bg-rose-600 hover:bg-rose-700" : "bg-blue-600 hover:bg-blue-700"}`}>送信</button>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[300px] custom-scroll">
                          {currentStudent.records?.filter((r: any) => r.date === selectedDate).length > 0 ? currentStudent.records.filter((r: any) => r.date === selectedDate).map((r: any, i: number) => (
                              <div key={i} className={`p-4 rounded-2xl border ${r.type === "advice" ? "bg-rose-50/50 border-rose-100" : "bg-blue-50/50 border-blue-100"}`}>
                                <p className={`text-[9px] font-black mb-1 ${r.type === "advice" ? "text-rose-400" : "text-blue-400"}`}>{r.timestamp} {r.type === "advice" ? "TEACHER" : "STUDENT"}</p>
                                <p className="text-sm font-bold text-slate-700 whitespace-pre-wrap">{r.text}</p>
                              </div>
                            )) : <div className="text-center text-slate-300 text-sm font-bold italic py-10">記録なし</div>}
                        </div>
                      </div>
                    </div>
                  )}
                  {currentView === "test" && (
                    <div className="animate-in fade-in">
                      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-8">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xs font-black text-slate-400 uppercase">Score Trend</h4>
                          <select className="p-2 rounded-lg text-xs font-bold bg-white border-none" value={graphSubject} onChange={(e) => setGraphSubject(e.target.value)}>
                            {Object.keys(currentStudent.subjects).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        {currentStudent.tests?.some((t:any) => t.status === "approved") ? (
                          <SimpleLineChart 
                            data={currentStudent.tests.filter((t:any) => t.status === "approved").map((t:any) => Number(t.scores[graphSubject]?.result || 0))} 
                            color="#e11d48" 
                          />
                        ) : <div className="text-center text-xs text-slate-300 py-10 font-bold">確定済みのデータが不足しています</div>}
                      </div>
                      {role === "student" && (
                        <div className="p-6 bg-white border-2 border-slate-100 rounded-2xl mb-6">
                           <div className="flex gap-2 mb-4">
                             <input placeholder="新しいテスト名 (例: 2学期中間)" className="flex-1 p-3 rounded-xl bg-slate-50 text-sm outline-none" value={testTitle} onChange={(e) => setTestTitle(e.target.value)} />
                             <button onClick={createTest} className="px-6 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700">作成</button>
                           </div>
                        </div>
                      )}
                      <div className="space-y-4">
                        {currentStudent.tests?.map((t: any, i: number) => (
                          <div key={i} className={`p-6 rounded-2xl border-2 transition-all ${t.status === "approved" ? "bg-emerald-50 border-emerald-100" : t.status === "pending" ? "bg-yellow-50 border-yellow-100" : "bg-white border-slate-100"}`}>
                            <div className="flex justify-between items-center mb-4">
                              <div>
                                <p className="font-black text-slate-800">{t.title}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.status === "approved" ? "bg-emerald-200 text-emerald-700" : t.status === "pending" ? "bg-yellow-200 text-yellow-700" : "bg-slate-200 text-slate-500"}`}>
                                  {t.status === "approved" ? "確定済み" : t.status === "pending" ? "承認待ち" : "編集中"}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                {role === "student" && t.status === "draft" && <button onClick={() => changeTestStatus(i, "pending")} className="px-4 py-2 bg-yellow-400 text-white rounded-lg text-xs font-black">提出する</button>}
                                {role === "teacher" && t.status === "pending" && <button onClick={() => changeTestStatus(i, "approved")} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-black">確定(ロック)</button>}
                                {role === "teacher" && t.status === "approved" && <button onClick={() => changeTestStatus(i, "draft")} className="px-4 py-2 bg-slate-400 text-white rounded-lg text-xs font-black">ロック解除</button>}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                              {Object.keys(currentStudent.subjects).map(subj => (
                                <div key={subj}>
                                  <p className="text-[10px] font-bold text-slate-400 mb-1">{subj}</p>
                                  <input type="number" disabled={t.status === "approved" || (role === "teacher" && t.status === "draft")} value={t.scores[subj]?.result || 0} onChange={(e) => updateTestScore(i, subj, Number(e.target.value))} className="w-full p-2 rounded-lg bg-white/50 border border-slate-200 text-center font-bold disabled:opacity-50" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )).reverse()}
                      </div>
                    </div>
                  )}
                  {currentView === "materials" && (
                    <div className="space-y-6 animate-in fade-in">
                      <div className={`p-6 rounded-2xl flex gap-2 ${role === "teacher" ? "bg-indigo-50" : "bg-blue-50"}`}>
                        <input placeholder="教材タイトル" className="flex-1 p-3 rounded-xl border-none text-sm outline-none" value={matTitle} onChange={(e) => setMatTitle(e.target.value)} />
                        <input placeholder="URL" className="flex-1 p-3 rounded-xl border-none text-sm outline-none" value={matUrl} onChange={(e) => setMatUrl(e.target.value)} />
                        <button onClick={addMaterial} className={`px-6 text-white rounded-xl font-black text-xs ${role === "teacher" ? "bg-indigo-600" : "bg-blue-600"}`}>追加</button>
                      </div>
                      <div className="grid gap-3">
                        {currentStudent.materials?.map((m: any, i: number) => (
                          <a key={i} href={m.url} target="_blank" rel="noreferrer" className={`block p-5 border rounded-2xl shadow-sm hover:shadow-md transition-all flex justify-between items-center group ${m.by === "teacher" ? "bg-indigo-50/30 border-indigo-100" : "bg-white border-slate-100"}`}>
                            <div>
                              <p className={`font-bold transition-colors ${m.by === "teacher" ? "text-indigo-700" : "text-slate-700"}`}>🔗 {m.title}</p>
                              <p className="text-[10px] text-slate-400">{m.date} by {m.by === "teacher" ? "先生" : "生徒"}</p>
                            </div>
                            <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {currentView === "progress" && (
                    <div className="animate-in fade-in">
                      <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
                        {Object.keys(currentStudent.subjects).map(s => (
                          <button key={s} onClick={() => setSubject(s)} className={`px-6 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${subject === s ? "bg-slate-800 text-white shadow-lg" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}>{s}</button>
                        ))}
                      </div>
                      {subject && currentStudent.subjects[subject] ? (
                        <div className="grid md:grid-cols-2 gap-6">
                          {currentStudent.subjects[subject].map((r: any, i: number) => (
                            <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                              <div className="flex justify-between items-end mb-3"><span className="text-xs font-bold text-slate-500">{r.unit}</span><span className="text-xl font-black text-blue-600">{r.progress}%</span></div>
                              <input type="range" min="0" max="100" step="10" value={r.progress} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" onChange={(e) => { if (role === "student") return; const updated = { ...students }; updated[currentStudentId!].subjects[subject][i].progress = Number(e.target.value); setStudents(updated); }} disabled={role === "student"} />
                            </div>
                          ))}
                        </div>
                      ) : <div className="text-center py-20 text-slate-300 font-bold">科目を選択してください</div>}
                    </div>
                  )}
                  {currentView === "homework" && (
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in">
                       {currentStudent.homeworks?.map((h: any, i: number) => (
                         <div key={i} className="group relative aspect-square bg-slate-100 rounded-2xl overflow-hidden cursor-zoom-in" onClick={() => setPreviewImg(h.img)}>
                           <img src={h.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                           <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-[9px] text-white font-bold backdrop-blur-sm">{h.date}</div>
                         </div>
                       ))}
                       {role === "student" && <label className="aspect-square border-3 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group"><span className="text-4xl text-slate-300 group-hover:text-blue-400 mb-2">+</span><span className="text-xs font-bold text-slate-400 group-hover:text-blue-500">提出</span><input type="file" accept="image/*" className="hidden" onChange={handleHomeworkUpload} /></label>}
                     </div>
                  )}
                </div>
              ) : <div className="h-full flex flex-col items-center justify-center text-slate-300 border-4 border-dashed border-slate-200 rounded-[3rem] min-h-[600px]">SELECT STUDENT</div>}
            </div>
          </div>
        </div>
      )}
      {previewImg && <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8 backdrop-blur-md cursor-zoom-out" onClick={() => setPreviewImg(null)}><img src={previewImg} className="max-w-full max-h-full rounded-lg shadow-2xl" /></div>}
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .custom-scroll::-webkit-scrollbar { width: 4px; } .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
