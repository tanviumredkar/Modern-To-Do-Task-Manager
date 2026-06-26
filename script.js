// ===================== ELEMENTS =====================

const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const addTask = document.getElementById("addTask");
const taskList = document.querySelector(".task-list");
const taskCount = document.getElementById("taskCount");
const emptyState = document.querySelector(".empty-state");
const searchTask = document.getElementById("searchTask");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearBtn = document.querySelector(".clear-btn");
const clock = document.getElementById("clock");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "All";

// ===================== CLOCK =====================

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

setInterval(updateClock, 1000);
updateClock();

// ===================== SAVE =====================

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function normalizeTasks() {
  tasks = tasks.map((task, index) => ({
    id: task.id || `${Date.now()}-${index}`,
    text: task.text || "",
    date: task.date || "",
    completedDate: task.completedDate || "",
    priority: task.priority || "Low",
    completed: Boolean(task.completed)
  }));
}

normalizeTasks();

// ===================== FILTERS =====================

function setActiveFilterButton() {
  filterBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.textContent.trim() === filter);
  });
}

function getFilteredTasks() {
  const keyword = searchTask.value.toLowerCase();

  return tasks.filter((task) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Active" && !task.completed) ||
      (filter === "Completed" && task.completed);

    const matchesSearch = task.text.toLowerCase().includes(keyword);
    return matchesFilter && matchesSearch;
  });
}

// ===================== RENDER =====================

function renderTasks() {
  taskList.innerHTML = "";
  const filtered = getFilteredTasks();
  setActiveFilterButton();

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <div class="task-left">
        <input
          type="checkbox"
          class="task-checkbox"
          ${task.completed ? "checked" : ""}
        >
        <div class="task-content">
          <div class="task-text">${task.text}</div>
          <div class="task-extra">
            ${task.date
              ? `<span class="badge date">📅 Due: ${task.date}</span>`
              : ""
            }
            ${task.completed && task.completedDate
              ? `<span class="badge low">✅ Done: ${task.completedDate}</span>`
              : ""
            }
            <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span>
          </div>
        </div>
      </div>

      <button class="delete-btn" type="button">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    li.querySelector(".task-checkbox").addEventListener("change", () => {
      task.completed = !task.completed;
      task.completedDate = task.completed ? new Date().toLocaleDateString() : "";
      saveTasks();
      renderTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });

  const countLabel = filtered.length === 1 ? "Task" : "Tasks";
  taskCount.textContent = `${filtered.length} ${countLabel}`;
  emptyState.classList.toggle("show", filtered.length === 0);
}

// ===================== ADD =====================

addTask.addEventListener("click", (e) => {
  e.preventDefault();
  if (taskInput.value.trim() === "") {
    alert("Enter a task");
    return;
  }

  tasks.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text: taskInput.value,
    date: dueDate.value,
    priority: priority.value,
    completed: false
  });

  taskInput.value = "";
  dueDate.value = "";
  priority.value = "Low";
  saveTasks();
  renderTasks();
});

// ===================== FILTERS =====================

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.textContent.trim();
    renderTasks();
  });
});

// ===================== CLEAR COMPLETED =====================

clearBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  filter = "All";
  saveTasks();
  renderTasks();
});

// ===================== SEARCH =====================

searchTask.addEventListener("input", renderTasks);

renderTasks();