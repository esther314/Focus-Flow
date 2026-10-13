const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const completedCount = document.getElementById("completedCount");
const priorityInput = document.getElementById("priorityInput");
const remainingCount = document.getElementById("remainingCount");
const dueDateInput = document.getElementById("dueDateInput");

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

    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const percentage = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);
    progressBar.style.width = percentage + "%";
    progressText.textContent = percentage + "% Completed";

    const goalInput = document.getElementById("goalInput");
    const goalText = document.getElementById("goalText");
    const goal = Math.max(1, Number(goalInput.value) || 1);
    goalText.textContent = completed + " of " + goal + " tasks completed"

    const motivationText = document.getElementById("motivationText");
    if(tasks.length === 0){
        motivationText.textContent = "Every small step counts!";
    } else if (completed === tasks.length) {
        motivationText.textContent = "Amazing! You've completed all your tasks for the day!";
    } else if (completed > 0) {
        motivationText.textContent = "Great progress! Keep going!";
    } else {
        motivationText.textContent = "You've got this! Start with one task.";
    }
};

function saveTasks(){
    const tasks = [];
    taskList.querySelectorAll("li").forEach(function(task) {
        tasks.push({
            text: task.querySelector(".task-text").textContent,
            completed: task.classList.contains("completed"),
            priority: task.dataset.priority || "Medium",
            dueDate: task.dataset.dueDate || ""
        });
    });
    localStorage.setItem("FocusFlowTasks", JSON.stringify(tasks));
    console.log("Tasks saved");
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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = new Date(dueDate + "T00:00:00");

        if (!completed && due < today) {
            task.classList.add("overdue");
        } else if (!completed && due.getTime() === today.getTime()) {
            task.classList.add("due-today");
        }
    }

    task.appendChild(deleteBtn);

    if (completed) {
        task.classList.add("completed");
    }

    taskTextSpan.addEventListener("click", function() {
        task.classList.toggle("completed");
        updateProgress();
        saveTasks();
    });

    deleteBtn.addEventListener("click", function() {
        task.remove();
        updateProgress();
        saveTasks();
    });

    taskList.appendChild(task);
}

function loadTasks() {
    const savedTasks = localStorage.getItem("FocusFlowTasks");
    if (savedTasks !== null){
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(function(savedTask) {
            createTask(savedTask.text, savedTask.priority || "Medium", savedTask.completed, savedTask.dueDate || "");
        });
    }
    updateProgress();
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }
    const priority = priorityInput.value;
    const dueDate = dueDateInput.value;
    createTask(taskText, priority, false, dueDate);
    taskInput.value = "";
    dueDateInput.value = "";
        updateProgress();
        saveTasks();
}
 addTaskBtn.addEventListener("click", addTask);
 taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
 });
loadTasks();

const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const studyMinutesInput = document.getElementById("studyMinutes");
const setTimerBtn = document.getElementById("setTimerBtn");
const breakTimerBtn = document.getElementById("breakTimerBtn");
const timerMode = document.getElementById("timerMode");

let timeLeft= 25 * 60;
let timerInterval = null;
let currentMode = "study";

const studyTimeDisplay = document.getElementById("studyTime");
let totalStudySeconds = Number(localStorage.getItem("FocusFlowStudyTime")) || 0;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = 
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}
function updateStudyTimeDisplay() {
    const hours = Math.floor(totalStudySeconds / 3600);
    const minutes = Math.floor((totalStudySeconds % 3600) / 60);
    
    studyTimeDisplay.textContent = hours > 0 ? hours + "h " + minutes + "m": minutes + "m";
}
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}
function startCountdown(minutes, mode) {
    stopTimer();
    currentMode = mode;
    timeLeft = minutes * 60;
    timerMode.textContent = mode === "break" ? "Break time" : "Focus time";
    updateTimerDisplay();

    timerInterval = setInterval(function () {
        timeLeft--;
        if(currentMode === "study"){
            totalStudySeconds++;
            localStorage.setItem("focudFlowStudyTime", totalStudySeconds);
            updateStudyTimeDisplay();
        }
        updateTimerDisplay();
        if(timeLeft <= 0) {
            stopTimer();
            if(currentMode === "break") {
                notifyTimerFinished(
                    "Break is over! Ready to Focus again?"
                );
            } else {
                notifyTimerFinished(
                    "Study session complete! Great work!"
                );
            }
            timerMode.textContent = "Session complete!"
        }
    }, 1000);
}

