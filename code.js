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
        if (taskText && taskDate) {
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

