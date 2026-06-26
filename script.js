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

// ===================== RENDER =====================

function renderTasks() {
  taskList.innerHTML = "";
  let filtered = tasks;
  if (filter === "Active")
    filtered = tasks.filter(task => !task.completed);
  if (filter === "Completed")
    filtered = tasks.filter(task => task.completed);

  const keyword = searchTask.value.toLowerCase();

  filtered = filtered.filter(task =>
    task.text.toLowerCase().includes(keyword)
  );

  filtered.forEach((task, index) => {
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
                <div class="task-text">
                    ${task.text}
                </div>
                <div class="task-extra">
                    ${task.date
        ?
        `<span class="badge date">
                            📅 ${task.date}
                        </span>`
        :
        ""
      }
                    <span class="badge ${task.priority.toLowerCase()}">
                        ${task.priority}
                    </span>
                </div
            </div>
        </div>

        <button class="delete-btn">
            <i class="fa-solid fa-trash"></i>
        </button>
        `;

    // checkbox

    li.querySelector(".task-checkbox")
      .addEventListener("change", () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      });

    // delete

    li.querySelector(".delete-btn")
      .addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

    taskList.appendChild(li);

  });

  taskCount.textContent = `${tasks.length} Tasks`;
  emptyState.classList.toggle(
    "show",
    filtered.length === 0
  );
}

// ===================== ADD =====================

addTask.addEventListener("click", (e) => {
  e.preventDefault();
  if (taskInput.value.trim() === "") {
    alert("Enter a task");
    return;
  }

  tasks.unshift({
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

// ===================== SEARCH =====================

searchTask.addEventListener("input", renderTasks);