startBtn.addEventListener("click", function () {
    if (timerInterval !== null || timeLeft <= 0) return;
    currentMode = "study";
    timerMode.textContent = "Focus time";
    timerInterval = setInterval(function () {
        timeLeft--;
        totalStudySeconds++;
        localStorage.setItem("FocusFlowStudyTime", totalStudySeconds);
        updateTimerDisplay();
        updateStudyTimeDisplay();
        if (timeLeft <= 0) {
            stopTimer();
            notifyTimerFinished("Study session complete! Great work!");
            timerMode.textContent = "Session complete!";
        }
    }, 1000);
});
pauseBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", function () {
    stopTimer();
    currentMode = "study";
    const minutes = Number(studyMinutesInput.value);
    timeLeft = Number.isInteger(minutes) && minutes >= 1 && minutes <= 180 ? minutes * 60 : 25 * 60;
    timerMode.textContent = "Ready to Focus?";
    updateTimerDisplay();
});
setTimerBtn.addEventListener("click", function () {
    const minutes = Number(studyMinutesInput.value);
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180)
    {
        alert("Choose a whole number from 1 to 180.");
        return;
    }   
    stopTimer();
    currentMode = "study";
    timeLeft = minutes * 60;
    timerMode.textContent = "Ready to Focus?";
    updateTimerDisplay();
});



pauseBtn.addEventListener("click", function () {
        clearInterval(timerInterval);
        timerInterval = null;
});
resetBtn.addEventListener("click", function () {
    timerMode.textContent = "Ready to Focus?";
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});
breakTimerBtn.addEventListener("click", function() {
    startCountdown(5, "break");
});
updateTimerDisplay();
updateStudyTimeDisplay();

const goalInput = document.getElementById("goalInput");
const savedGoal = localStorage.getItem("FocusFlowGoal");
if (savedGoal !== null) {
    goalInput.value = savedGoal;
}   
goalInput.addEventListener("input", function () {
    localStorage.setItem("FocusFlowGoal", goalInput.value);
   updateProgress();
});

const themeToggle = document.getElementById("themeToggle");
// Load the saved theme
if (localStorage.getItem("FocusFlowTheme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "Light Mode";
}
themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    localStorage.setItem("FocusFlowTheme", isDark ? "dark" : "light");
});
const priorityFilter = document.getElementById("priorityFilter");
priorityFilter.addEventListener("change", function() {
    const selectedPriority = priorityFilter.value;
    const tasks = taskList.querySelectorAll("li");
    tasks.forEach(function(task) {
        const taskPriority = task.dataset.priority || "Medium";
        if (
            selectedPriority ==="All" || 
            taskPriority === selectedPriority
        ) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    });
});
const notificationBtn = document.getElementById("notificationBtn");
notificationBtn.addEventListener("click", async function () {
    if (!("Notification" in window)) {
        alert("Your browser does not support notification.");
        return;
    }
    try{
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            notificationBtn.textContent = "Notification blocked";
            alert("Please allow notifications in your browser settings.");
            return;
        }
        notificationBtn.textContent = "Notification Enabled";
        const testNotification = new Notification("FocusFlow", {
            body: "Notification are working"
        });
        testNotification.onclick = function () {
            window.focus();
        };
        console.log("Test notifiction sent");
    } catch (error) {
        console.error("notification error:", error);
        alert("notification error:" + error.message);
    }
});

function notifyTimerFinished(message) {
    playTimerSound();

    if (!("Notification" in window)) {
       alert(message);
       return;
    }
    if (Notification.permission === "granted") {
        new Notification("FocusFlow", {
            body: message
        });
    }else{
        alert(message);
    }
}
async function playTimerSound() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if(!AudioContextClass) {
        console.log("Audio is not supported")
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
console.log("Notification support:", "Notification" in window);
console.log(
    "Notification permission:",
    "Notification" in window ? Notification.permission : "unsupported"
);
new Notification("FocusFlow Test", {
    body: "Your notifications are working!"
});