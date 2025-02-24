document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

let tasks = [];
let taskChart = null;

function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    // Update progress bar
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    document.querySelector('.progress-fill').style.width = `${progress}%`;
    
    // Update statistics display
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    
    // Update chart data if chart exists
    if (taskChart) {
        taskChart.data.datasets[0].data = [completedTasks, totalTasks - completedTasks];
        taskChart.update();
    }
}

function initializeChart() {
    const ctx = document.getElementById('taskChart').getContext('2d');
    taskChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#10b981', '#f59e0b'],
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f8fafc',
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    titleFont: { size: 16 },
                    bodyFont: { size: 14 },
                    padding: 12
                }
            }
        }
    });
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (!taskText) return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date()
    };

    tasks.push(newTask);
    taskInput.value = '';
    saveTasks();
    renderTasks();
    updateStats();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <i class="fas fa-grip-vertical"></i>
            <div class="task-content">
                <span class="task-text ${task.completed ? 'completed' : ''}" 
                      onclick="toggleTask(${task.id})">
                    ${task.text}
                </span>
            </div>
            <div class="task-actions">
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? {...task, completed: !task.completed} : task
    );
    saveTasks();
    renderTasks();
    updateStats();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
    initializeChart();
    renderTasks();
    updateStats();
}

function updateDateTime() {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    document.getElementById('dateTime').textContent = 
        new Date().toLocaleDateString('en-US', options);
}