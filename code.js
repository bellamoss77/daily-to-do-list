document.addEventListener("DOMContentLoaded", () => {

    const addBtn = document.getElementById('push');
    const inputBox = document.querySelector('.input-task-box');
    const inputDate = document.querySelector('.input-date-box');
    const tasksContainer = document.getElementById('tasks');

    const createTask = () => {
        const taskText = inputBox.value.trim();
        const taskDate = inputDate.value;

        if (taskText && taskDate) {
            let dateHeader = document.getElementById(`date-${taskDate}`);
            if (!dateHeader) {
                dateHeader = document.createElement('h3');
                dateHeader.id = `date-${taskDate}`;

                const date = new Date(taskDate);
                const offset = date.getTimezoneOffset();
                const adjustedDate = new Date(date.getTime() - (offset*60*1000));
                dateHeader.textContent = adjustedDate.toISOString().split('T')[0];
                
                tasksContainer.appendChild(dateHeader);
                console.log("Date header created:", dateHeader);
            }

            const taskItem = document.createElement('div');
            taskItem.className = 'task';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';

            const taskContent = document.createElement('span');
            taskContent.textContent = taskText;

            checkbox.addEventListener('change', () => {
                taskContent.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                taskItem.remove();

                let remainingTasks = tasksContainer.querySelectorAll('.task');
                let isLastTask = true;
                remainingTasks.forEach(task => {
                    if (task.querySelector('span').textContent !== taskText) {
                        isLastTask = false;
                    }
                });

                if (isLastTask) {
                    dateHeader.remove();
                }
            });

            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskContent);
            taskItem.appendChild(deleteBtn);

            tasksContainer.appendChild(taskItem);
            inputBox.value = "";
        }
    };

    addBtn.addEventListener('mousedown', () => {
        addBtn.style.transform = 'scale(0.95)';
    });

    addBtn.addEventListener('mouseup', () => {
        addBtn.style.transform = 'scale(1)';
    });

    addBtn.addEventListener('click', createTask);

    inputBox.addEventListener('keypress', (event) => {
        if (event.keyCode === 13) { // Enter key code
            createTask();
        }
    });
});

