// Element references
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityFilter = document.getElementById("priorityFilter");

const completedCount = document.getElementById("completedCount");
const remainingCount = document.getElementById("remainingCount");
const studyTimeDisplay = document.getElementById("studyTime");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const goalInput = document.getElementById("goalInput");
const goalText = document.getElementById("goalText");
const motivationText = document.getElementById("motivationText");

const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const studyMinutesInput = document.getElementById("studyMinutes");
const setTimerBtn = document.getElementById("setTimerBtn");
const breakTimerBtn = document.getElementById("breakTimerBtn");
const timerMode = document.getElementById("timerMode");
const notificationBtn = document.getElementById("notificationBtn");
const themeToggle = document.getElementById("themeToggle");

// Storage keys
const TASKS_KEY = "FocusFlowTasks";
const STUDY_TIME_KEY = "FocusFlowStudyTime";
const STUDY_DATE_KEY = "FocusFlowStudyDate";
const GOAL_KEY = "FocusFlowGoal";
const THEME_KEY = "FocusFlowTheme";

// Helpers
function getTodayString() {
    const now = new Date();
    return (
        now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0")
    );
}

// Tasks
function updateProgress() {
    const tasks = taskList.querySelectorAll("li");
    let completed = 0;

    tasks.forEach(function(task) {
        if (task.classList.contains("completed")) {
            completed++;
        }
    }); 

    completedCount.textContent = completed;
    remainingCount.textContent = tasks.length - completed;

   
    const percentage = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);
    progressBar.style.width = percentage + "%";
    progressText.textContent = percentage + "% Completed";

    
    const goal = Math.max(1, Number(goalInput.value) || 1);
    goalText.textContent = completed + " of " + goal + " tasks completed";

    
    if(tasks.length === 0) { 
        motivationText.textContent = "Every small step counts!";
    } else if (completed === tasks.length) {
        motivationText.textContent = "Amazing! You've completed all your tasks for the day!";
    } else if (completed > 0) {
        motivationText.textContent = "Great progress! Keep going!";
    } else {
        motivationText.textContent = "You've got this! Start with one task.";
    }
}

function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(function(task) {
        tasks.push({
            text: task.querySelector(".task-text").textContent,
            completed: task.classList.contains("completed"),
            priority: task.dataset.priority || "Medium",
            dueDate: task.dataset.dueDate || ""
        });
    });
    try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error("Could not save tasks:", error);
    }
}
//Overdue
function updateDueState(task) {
    task.classList.remove("overdue", "due-today");
    const dueDate = task.dataset.dueDate;
    if (!dueDate || task.classList.contains("completed")) {
        return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate + "T00:00:00");

    if(due < today) {
        task.classList.add("overdue");
    } else if (due.getTime() === today.getTime()) {
        task.classList.add("due-today");
    }
}

// Show or hide selected priority
function applyFilter() {
    const selectedPriority = priorityFilter.value;
    taskList.querySelectorAll("li").forEach(function (task) {
        const taskPriority = task.dataset.priority || "Medium";
        const visible = selectedPriority === "All" || taskPriority === selectedPriority;
        task.style.display = visible ? "flex" : "none";
    });
}

function createTask(text, priority = "Medium", completed = false, dueDate = "") {
    const task = document.createElement("li");
    const taskTextSpan = document.createElement("span");
    const priorityLabel = document.createElement("span");
    const deleteBtn = document.createElement("button");

    taskTextSpan.textContent = text;
    taskTextSpan.classList.add("task-text");

    priorityLabel.textContent = priority + " Priority";
    priorityLabel.classList.add(
        "priority-label",
        "priority-" + priority.toLowerCase()
    );

    deleteBtn.textContent = "Delete";
    deleteBtn.type = "button";
    deleteBtn.classList.add("delete-btn");

    task.dataset.priority = priority;
    task.dataset.dueDate = dueDate;

    task.appendChild(taskTextSpan);
    task.appendChild(priorityLabel);

    if (dueDate) {
        const dueDateLabel = document.createElement("span");
        dueDateLabel.classList.add("due-date-label");
        dueDateLabel.textContent = "Due: " + dueDate;
        task.appendChild(dueDateLabel);
    }

    task.appendChild(deleteBtn);

    if (completed) {
        task.classList.add("completed");
    }

    taskTextSpan.addEventListener("click", function() {
        task.classList.toggle("completed");
        updateDueState(task);
        updateProgress();
        saveTasks();
    });

    deleteBtn.addEventListener("click", function() {
        task.remove();
        updateProgress();
        saveTasks();
    });

    taskList.appendChild(task);
    updateDueState(task);
    applyFilter();
}

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(TASKS_KEY);
        if (savedTasks !== null) {
            JSON.parse(savedTasks).forEach(function(savedTask) {
                createTask(savedTask.text, savedTask.priority || "Medium", savedTask.completed, savedTask.dueDate || "");
            });
        }
    } catch (error) {
        console.error("Could not load tasks:", error);
    }
    updateProgress();
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        return;
    }
    createTask(taskText, priorityInput.value, false, dueDateInput.value);
    taskInput.value = "";
    dueDateInput.value = "";
    updateProgress();
    saveTasks();
}
 addTaskBtn.addEventListener("click", addTask);
 taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
 });
priorityFilter.addEventListener("change", applyFilter);

