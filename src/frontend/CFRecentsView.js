/**
 * View to display recent Curve Fitter tasks.
 */
import { Events } from './Events.js';
import { getAll,  saveRecent, deleteRecent, updateRecent } from './ServerProxy.js';
import { displayResults } from './CFResultsView.js';

export class CFRecentsView {
  #events = null;

  static recentsView = null;

  static instance() {
    if (this.recentsView == null) {
      this.recentsView = new CFRecentsView();
    }
    return this.recentsView;
  }

  constructor() {
    this.#events = Events.events();
  }

  async render() {
    // Create the root element
    const cfRecentsViewElm = document.createElement('div');
    cfRecentsViewElm.id = 'recents-list-view';

    const titleElm = document.createElement('h1');
    titleElm.innerText = 'Choose from Recents';

    const cfRecentsContainerElm = document.createElement('div');
    cfRecentsContainerElm.id = 'recents-list-container';

    cfRecentsViewElm.appendChild(titleElm);
    cfRecentsViewElm.appendChild(cfRecentsContainerElm);

    const recentsList = new RecentsList();
    cfRecentsContainerElm.appendChild(await recentsList.render());

    cfRecentsViewElm.appendChild(cfRecentsContainerElm);

    const generateButtonElm = document.createElement('button');
    generateButtonElm.classList.add('button');

    generateButtonElm.id = 'new-button';
    generateButtonElm.innerText = 'New Combination..';
    generateButtonElm.addEventListener('click', () => {
        this.#publish('show-new-view', null);
    });

    cfRecentsViewElm.appendChild(generateButtonElm);
    return cfRecentsViewElm;
  }

  subscribe(event, handler){
    
    if(!this.#events[event]){
        this.#events[event] = []
    }
    this.#events[event].push(handler)
  }

  #publish(event, data){
    if(this.#events[event]){
        this.#events[event].forEach(handler => handler(data));
    }
  }
}

/**
 * Represents data for the recent Curve Fitter tasks list.
 */
class RecentsList {

  async render() {
    // Create the root element
    const recentsElm = document.createElement('div');
    recentsElm.id = 'recents-list';

    const taskList = new TaskList();
    const taskListElm = await taskList.render();

    recentsElm.appendChild(taskListElm);
    return recentsElm;
  }
}

export class TaskList {  
  #events = null;
  #tasks = null;
  #list = null;

  constructor() {
    this.#events = Events.events();
    this.subscribe('add-to-recents', data => this.#addToRecents(data));
  }

  #addToRecents(d) {
    if (this.#save(d)) {
      this.#tasks.push(d);
      const li = this.#makeTaskItem(d);
      this.#list.appendChild(li);  
    } else {
      alert (' could not add to recents list. Error has occured');
    }
  }

  subscribe(event, handler){
    if(!this.#events[event]){
        this.#events[event] = []
    }
    this.#events[event].push(handler)
  }

  async render() {
    this.#tasks = await this.#getTasks();
    const taskListElm = document.createElement('div');
    taskListElm.id = 'task-list';

    this.#list = document.createElement('ul');
    const listItems = this.#tasks.map(task => this.#makeTaskItem(task));

    listItems.forEach(li => this.#list.appendChild(li));
    taskListElm.appendChild(this.#list);
    return taskListElm;
  }

  #clickRecents(event) {
    let recent = event.target.innerText;
    if (recent != null) {
      const cfPair = recent.split(":");
      let data = {};
      data.coordinates = cfPair[0];
      displayResults(data);
    }
  }

  /**
   * 
   * Deletes a recent Curve Fitter task.
   */  
  #deleteRecents(event) {
    let id = event.target.id;
    deleteRecent(id).then (success => {
      if (success) {
        location.reload();
      } else {
        alert (`incorrect id to delete: ${id}` );
      }
    })
    .catch (err => alert (` incorrect id to delete: ${id} ${err}`))
  }

  /**
   * 
   * Updates the priority for a recent Curve Fitter task.
   */
  #prioritize(event) {
    let id = event.target.id;
    updateRecent(id, event.target.checked).then (success => {
      if (success) {
        location.reload();
      } else {
        alert (`incorrect id to update : ${id}` );
      }
    })
    .catch (err => alert (` incorrect id to delete: ${id} ${err}`))
  }

  #makeTaskItem(task) {
    const li = document.createElement('li');

    const priorityBox = document.createElement('input');
    priorityBox.type = 'checkbox';
    priorityBox.id = task.id;
    priorityBox.checked = (task.priority === 'true');
    li.appendChild(priorityBox);

    const aElm = document.createElement('button');
    aElm.classList.add('no_border_button');
    aElm.innerText = task.coordinates + ":" + task.family;
    aElm.id = task.id;
    li.appendChild(aElm)

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('no_border_button');
    deleteButton.innerText ='Delete';
    deleteButton.classList.add('delete_button');
    deleteButton.id = task.id;
    li.appendChild(deleteButton)

    aElm.addEventListener("click", this.#clickRecents);
    deleteButton.addEventListener("click", this.#deleteRecents);
    priorityBox.addEventListener("click", this.#prioritize);

    return li;
  }

  /**
   * 
   * Retrieves all the recent Curve Fitter tasks from the database.
   */
  async #getTasks() {
    const response = await getAll();
    if (response != null) {
      return this.#parse(response);
    } else {
      return [];
    }
  }

  /**
   * 
   * Saves a newly created Curve Fitter task.
   */  
  async #save(t) {
    let success = false;

    let j = `{"coordinates" : "${t.coordinates}", "family" : "${t.family}", "priority" : "false" }`
    await saveRecent(j).then (response => {
      if (response.status === 200) {
        success = true;
      }
    })
    .catch (err => { 
      console.log (err);
    });
    return success;
  }

  /**
   * 
   * Parses the data from DB to display in the UI.
   */
  #parse(j) {
    let obj = JSON.parse(j)
    const tasks = obj.map(t => new Task(t.task.coordinates, t.task.family, t._id, t.task.priority));
    return tasks;
  }
}

/**
 * Repreesnts visual representation of a Curve Fitter task 
 */
class Task {
  constructor(coordinates, family, id, priority) {
    if (id === undefined) {
      this.id = Math.random().toString(36);
    } else {
      this.id = id;
    }
    this.coordinates = coordinates;
    this.family = family;
    this.priority = priority;
  }
}
