//====================================================
//              All DOM Elements
//====================================================
const form = document.getElementById("form");
const taskText = document.getElementById("task-input");
const date = document.getElementById("date");
const heading = document.getElementById("heading");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search");
const pendingTask = document.getElementById("pending");

//====================================================
//              All Required Variables
//====================================================
let allTasks = [
    { id: 1, task: "Finish project report", date: "2024-08-05", priority: "high", completed: false },
    { id: 2, task: "Buy groceries", date: "2024-08-02", priority: "low", completed: false },
    { id: 3, task: "Call John", date: "2024-08-03", priority: "average", completed: false },
    { id: 4, task: "Submit tax forms", date: "2024-08-10", priority: "high", completed: false },
    { id: 5, task: "Plan vacation", date: "2024-08-12", priority: "low", completed: false },
    { id: 6, task: "Schedule dentist appointment", date: "2024-08-15", priority: "average", completed: false },
    { id: 7, task: "Renew car insurance", date: "2024-08-18", priority: "high", completed: false },
    { id: 8, task: "Finish reading book", date: "2024-08-20", priority: "low", completed: false },
    { id: 9, task: "Organize garage", date: "2024-08-25", priority: "average", completed: false },
    { id: 10, task: "Write blog post", date: "2024-08-30", priority: "high", completed: false }
];

let editIndex = null; // To track the task being edited
let draggedItemIndex = null; // To track the index of the dragged item

//====================================================
//              All Functions
//====================================================

// 1- Function to submit form
const submitForm = e => {
    e.preventDefault();
    if (form.classList.contains("add")) {
        addTask();
    } else if (form.classList.contains("update")) {
        updateTask();
    }
};

// 2- Function to add task
const addTask = () => {
    const priority = document.querySelector('input[name="priority"]:checked').value.trim();
    const task = {
        id: Date.now(),
        task: taskText.value.trim(),
        date: date.value.trim(),
        priority: priority,
        completed: false
    };
    allTasks.push(task);
    console.log(allTasks);
    
    // Clear the form
    form.reset();
    form.classList.remove("update");
    form.classList.add("add");

    renderTasks();
};

// 3- Function to render tasks
const renderTasks = (filtered = "", showPending = false) => {
    taskList.innerHTML = '';
    allTasks
        .filter(task => {
            const matchesFilter = task.task.toLowerCase().includes(filtered.toLowerCase());
            const matchesPending = !showPending || !task.completed;
            return matchesFilter && matchesPending;
        })
        .forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.setAttribute('data-index', index);
            taskItem.setAttribute('draggable', 'true');
            taskItem.innerHTML = `
                <div class="details">
                    <p>${task.task}</p>
                    <p>Due Date: ${task.date}</p>
                    <p>Priority: ${task.priority}</p>
                    <p>Completed: ${task.completed ? 'Yes' : 'No'}</p>
                    <div class="controls">
                        <button class="btn task-update" data-index="${index}">Update</button>
                        <button class="btn task-delete" data-index="${index}">Delete</button>
                    </div>
                    <i class="fa-solid fa-grip-lines"></i>
                </div>
            `;
            taskItem.addEventListener('dragstart', handleDragStart);
            taskItem.addEventListener('dragover', handleDragOver);
            taskItem.addEventListener('drop', handleDrop);
            taskItem.addEventListener('dragend', handleDragEnd);
            taskList.appendChild(taskItem);
        });

    document.querySelectorAll('.task-update').forEach(btn => {
        btn.addEventListener('click', editTask);
    });
    document.querySelectorAll('.task-delete').forEach(btn => {
        btn.addEventListener('click', deleteTask);
    });
};

// 4- Function to delete task
const deleteTask = e => {
    const index = e.target.dataset.index;
    allTasks.splice(index, 1);
    renderTasks();
};

// 5- Function to edit task
const editTask = e => {
    const index = e.target.dataset.index;
    const task = allTasks[index];
    taskText.value = task.task;
    date.value = task.date;
    document.querySelector(`input[name="priority"][value="${task.priority}"]`).checked = true;
    form.classList.remove("add");
    form.classList.add("update");
    heading.innerHTML = `<h2>Update Your task</h2>`
    editIndex = index; // Store the index of the task being edited
};

// 6- Function to update task
const updateTask = () => {
    const priority = document.querySelector('input[name="priority"]:checked').value.trim();
    const completed = document.querySelector('input[name="completed"]:checked').value.trim();
    const task = {
        id: allTasks[editIndex].id,
        task: taskText.value.trim(),
        date: date.value.trim(),
        priority: priority,
        completed: completed === "true"
    };
    allTasks[editIndex] = task;
    form.reset();
    form.classList.remove("update");
    form.classList.add("add");
    heading.innerHTML = `<h2>Add Your task</h2>`
    editIndex = null;
    renderTasks();
};

// 7- Function to search tasks
const search = () => {
    const searchValue = searchInput.value.trim().toLowerCase();
    renderTasks(searchValue);
};

// 8- Drag and Drop Handlers
const handleDragStart = e => {
    draggedItemIndex = e.target.dataset.index;
    e.target.classList.add('dragging');
};

const handleDragOver = e => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    const currentHoveredItem = e.target.closest('.task-item');

    if (currentHoveredItem && draggingItem !== currentHoveredItem) {
        const bounding = currentHoveredItem.getBoundingClientRect();
        const offset = e.clientY - bounding.top + window.scrollY;

        if (offset > bounding.height / 2) {
            currentHoveredItem.after(draggingItem);
        } else {
            currentHoveredItem.before(draggingItem);
        }
    }
};

const handleDrop = e => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    draggingItem.classList.remove('dragging');

    const newIndex = Array.from(taskList.children).indexOf(draggingItem);
    const [reorderedItem] = allTasks.splice(draggedItemIndex, 1);
    allTasks.splice(newIndex, 0, reorderedItem);

    renderTasks();
};

const handleDragEnd = e => {
    e.target.classList.remove('dragging');
};

// 9 - Function to show all pending tasks
const getPendingTasks = showPending => {
    renderTasks("", showPending);
};

// 10 - Clear Form 

const clearForm = () => {
    form.reset();
    heading.innerHTML = `<h2>Add Your task</h2>`
    form.classList.remove("update");
    form.classList.add("add");
    
}

//====================================================
//              All Event Listeners
//====================================================

// 1- Event Listener to submit form
form.addEventListener("submit", submitForm);
form.addEventListener("reset",clearForm)

// 2- Event Listener for live search input
searchInput.addEventListener("input", search);

// 3- Event Listener to get pending tasks
pendingTask.addEventListener("change", (e) => {
    if (e.target.checked) {
        console.log("Event Triggered");
        getPendingTasks(true);
    } else {
        getPendingTasks(false);
    }
});

//====================================================
//              Init
//====================================================

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});
