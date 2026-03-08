let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let sessions = JSON.parse(localStorage.getItem("sessions")) || [];

function addTask() {
  const subject = document.getElementById("subjectInput").value;
  const duration = document.getElementById("durationInput").value;

  if (!subject || !duration) {
    alert("Fill all fields");
    return;
  }

  const task = { subject, duration: parseInt(duration) };
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

function displayTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${task.subject} - ${task.duration} min 
    <button onclick="deleteTask(${index})">❌</button>`;
    list.appendChild(li);
  });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

/* TIMER */

let timer;
let timeLeft = 1500;

function startTimer() {
  if (timer) return;

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      saveSession();
      alert("Session Completed 🎉");
      resetTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  timeLeft = 1500;
  updateDisplay();
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  document.getElementById("timerDisplay").textContent =
    `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

/* SAVE SESSION */

function saveSession() {
  const session = {
    duration: 25,
    date: new Date().toLocaleDateString()
  };

  sessions.push(session);
  localStorage.setItem("sessions", JSON.stringify(sessions));
  updateStats();
  updateAI();
}

/* UPDATE STATS */

function updateStats() {
  let totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  let hours = (totalMinutes / 60).toFixed(1);

  document.getElementById("studyHours").textContent = hours;
  document.getElementById("studyStreak").textContent = sessions.length;
}

/* SIMPLE AI LOGIC */

function updateAI() {
  const aiBox = document.getElementById("aiInsights");
  aiBox.innerHTML = "";

  if (sessions.length < 3) {
    aiBox.innerHTML = "<li>Keep going! Build your study streak.</li>";
  } else if (sessions.length < 6) {
    aiBox.innerHTML = "<li>Nice consistency! Try increasing session time.</li>";
  } else {
    aiBox.innerHTML = "<li>Excellent focus! You're building strong habits 🔥</li>";
  }
}

/* INIT */

displayTasks();
updateDisplay();
updateStats();
updateAI();