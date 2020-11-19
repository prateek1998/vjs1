// Project class
class Project {
  constructor(title, desc, status) {
    this.title = title;
    this.desc = desc;
    this.status = status;
  }
}

// UI Class
class UI {
  static displayProject() {
    const storeProject = Storage.getProject();
    storeProject.forEach((project) => UI.addProjecttoList(project));
  }

  static addProjecttoList(project) {
    const projectList = document.getElementById("project-list");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${project.title}</td>
        <td>${project.desc}</td>
        <td>${project.status}</td>
        <td><button class= "delete">X</button></td>
        `;

    projectList.appendChild(row);
    
  }

  static resetFields() {
    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("status").value = "";
  }

  static deleteProject(e) {
    if (e.classList.contains("delete")) {
      e.parentElement.parentElement.remove();
      Storage.removeProject(e.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent)
      UI.showAlert("Successfully Deleted ", "success");
    }
  }

  static showAlert(msg, classname) {
    const div = document.createElement("div");
    const strong = document.createElement("strong");
    div.className = `alert alert-${classname} alert-white rounded`;
    div.appendChild(document.createTextNode(msg));
    const container = document.querySelector(".container");
    const form = document.getElementById("project-form");
    container.insertBefore(div, form);
    //remove after 2 sec
    setTimeout(() => {
      document.querySelector('.alert').remove()
    }, 2000);
  }
}

// Store Class
class Storage{
  static getProject(){
    let project ;
    if(localStorage.getItem('projects') === null){
      project = [];
    }
    else{
      project = JSON.parse(localStorage.getItem('projects'))
    }
    return project;
    
  }
  static addProject(project){
    const projects = Storage.getProject();
    projects.push(project);
    localStorage.setItem('projects',JSON.stringify(projects));
    
  }
  static removeProject(title){
    const projects = Storage.getProject();
    projects.forEach((project,index)=>{
      if(project.title === title){
        projects.splice(index,1);
      }
    });
    localStorage.setItem('projects',JSON.stringify(projects));
  }
}
// Displaying Projects
document.addEventListener("DOMContentLoaded", UI.displayProject);

// Adding Project
document.getElementById("project-form").addEventListener("submit", (e) => {
  //prevent submit
  e.preventDefault();

  //Getting Data
  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;
  const status = document.getElementById("status").value;

  if (title === "" || desc === "" || status === "") {
    UI.showAlert("Please fill up the fields", "danger");
  } else {
    //Project initiation
    const project = new Project(title, desc, status);

    // Add Project to UI
    UI.addProjecttoList(project);
    
    // Add Project to Storage
    Storage.addProject(project);
    
    UI.showAlert("Successfully Added", "success");
    // Reset the fields
    UI.resetFields();
  }
});

// Deleting Project
document.getElementById("project-list").addEventListener("click", (e) => {
  UI.deleteProject(e.target);
});
