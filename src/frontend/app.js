/**
 * ExpressJS App
 */
import { CFGenerateView } from './CFGenerateView.js';
import { CFRecentsView } from './CFRecentsView.js';
import { CFResultsView } from './CFResultsView.js';
import { Events } from './Events.js';


export class App {
  #generateViewElm = null;
  #recentsViewElm = null;
  #resultsViewElm = null;
  #mainViewElm = null;
  #rootElm = null;
  #isNewView = true
  #events = null;

  static app = null;

  constructor() {
    this.#events = Events.events();
    const newViewSubscriber = new CFGenerateView()
    const recentsViewSubscriber = CFRecentsView.instance();

    // Registers subscribers to handle view changes.
    newViewSubscriber.subscribe('show-recents-view', data => this.switchToRecentsView());
    recentsViewSubscriber.subscribe('show-new-view', data => this.switchToNewView());

  }

  static instance() {
    if (this.app == null) {
      this.app = new App();
    }
    return this.app;
  }
  
  /**
   * Switch to view to enter a new task.
   */
  async switchToNewView() {
    this.#isNewView = true;
    this.#updateView();
  }

  /**
   * Switch to view to view the recent tasks.
   */
  async switchToRecentsView () {
    this.#isNewView = false;
    this.#updateView();
  }


  /**
   * Renders views.
   */
  async render(root) {
    this.#rootElm = document.getElementById(root);
    this.#rootElm.innerHTML = '';

    this.#mainViewElm = document.createElement('div');
    this.#mainViewElm.id = 'main-view';
    this.#mainViewElm.classList.add('main-view');

    this.#rootElm.appendChild(this.#mainViewElm);

    const generateView = new CFGenerateView();
    this.#generateViewElm = await generateView.render();


    const recentsView = new CFRecentsView();
    this.#recentsViewElm = await recentsView.render();

    const resultsView = new CFResultsView();
    this.#resultsViewElm = await resultsView.render();

    await this.#updateView()
    this.#mainViewElm.appendChild(this.#generateViewElm);
    this.#mainViewElm.appendChild(this.#recentsViewElm);
    this.#mainViewElm.appendChild(this.#resultsViewElm);
    
  }

  async #updateView() {
    if (this.#isNewView) {
      this.#generateViewElm.style.display = 'inline';
      this.#recentsViewElm.style.display = 'none';
    } else {
      this.#generateViewElm.style.display = 'none';
      this.#recentsViewElm.style.display = 'inline';
    }
  }
}
