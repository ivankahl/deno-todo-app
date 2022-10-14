/**
 * Helper function that sorts tasks by completed
 * @param {Array} tasks The array of tasks to sort and format
 * @returns
 */
 function sortTasks(tasks) {
  return tasks.sort((a, b) => (a.complete > b.complete) ? 1 : -1);
}

function taskApp() {
  return {
    newTask: {
      description: "",
      dueDate: null,
    },
    tasks: [],
    editingTaskId: null,
    async loadTasks() {
      const result = await fetch("/api/tasks");

      this.tasks = sortTasks(await result.json());
    },
    async createTask() {
      // Create the new task
      const result = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          description: this.newTask.description,
        }),
      });

      // Add the task to our task list
      this.tasks.push(await result.json());
      this.tasks = sortTasks(this.tasks);

      // Reset the form
      this.newTask.description = "";
    },
    async updateTaskComplete(task) {
  const result = await fetch(`/api/tasks/${task.id}/complete`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      // Remember we bind .complete to the checkbox. So if they checked
      // the box, it means we need to complete the task. If they unchecked
      // the task we need to uncomplete the task
      complete: task.complete
    })
  });

      // Replace the task
      const index = this.tasks.findIndex((x) => x.id == task.id);
      this.tasks[index] = await result.json();

      this.tasks = sortTasks(this.tasks);
    },
    async updateTask(task) {
      const result = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          description: task.description,
        }),
      });

      // Replace the task
      const index = this.tasks.findIndex((x) => x.id == task.id);
      this.tasks[index] = await result.json();

      this.editingTaskId = null;
    },
    async deleteTask(task) {
      await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      this.tasks = this.tasks.filter((x) => x.id !== task.id);
      this.tasks = sortTasks(this.tasks);
    },
  };
}