// Daily goal
try {
    const savedGoal = localStorage.getItem(GOAL_KEY);
    if (savedGoal !== null) {
        goalInput.value = savedGoal;
    }
} catch (error) {
    console.error("Could not load goal:", error);
}
goalInput.addEventListener("input", function () {
    try{
        localStorage.setItem(GOAL_KEY, goalInput.value);
    } catch (error) {
        console.error("Could not save goal:", error);
    }
    updateProgress();
});

// Notifications and sound
function showNotification(message) {
    if (!("Notification" in window) || Notification.permission !== "granted")
    {
        return false;
    }
    try {
        new Notification("FocusFlow", {body: message});
        return true;
    } catch (error) {
        console.error("Notification failed:", error);
        return false;
    }
}

async function playTimerSound() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if(!AudioContextClass) {
        return;
    }
    try{
        const audioContext = new AudioContextClass();
        await audioContext.resume();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = 880;
        gain.gain.value = 0.15;
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
        oscillator.onended = function () {
            audioContext.close();
        };
    } catch (error) {
        console.error("could not play:", error);
    }
}

function notifyTimerFinished(message) {
    playTimerSound();
    if (!showNotification(message)) {
        alert(message);
    }
}
if(!("Notification" in window)) {
    notificationBtn.textContent = "Notifications unsupported";
    notificationBtn.disabled = true;
} else if (Notification.permission === "granted") {
    notificationBtn.textContent = "Notification Enabled";
}

notificationBtn.addEventListener("click", async function () {
    if (!("Notification" in window)) {
        return;
    }
    try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            notificationBtn.textContent = "Notification Blocked";
            alert("Please allow notifications in your browser settings.");
            return;
        }
        notificationBtn.textContent = "Notification Enabled";
        showNotification("Notification are working");
    } catch (error) {
        console.error("notificaion error:", error);
        alert("notifications error:" + error.message);
    }
});

//Study time
let studyDate = getTodayString();
let totalStudySeconds = 0;

try{
    if(localStorage.getItem(STUDY_DATE_KEY) === studyDate) {
        totalStudySeconds = Number(localStorage.getItem(STUDY_TIME_KEY)) || 0;}
} catch (error) {
    console.error("Could not load study time:", error);
}

function updateStudyTimeDisplay() {
    const hours = Math.floor(totalStudySeconds / 3600);
    const minutes = Math.floor((totalStudySeconds % 3600) / 60);
    studyTimeDisplay.textContent = hours > 0 ? hours + "h " + minutes + "m": minutes + "m";
}

function addStudySeconds(seconds) {
    const today = getTodayString();
    if(today !== studyDate) {
        studyDate = today;
        totalStudySeconds = 0;
    }
    totalStudySeconds += seconds;
    try {
        localStorage.setItem(STUDY_TIME_KEY, totalStudySeconds);
        localStorage.setItem(STUDY_DATE_KEY, studyDate);
    } catch (error) {
        console.error("Could not save study:", error);
    }
    updateStudyTimeDisplay();
}
//Timer
let timeLeft = 25 * 60;
let timerInterval = null;
let currentMode = "study";
let endTime = null;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}
function tick() {
    const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    const elapsed = timeLeft - remaining;
    timeLeft = remaining;
    if (currentMode === "study" && elapsed > 0) {
        addStudySeconds(elapsed);
    }
    updateTimerDisplay();

    if(timeLeft <= 0) {
        stopTimer();
        if(currentMode === "break") {
            timerMode.textContent = "Break over!";
            notifyTimerFinished("Break is over! Ready to focus again?");
        } else {
            timerMode.textContent = "Session complete!";
            notifyTimerFinished("Study session complete! Great work");
        }
    }
}

// Starts or resumes the timer
function runTimer() {
    if (timerInterval !== null || timeLeft <= 0) {
        return;
    }
    endTime = Date.now() + timeLeft * 1000;
    timerMode.textContent = currentMode === "break" ? "Break time" : "Focus time";
    timerInterval = setInterval(tick,1000);
}

function getStudyMinutes() {
    const minutes = Number(studyMinutesInput.value);
    return Number.isInteger(minutes) && minutes >= 1 && minutes <= 180 ? minutes : null;
}
function resetStudyTimer(minutes) {
    stopTimer();
    currentMode = "study";
    timeLeft = minutes * 60;
    timerMode.textContent = "Ready to focus?";
    updateTimerDisplay();
}

startBtn.addEventListener("click", runTimer);
pauseBtn.addEventListener("click", function () {
    if (timerInterval === null) {
        return;
    }
    tick();
    stopTimer();
});
resetBtn.addEventListener("click", function () {
    resetStudyTimer(getStudyMinutes() || 25);
});
setTimerBtn.addEventListener("click", function () {
    const minutes = getStudyMinutes(); 
    if (minutes === null) {
        alert("Choose a whole number from 1 to 180.");
        return;
    }
    resetStudyTimer(minutes);
});
breakTimerBtn.addEventListener("click", function (){
    stopTimer();
    currentMode = "break";
    timeLeft = 5 * 60;
    updateTimerDisplay();
    runTimer();
});

//Theme
try {
    if(localStorage.getItem(THEME_KEY) === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "Light Mode";
    }
} catch (error) {
    console.error("Could not load theme:", error);
}

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    try {
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    } catch (error) {
        console.error("Could not save theme:", error);
    }
});

loadTasks();
updateTimerDisplay();
updateStudyTimeDisplay();