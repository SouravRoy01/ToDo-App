/* eslint-disable no-undef */
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

class Todos {
  constructor(listName, initData, helpers) {
    this.listName = listName;
    this.record = initData;
    this.helpers = helpers;
    this.list = document.querySelector('.myList');
    this.mount = this.mount.bind(this);
    this.unmount = this.unmount.bind(this);
    this.createNode = this.createNode.bind(this);
    this.createText = this.createText.bind(this);
    this.autoResize = this.autoResize.bind(this);
    this.attachToDOM = this.attachToDOM.bind(this);
  }

  mount() {
    const addButton = document.querySelector('#add');
    const taskInput = document.querySelector('.inputTask');
    this.addEventHandler = this.helpers.add(this.listName);
    addButton.addEventListener('click', this.addEventHandler);
    taskInput.addEventListener('keydown', this.addEventHandler);
    this.attachToDOM();
  }

  unmount() {
    const addButton = document.querySelector('#add');
    const taskInput = document.querySelector('.inputTask');
    addButton.removeEventListener('click', this.addEventHandler);
    taskInput.removeEventListener('keydown', this.addEventHandler);
    return this.record;
  }

  createNode(index, destItems, category) {
    const li = document.createElement('li');
    li.classList.add('listItem');
    const cbox = document.createElement('input');
    cbox.type = 'checkbox';
    cbox.className = 'check';

    if (destItems === this.record.doneItems) {
      cbox.checked = true;
      li.classList.add('strike');
    }
    cbox.addEventListener('click', this.helpers.strike(this.listName, index, category));
    li.appendChild(cbox);
    this.createText(destItems[index], index, category, li);
    const del = document.createElement('button');
    del.appendChild(icon(faTrash).node[0]);
    // del.innerHTML = '<i class="fas fa-trash"></i>';
    del.id = 'delete';
    del.addEventListener('click', this.helpers.remove(this.listName, index, category));
    li.appendChild(del);
    return li;
  }

  createText(textValue, index, category, li) {
    const p = document.createElement('textarea');
    p.className = 'itemText';
    p.value = textValue;
    p.addEventListener('click', (event) => { event.target.focus(); });
    p.addEventListener('input', this.helpers.debounce(this.helpers.handleEdit(this.listName, index, category), 1000));
    li.appendChild(p);
  }

  // eslint-disable-next-line class-methods-use-this
  autoResize() {
    const test = document.querySelectorAll('.itemText');
    // eslint-disable-next-line no-param-reassign
    test.forEach((item) => { item.style.height = 'auto'; item.style.height = `${item.scrollHeight}px`; });
  }

  attachToDOM() {
    while (this.list.firstChild) this.list.removeChild(this.list.firstChild);
    for (const itemCategory in this.record)
      this.record[itemCategory].forEach((_, index, collection) => this.list.appendChild(this.createNode(index, collection, itemCategory)));

    this.autoResize();
  }
}

export default Todos;
