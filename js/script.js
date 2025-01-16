
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const categorySelect = document.getElementById('category-select');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksContainer = document.getElementById('tasks');
    const filterBtns = document.querySelectorAll('.filter-btn');

    const getTasks = () => JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks));

    const renderTasks = (filter = 'all') => {
        tasksContainer.innerHTML = '';
        const tasks = getTasks();

        tasks
            .filter(task => filter === 'all' || task.category === filter)
            .forEach(task => {
                const taskEl = document.createElement('li');
                taskEl.innerHTML = `
                    <span>${task.text} - <em>${task.category}</em></span>
                    <div>
                        <button class=\"complete-btn\">${task.completed ? 'Ongedaan maken' : 'Voltooid'}</button>
                        <button class=\"delete-btn\">Verwijder</button>
                    </div>
                `;

                if (task.completed) taskEl.style.textDecoration = 'line-through';

                taskEl.querySelector('.complete-btn').addEventListener('click', () => {
                    task.completed = !task.completed;
                    saveTasks(tasks);
                    renderTasks(filter);
                });

                taskEl.querySelector('.delete-btn').addEventListener('click', () => {
                    const updatedTasks = tasks.filter(t => t !== task);
                    saveTasks(updatedTasks);
                    renderTasks(filter);
                });

                tasksContainer.appendChild(taskEl);
            });
    };

    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        const category = categorySelect.value;

        if (text) {
            const tasks = getTasks();
            tasks.push({ text, category, completed: false });
            saveTasks(tasks);
            taskInput.value = '';
            renderTasks();
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTasks(btn.dataset.category);
        });
    });

    renderTasks();
});
