//add mainImg to taskContainer
const taskMain = document.querySelector(".main-tasks");
const mainImg = document.querySelector(".main-img");
const mainImg2 = mainImg.cloneNode(true);
taskMain.insertAdjacentElement("afterbegin", mainImg2);

//get elemtents to the tasks
const title = document.getElementById("title");
const hour = document.getElementById("time");
const comment = document.getElementById("comment");
const btn = document.getElementById("btn-sub");
const message = document.querySelector(".msg-input");
const taskContainer = document.querySelector(".tasks-container");
const importance = document.getElementsByName("importance");
const inputs = [title, hour, comment];
const tasksList = [];

//--- interactive menu ---
const menu = document.querySelectorAll(".header nav ul li ");
const mainForm = document.querySelector(".main-form");
const mainTasks = document.querySelector(".main-tasks");

menu.forEach((item, index) => {
  item.addEventListener("click", () => {
    if (!index) {
      mainForm.classList.remove("hide");
      mainTasks.classList.add("hide");
    } else {
      mainForm.classList.add("hide");
      mainTasks.classList.remove("hide");
    }
  })
})

//--- main validation task ---
const validateInputs = (inputs) => {
  let pass = true;
  inputs.forEach(element => {
    if (element.value === "") {
      element.classList.add("task-input-error");
      element.classList.remove("task-input-pass");
      setMessage("Por favor llene todos los campos", "error");
      pass = false;
    } else {
      element.classList.add("task-input-pass");
      element.classList.remove("task-input-error");
    }
  });
  if (pass) setMessage(null);
  return pass;
}

const createTask = (task) => {
  let time = parseInt(task.time[0] + task.time[1]);
  return `
  <div class="box">
  <div class ="task-header task-header-${task.priorityName}">
    <h4 class="task-time">${time > 12 ? time-12 + task.time.substr(2) : time + task.time.substr(2)} ${time > 12 ? "PM" : "AM"}</h4>
    <h4>${task.priorityName}</h4>
    </div>
    <div class="task">
    <h2 class="task-title">${task.title.toUpperCase()}</h2>
    <p class="task-comment">${task.comment}</p>
    </div>
  </div>`;
}

const getPriority = (importance) => {
  let priority = Array.from(importance).filter((element) => {
    return element.checked;
  });

  let pName = priority.pop().value;
  switch (pName) {
    case "high":
      return {
        level: 1, name: pName
      };
    case "medium":
      return {
        level: 2, name: pName
      };
    case "low":
      return {
        level: 3, name: pName
      };
  }
}

const addTask = (...inputs) => {
  const priority = getPriority(importance);
  const task = {
    title: title.value,
    time: hour.value,
    priorityLevel: priority.level,
    priorityName: priority.name,
    comment: comment.value
  };
  tasksList.push(task);
  taskContainer.innerHTML += createTask(task);
}

const setMessage = (str, opt) => {
  opt = opt || "correct";
  if (opt === "correct") message.className = "msg-input msg-color-pass";
  else message.className = "msg-input msg-color-error";
  message.textContent = str;
}


const disabledButton = (button, option) => {
  button.disabled = option;
}

const clear = (inputs) => {
  inputs.forEach(element => {
    element.value = null;
    element.classList.remove("task-input-error",
      "task-input-pass");
  });
  setMessage(null);
  disabledButton(btn, false);

}

const btnAction = (inputs) => {
  if (validateInputs(inputs)) {
    addTask(inputs);
    setMessage("Tarea ingresa con éxito", "correct");
    disabledButton(btn, true);
    setTimeout(function () {
      clear(inputs);
    }, 1000);
  }
}

btn.addEventListener("click", (e) => {
  e.preventDefault();
  btnAction(inputs);
});

//--- sort tasks ---

const filterTask = priority => {
  return tasksList.filter(item => {
    return item.priorityLevel === priority;
  });
}

const sortTasks = (option) => {
  if (!option) {
    return tasksList.sort((a, b) => {
      return (a.priorityLevel > b.priorityLevel) ? 1 : ((a.priorityLevel === b.priorityLevel) ? ((parseInt(a.time[0] + a.time[1]) > parseInt(b.time[0] + b.time[1])) ? 1 : -1) : -1)
    });
  } else {
    return tasksList.sort((a, b) => {
      return (a.priorityLevel < b.priorityLevel) ? 1 : ((a.priorityLevel === b.priorityLevel) ? ((parseInt(a.time[0] + a.time[1]) > parseInt(b.time[0] + b.time[1])) ? 1 : -1) : -1)
    });
  }
}

const selectOption = item => {
  let temp = "";
  switch (item.id) {
    case "high-low":
      sortTasks(0).forEach(task => {
        temp += createTask(task);
      });
      taskContainer.innerHTML = temp;
      break;
    case "low-high":
      sortTasks(1).forEach(task => {
        temp += createTask(task);
      });
      taskContainer.innerHTML = temp;
      break;
    case "filter-h":
      filterTask(1).forEach(task => {
        temp += createTask(task);
      });
      taskContainer.innerHTML = temp;
      break;
    case "filter-m":
      filterTask(2).forEach(task => {
        temp += createTask(task);
      });
      taskContainer.innerHTML = temp;
      break;
    case "filter-l":
      filterTask(3).forEach(task => {
        temp += createTask(task);
      });
      taskContainer.innerHTML = temp;
      break;
  }
}

const options = document.querySelectorAll("#sort-items option");
options.forEach(item => {
  item.addEventListener("click", () => {
    selectOption(item);
  });
});