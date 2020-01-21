/* eslint-disable no-undef */
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import getDataInstance from './data';
import utils from './todoUtils';

const paintTodos = {

  createNode(index, destItems, category) {
    const li = document.createElement('li');
    li.classList.add('listItem');
    const cbox = document.createElement('input');
    cbox.type = 'checkbox';
    cbox.className = 'check';
    if (destItems === getDataInstance().getData[this.listName].doneItems) {
      cbox.checked = true;
      li.classList.add('strike');
    }
    cbox.addEventListener('click', this.strike(this.listName, index, category));
    li.appendChild(cbox);
    this.createText(destItems[index], index, category, li);
    const del = document.createElement('button');
    del.appendChild(icon(faTrash).node[0]);
    del.id = 'delete';
    del.addEventListener('click', this.remove(this.listName, index, category));
    li.appendChild(del);
    return li;
  },

  createText(textValue, index, category, li) {
    const p = document.createElement('textarea');
    p.className = 'itemText';
    p.value = textValue;
    p.addEventListener('click', (event) => { event.target.focus(); });
    p.addEventListener('input', utils.debounce(this.handleEdit(this.listName, index, category), 500));
    li.appendChild(p);
  },

  // eslint-disable-next-line class-methods-use-this
  autoResize() {
    const textItems = document.querySelectorAll('.itemText');
    // eslint-disable-next-line no-param-reassign
    textItems.forEach((item) => { item.style.height = 'auto'; item.style.height = `${item.scrollHeight}px`; });
  },

  attachToDOM() {
    while (this.list.firstChild) this.list.removeChild(this.list.firstChild);
    for (const itemCategory in getDataInstance().getData[this.listName])
      getDataInstance().getData[this.listName][itemCategory].forEach((_, index, collection) => this.list.appendChild(this.createNode(index, collection, itemCategory)));
    this.autoResize();
  },
};

const paintPane = {
  createNodePaneList(name) {
    const listButton = document.createElement('button');
    listButton.className = 'btn btn-outline-dark paneItems';
    listButton.innerText = name;
    this.paneList.appendChild(listButton);
    listButton.addEventListener('click', this.onSelectPaneItem(name, true));
    const but = document.createElement('button');
    but.className = 'btn btn-outline-danger paneDelete';
    but.innerHTML = 'X';
    but.addEventListener('click', this.onRemoveFromPaneList(name));
    this.paneList.appendChild(but);
    return listButton;
  },

  attachToDOMPane() {
    while (this.paneList.firstChild) this.paneList.removeChild(this.paneList.firstChild);
    // eslint-disable-next-line max-len
    return Object.keys(getDataInstance().getData).reduce((acc, item) => ({ ...acc, [item]: this.createNodePaneList(item) }), {});
  },
};

export default { paintTodos, paintPane };
