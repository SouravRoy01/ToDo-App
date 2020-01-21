/* eslint-disable no-undef */
import getDataInstance from './data';
import paint from './paintDOM';

class Todos {
  constructor(listName, onSelectPaneItem, paneNode) {
    this.dataInstance = getDataInstance();
    this.listName = listName;
    // this.record = initData;
    // this.record = this.records[listName];
    this.list = document.querySelector('.myList');
    this.mount = this.mount.bind(this);
    this.unmount = this.unmount.bind(this);
    this.onSelectPaneItem = onSelectPaneItem;
    this.paneNode = paneNode;
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.strike = this.strike.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.createNode = paint.paintTodos.createNode.bind(this);
    this.createText = paint.paintTodos.createText.bind(this);
    this.autoResize = paint.paintTodos.autoResize.bind(this);
    this.attachToDOM = paint.paintTodos.attachToDOM.bind(this);
  }

  mount() {
    const addButton = document.querySelector('#add');
    const taskInput = document.querySelector('.inputTask');
    this.addEventHandler = this.add(this.listName);
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

  add(itemName) {
    return (event) => {
      if (event.type !== 'click' && event.code !== 'Enter') return;
      const input = document.querySelector('.inputTask').value.trim();
      if (input === '') return;
      const records = {
        ...this.dataInstance.getData,
        [itemName]: {
          ...this.dataInstance.getData[itemName],
          items: [input, ...this.dataInstance.getData[itemName].items],
        },
      };
      document.querySelector('.inputTask').value = '';
      this.dataInstance.setData = records;
      this.onSelectPaneItem(itemName)({ target: this.paneNode });
    };
  }

  remove(itemName, pos, category) {
    return () => {
      if (category === 'items' && !confirm('Are you sure you want to delete an uncompleted task?')) return;

      const records = {
        ...this.dataInstance.getData,
        [itemName]: {
          ...this.dataInstance.getData[itemName],
          [category]: this.dataInstance.getData[itemName][category]
            .reduce((acc, item, index) => (index !== pos ? [...acc, item] : acc), []),
        },
      };
      this.dataInstance.setData = records;
      this.onSelectPaneItem(itemName)({ target: this.paneNode });
    };
  }

  strike(itemName, pos, category) {
    return () => {
      const strikedItem = this.dataInstance.getData[itemName][category][pos];
      const records = {
        ...this.dataInstance.getData,
        [itemName]: {
          ...this.dataInstance.getData[itemName],
          [category]: this.dataInstance.getData[itemName][category]
            .reduce((acc, item, index) => (index !== pos ? [...acc, item] : acc), []),
        },
      };

      if (category === 'items') records[itemName].doneItems = [...records[itemName].doneItems, strikedItem];
      else records[itemName].items = [...records[itemName].items, strikedItem];
      this.dataInstance.setData = records;
      this.onSelectPaneItem(itemName)({ target: this.paneNode });
    };
  }

  // eslint-disable-next-line class-methods-use-this
  handleEdit(itemName, index, category) {
    return (event) => {
      const text = event.target.value.trim();
      if (text === '') return undefined;
      const records = {
        ...this.dataInstance.getData,
        [itemName]: {
          ...this.dataInstance.getData[itemName],
          [category]: this.dataInstance.getData[itemName][category]
            .reduce((acc, item, pos) => (pos !== index ? [...acc, item] : [...acc, text]), []),
        },
      };
      // return records;
      this.dataInstance.setData = records || this.dataInstance.getData;
    };
  }
}

export default Todos;
