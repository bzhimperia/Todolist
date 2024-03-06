function getTasksFromLocalStorage() {
  const tasksJson = localStorage.getItem("tasks");
  return tasksJson ? JSON.parse(tasksJson) : [];
}

function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

let tasks = getTasksFromLocalStorage();
const todolist = document.getElementById("todolist");
const addTaskButton = document.getElementById("addTaskButton");

addTaskButton.addEventListener("click", addTask);

function addTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const dueDate = new Date(document.getElementById("dueDate").value);
  const priority = document.getElementById("priority").value;

  const newTask = { title, description, dueDate, priority };
  tasks.push(newTask);

  updateTodolist();
  saveTasksToLocalStorage(tasks);
}

function updateTodolist() {
  todolist.innerHTML = "";

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");

    // Vérifie si task.dueDate est une instance de Date avant d'appeler toDateString()
    const dueDateStr =
      task.dueDate instanceof Date ? task.dueDate.toDateString() : "N/A";

    listItem.innerHTML = `
            <strong>${task.title}</strong>
            <p>${task.description}</p>
            <p>Due Date: ${dueDateStr}</p>
            <p>Priority: ${task.priority}</p>
            <button type="button" class="edit-button" onclick="editTask(${index})">Edit</button>
            <button type="button" class="delete-button" data-index="${index}">Delete</button>
        `;

    const deleteButton = listItem.querySelector(".delete-button");
    deleteButton.addEventListener("click", () =>
      deleteTask(deleteButton.dataset.index)
    );

    todolist.appendChild(listItem);
  });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  updateTodolist();
  saveTasksToLocalStorage(tasks);
}

function editTask(index) {
  const taskToEdit = tasks[index];

  const editForm = document.createElement("form");

  const createInput = (id, label, type, value) => {
    const inputLabel = document.createElement("label");
    inputLabel.innerText = label;
    const input = document.createElement("input");
    input.id = id;
    input.type = type;
    input.value = value;
    inputLabel.appendChild(input);
    return inputLabel;
  };

  editForm.appendChild(
    createInput("editTitle", "Title:", "text", taskToEdit.title)
  );
  editForm.appendChild(
    createInput(
      "editDescription",
      "Description:",
      "textarea",
      taskToEdit.description
    )
  );
  editForm.appendChild(
    createInput(
      "editDueDate",
      "Due Date:",
      "date",
      taskToEdit.dueDate.toISOString().split("T")[0]
    )
  );

  const prioritySelect = document.createElement("select");
  prioritySelect.id = "editPriority";

  const priorities = ["not urgent", "normal", "urgent"];

  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.text = priority;
    if (priority === taskToEdit.priority) {
      option.selected = true;
    }
    prioritySelect.appendChild(option);
  });

  const priorityLabel = document.createElement("label");
  priorityLabel.innerText = "Priority:";
  priorityLabel.appendChild(prioritySelect);

  editForm.appendChild(priorityLabel);

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.innerText = "Save";
  saveButton.addEventListener("click", () => saveEditedTask(index));

  editForm.appendChild(saveButton);

  const listItem = todolist.childNodes[index];
  listItem.innerHTML = "";
  listItem.appendChild(editForm);
}

function saveEditedTask(index) {
  const editedTask = {
    title: document.getElementById("editTitle").value,
    description: document.getElementById("editDescription").value,
    dueDate: new Date(document.getElementById("editDueDate").value),
    priority: document.getElementById("editPriority").value,
  };

  tasks[index] = editedTask;

  updateTodolist();
  saveTasksToLocalStorage(tasks);
}
