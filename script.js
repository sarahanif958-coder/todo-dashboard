document.addEventListener('DOMContentLoaded', () => {
  const newTaskInput = document.getElementById('new-task-input');
  const newTaskDateInput = document.getElementById('new-task-date-input'); 
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00'); 
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  const createTaskElement = (task) => {
    const listItem = document.createElement('li');
    listItem.className = 'task-item';
    listItem.dataset.id = task.id;
    const taskContent = document.createElement('div'); 
    taskContent.className = 'task-content';
    const taskTextSpan = document.createElement('span');
    taskTextSpan.className = 'task-text';
    taskTextSpan.textContent = task.text;
    if (task.completed) {
      taskTextSpan.classList.add('completed');
    }
    const taskDateSpan = document.createElement('span'); 
    taskDateSpan.className = 'task-date';
    if (task.dueDate) {
      taskDateSpan.textContent = `Due: ${formatDate(task.dueDate)}`;
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      const dueDate = new Date(task.dueDate + 'T00:00:00'); 
      if (dueDate < today && !task.completed) {
        taskDateSpan.classList.add('overdue');
      }
    }
    taskContent.append(taskTextSpan, taskDateSpan); 
    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';
    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'; // Check icon
    completeBtn.title = task.completed ? 'Mark Incomplete' : 'Mark Complete';
    completeBtn.addEventListener('click', () => toggleCompleteTask(task.id));
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>'; // Edit icon
    editBtn.title = 'Edit Task';
    editBtn.addEventListener('click', () => enableEditMode(task.id, taskContent)); 
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'; // Trash icon
    deleteBtn.title = 'Delete Task';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    taskActions.append(completeBtn, editBtn, deleteBtn);
    listItem.append(taskContent, taskActions); 
    return listItem;
  };
  const renderTasks = () => {
    taskList.innerHTML = ''; 
    tasks.forEach(task => {
      taskList.append(createTaskElement(task));
    });
  };
  const addTask = () => {
    const taskText = newTaskInput.value.trim();
    const taskDueDate = newTaskDateInput.value; 

    if (taskText === '') {
      alert('Task cannot be empty!');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      dueDate: taskDueDate, 
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    taskList.append(createTaskElement(newTask)); 
    newTaskInput.value = ''; 
    newTaskDateInput.value = ''; 
    newTaskInput.focus();
  };
  const enableEditMode = (id, taskContentDiv) => { 
    const taskItem = taskContentDiv.closest('.task-item');
    const currentTask = tasks.find(task => task.id === id);
    if (!currentTask) return;
    const editInputGroup = document.createElement('div'); 
    editInputGroup.className = 'edit-input-group';
    const editTextInput = document.createElement('input');
    editTextInput.type = 'text';
    editTextInput.className = 'edit-input';
    editTextInput.value = currentTask.text;
    const editDateInput = document.createElement('input'); 
    editDateInput.type = 'date';
    editDateInput.className = 'edit-input';
    editDateInput.value = currentTask.dueDate || ''; 
    editInputGroup.append(editTextInput, editDateInput); 
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => saveEditedTask(id, editTextInput.value, editDateInput.value)); 
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-btn';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => renderTasks()); 
    const editActions = document.createElement('div');
    editActions.className = 'task-actions';
    editActions.append(saveBtn, cancelBtn);
    taskItem.innerHTML = '';
    taskItem.append(editInputGroup, editActions); 
    editTextInput.focus();
  };
  const saveEditedTask = (id, newText, newDueDate) => { 
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
      tasks[taskIndex].text = newText.trim();
      tasks[taskIndex].dueDate = newDueDate; 
      saveTasks();
      renderTasks(); 
    }
  };
  const toggleCompleteTask = (id) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      saveTasks();
      renderTasks(); 
    }
  };
  const deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks(); 
  };
  addTaskBtn.addEventListener('click', addTask);
  newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });
  newTaskDateInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') {
      addTask();
    }
  });
  renderTasks();
});