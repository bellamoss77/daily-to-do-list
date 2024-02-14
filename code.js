document.addEventListener("DOMContentLoaded", () => {

    const addBtn = document.getElementById('push');
    const inputBox = document.querySelector('.input-task-box');
    const inputDate = document.querySelector('.input-date-box');
    const tasksContainer = document.getElementById('tasks');

    const saveTasks = () => {
        let tasks = [];
        tasksContainer.querySelectorAll('.task').forEach(task => {
            let taskDate = task.getAttribute('data-date');
            let taskText = task.querySelector('span').textContent;
            tasks.push({ taskDate, taskText });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        console.log("Saved tasks:", tasks);
    };

    const createTask = (taskText, taskDate) => {
        if (taskText) {
            if (!taskDate) {
                let addWithoutDate = confirm("Are you sure you want to add this task without a date?");
                if (addWithoutDate) {
                    addToGeneralTasks(taskText);
                } else {
                    inputDate.focus();
                }
                return;
            }
            let dateHeader = document.getElementById(`date-${taskDate}`);
            if (!dateHeader) {
                dateHeader = document.createElement('h3');
                dateHeader.id = `date-${taskDate}`;

                const dateParts = taskDate.split('-');
                const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
                dateHeader.textContent = formattedDate;

                tasksContainer.appendChild(dateHeader);
            }

            const taskItem = document.createElement('div');
            taskItem.className = 'task';
            taskItem.setAttribute('data-date', taskDate);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';

            const taskContent = document.createElement('span');
            taskContent.textContent = taskText;

            checkbox.addEventListener('change', () => {
                taskContent.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
            });

            tasksContainer.appendChild(taskItem);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                taskItem.remove();

                let remainingTasks = tasksContainer.querySelectorAll('.task');
                let isLastTask = true;
                remainingTasks.forEach(task => {
                    if (task.getAttribute('data-date') === taskDate) {
                        isLastTask = false;
                    }
                });

                if (isLastTask) {
                    dateHeader.remove();
                }

                saveTasks();
            });

            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskContent);
            taskItem.appendChild(deleteBtn);

            tasksContainer.appendChild(taskItem);
            
        }
        saveTasks();
    
    };

    const addToGeneralTasks = (taskText) => {
        const generalTasksContainer = document.getElementById('generalTasks');
        if (!generalTasksContainer) {
            console.error('General tasks container not found');
            return;
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
    
        const taskItem = document.createElement('div');
        taskItem.className = 'task';
    
        const taskContent = document.createElement('span');
        taskContent.textContent = taskText;
    
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            taskItem.remove();
            saveTasks();
            // Check after the task is deleted
            if (generalTasksContainer.children.length === 1) { // Only the header remains
                generalTasksContainer.classList.remove('active');
            }
        });

        checkbox.addEventListener('change', () => {
            taskContent.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
        });
    
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(deleteBtn);
    
        generalTasksContainer.appendChild(taskItem);
    
        // Add the active class right after adding a task
        if (!generalTasksContainer.classList.contains('active')) {
            generalTasksContainer.classList.add('active');
        }
    };
    

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks && Array.isArray(tasks)) {
            console.log("Loaded tasks:", tasks);
            tasks.forEach(({ taskText, taskDate }) => {
                createTask(taskText, taskDate);
            });
        } else {
            console.log("No valid tasks found in local storage");
        }
    };

    addBtn.addEventListener('mousedown', () => {
        addBtn.style.transform = 'scale(0.95)';
    });

    addBtn.addEventListener('mouseup', () => {
        addBtn.style.transform = 'scale(1)';
    });

    addBtn.addEventListener('click', () => {
        createTask(inputBox.value.trim(), inputDate.value);
        inputBox.value = "";
        inputDate.value = "";
    });

    inputBox.addEventListener('keypress', (event) => {
        if (event.keyCode === 13) { // Enter key code
            createTask(inputBox.value.trim(), inputDate.value);
            inputBox.value = "";
            inputDate.value = "";
        }
    });

    loadTasks();
});

