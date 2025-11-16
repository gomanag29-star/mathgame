// أصوات الإجابة
const correctSound = new Audio("sounds/correct.mp3");
const wrongSound   = new Audio("sounds/wrong.mp3");

// الأسئلة (بدون صور للأسئلة 9 و10)
const questions = [
    { q: "log₂(8) =", options: ["2","3","4","1"], answer: "3", img: null },
    { q: "log₅(25) =", options: ["1","2","5","0"], answer: "2", img: null },
    { q: "log₁₀(100) =", options: ["3","2","1","0"], answer: "2", img: null },
    { q: "log₄(16) =", options: ["1","2","4","3"], answer: "2", img: null },
    { q: "log₃(1) =", options: ["0","1","3","10"], answer: "0", img: null },
    { q: "log₆(36) =", options: ["1","2","3","4"], answer: "2", img: null },
    { q: "log₂(32) =", options: ["4","5","6","3"], answer: "5", img: null },
    { q: "log₁₀(0.1) =", options: ["0","1","-1","2"], answer: "-1", img: null },
    { q: "حوّل الصورة الأسية 2³ = 8 إلى صورة لوغاريتمية:", 
      options: ["log₂8=3","log₈2=3","log₂3=8","log₈3=2"], 
      answer: "log₂8=3", img: null },
    { q: "حوّل الصورة اللوغاريتمية log₃27=3 إلى صورة أسية:", 
      options: ["3³=27","3²=27","27³=3","27²=3"], 
      answer: "3³=27", img: null }
];

let index = 0, score = 0, time = 20, timer, player = "";
let shuffledQuestions = [];
let playerAnswers = []; // لتخزين إجابات اللاعب

// التنقل بين الصفحات
function show(page){
    document.querySelectorAll(".container").forEach(c => c.classList.remove("active"));
    document.getElementById(page).classList.add("active");
}

function goToName(){ show("namePage"); }

// خلط المصفوفة
function shuffleArray(arr){
    for(let i=arr.length-1;i>0;i--){
        let j=Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
}

// بدء اللعبة
function startGame(){
    player = document.getElementById("playerName").value.trim();
    if(!player){ alert("الرجاء إدخال الاسم"); return; }

    shuffledQuestions = shuffleArray([...questions]);
    index = 0; score = 0;
    playerAnswers = [];
    show("game");
    nextQuestion();
}

// عرض السؤال الحالي
function nextQuestion(){
    if(index >= shuffledQuestions.length){ endGame(); return; }

    time = 20;
    document.getElementById("timer").innerText = `⏳ ${time}`;
    clearInterval(timer);
    timer = setInterval(()=>{
        time--;
        document.getElementById("timer").innerText = `⏳ ${time}`;
        if(time<=0){ clearInterval(timer); index++; nextQuestion(); }
    },1000);

    let q = shuffledQuestions[index];
    let questionHTML = q.q;

    document.getElementById("question").innerHTML = questionHTML;

    let shuffled = shuffleArray([...q.options]);
    let html = "";
    shuffled.forEach(op=>{
        html += `<button onclick="check('${op}')">${op}</button>`;
    });
    document.getElementById("options").innerHTML = html;
}

// التحقق من الإجابة وتخزينها
function check(op){
    clearInterval(timer);
    let q = shuffledQuestions[index];

    playerAnswers.push({
        question: q.q,
        selected: op,
        correct: q.answer,
        img: q.img || null
    });

    if(op === q.answer){
        correctSound.play();
        score++;
    } else {
        wrongSound.play();
    }

    index++;
    setTimeout(nextQuestion, 400);
}

// إنهاء اللعبة وعرض النتائج
function endGame(){
    clearInterval(timer);
    show("scorePage");

    document.getElementById("finalScore").innerText = `${player} حصلت على: ${score} من 10`;

    saveScore();
    loadScores();

    // عرض الإجابات الخاطئة
    let wrongHTML = "<h3>الأسئلة التي أجبتها خطأ:</h3>";
    let wrongs = playerAnswers.filter(a => a.selected !== a.correct);

    if(wrongs.length === 0){
        wrongHTML += "<p>🎉 كل الإجابات صحيحة!</p>";
    } else {
        wrongs.forEach(a => {
            wrongHTML += `<div style="margin-bottom:15px; padding:10px; background: rgba(255,255,255,0.1); border-radius:8px;">`;
            wrongHTML += `<strong>السؤال:</strong> ${a.question}<br>`;
            wrongHTML += `<strong>إجابتك:</strong> ${a.selected} &nbsp; | &nbsp; <strong>الإجابة الصحيحة:</strong> ${a.correct}`;
            wrongHTML += `</div>`;
        });
    }

    // إزالة أي قسم سابق قبل إضافته
    const existingWrongSection = document.getElementById("wrongSection");
    if(existingWrongSection) existingWrongSection.remove();

    const div = document.createElement("div");
    div.id = "wrongSection";
    div.innerHTML = wrongHTML;
    document.getElementById("scorePage").appendChild(div);
}

// حفظ النتائج
function saveScore(){
    let scores = JSON.parse(localStorage.getItem("scores")||"[]");
    scores.push({name:player,score:score});
    localStorage.setItem("scores",JSON.stringify(scores));
}

// تحميل لوحة المتصدرين
function loadScores(){
    let scores = JSON.parse(localStorage.getItem("scores")||"[]");
    scores = scores.sort((a,b)=>b.score-a.score);
    let html = "<tr><th>المركز</th><th>الاسم</th><th>الدرجة</th></tr>";
    scores.slice(0,10).forEach((s,i)=>{
        let medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":"⭐";
        html += `<tr><td>${medal}</td><td>${s.name}</td><td>${s.score}</td></tr>`;
    });
    document.getElementById("scoreTable").innerHTML = html;
}

// رموز الرياضيات المتحركة في الخلفية
document.addEventListener("DOMContentLoaded", () => {
    const mathSymbols = ["∑","π","√","∞","∫","log","θ","∆","x","y","z"];

    function createSymbol(){
        const symbol = document.createElement("div");
        symbol.className = "symbol";
        symbol.innerText = mathSymbols[Math.floor(Math.random()*mathSymbols.length)];
        
        symbol.style.left = Math.random() * 100 + "vw";
        symbol.style.fontSize = 15 + Math.random() * 30 + "px";
        symbol.style.animationDuration = 5 + Math.random() * 10 + "s";
        
        document.body.appendChild(symbol);
        setTimeout(()=>{ symbol.remove(); }, parseFloat(symbol.style.animationDuration)*1000);
    }

    setInterval(createSymbol, 500);
});
if(op === q.answer){
    correctSound.play();
    score++;
} else {
    wrongSound.play();
}