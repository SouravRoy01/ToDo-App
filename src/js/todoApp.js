/* eslint-disable no-undef */
// eslint-disable no-undef

import Todos from './todos';
import pane from './pane';

const todoApp = {
  init(data) {
    this.handleSelectPaneItem = this.handleSelectPaneItem.bind(this);
    this.mount = this.mount.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.strike = this.strike.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.debounce = this.debounce.bind(this);
    this.addToPaneList = this.addToPaneList.bind(this);
    this.removeFromPaneList = this.removeFromPaneList.bind(this);
    this.mount(data, Object.keys(data)[0]);
  },

  mount(data, itemName) {
    this.records = data;
    const paneNodes = pane.initPane(
      Object.keys(this.records),
      this.handleSelectPaneItem,
      this.addToPaneList,
      this.removeFromPaneList,
    );
    this.handleSelectPaneItem(itemName)({ target: paneNodes[itemName] });
  },

  handleSelectPaneItem(itemName) {
    return (event) => {
      if (this.mountedObject) {
        this.mountedObject.paneNode.classList.remove('selected');
        this.mountedObject.reference.unmount();
      }
      const {
        add,
        remove,
        strike,
        handleEdit,
        debounce,
      } = this;
      this.mountedObject = {
        paneNode: event.target,
        reference: new Todos(itemName, this.records[itemName], {
          add,
          remove,
          strike,
          handleEdit,
          debounce,
        }),
      };
      this.mountedObject.paneNode.classList.add('selected');
      this.mountedObject.reference.mount();
    };
  },

  add(itemName) {
    return (event) => {
      if (event.type !== 'click' && event.code !== 'Enter') return;
      const input = document.querySelector('.inputTask').value.trim();

      if (input === '') return;
      const records = {
        ...this.records,
        [itemName]: {
          ...this.records[itemName],
          items: [input, ...this.records[itemName].items],
        },
      };
      document.querySelector('.inputTask').value = '';
      this.mount(records, itemName);
    };
  },

  remove(itemName, pos, category) {
    return () => {
      if (category === 'items' && !confirm('Are you sure you want to delete an uncompleted task?')) return;

      const records = {
        ...this.records,
        [itemName]: {
          ...this.records[itemName],
          [category]: this.records[itemName][category]
            .reduce((acc, item, index) => (index !== pos ? [...acc, item] : acc), []),
        },
      };

      this.mount(records, itemName);
    };
  },

  strike(itemName, pos, category) {
    return () => {
      const strikedItem = this.records[itemName][category][pos];
      const records = {
        ...this.records,
        [itemName]: {
          ...this.records[itemName],
          [category]: this.records[itemName][category]
            .reduce((acc, item, index) => (index !== pos ? [...acc, item] : acc), []),
        },
      };

      // eslint-disable-next-line no-unused-expressions
      (category === 'items')
        ? records[itemName].doneItems = [...records[itemName].doneItems, strikedItem]
        : records[itemName].items = [...records[itemName].items, strikedItem];

      this.mount(records, itemName);
    };
  },

  handleEdit(itemName, index, category) {
    return (event) => {
      const text = event.target.value.trim();
      if (text === '') return undefined;
      const records = {
        ...this.records,
        [itemName]: {
          ...this.records[itemName],
          [category]: this.records[itemName][category]
            .reduce((acc, item, pos) => (pos !== index ? [...acc, item] : [...acc, text]), []),
        },
      };

      return records;
    };
  },

  debounce(func, interval) {
    let timeout;
    const that = this;
    function debouncer(...rest) {
      const context = this;
      const args = rest;
      this.style.height = 'auto';
      this.style.height = `${this.scrollHeight}px`;
      const later = () => {
        timeout = null;
        that.records = func.apply(context, args) || that.records;
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, interval);
    }
    return debouncer;
  },

  addToPaneList() {
    // eslint-disable-next-line no-alert
    let name = prompt('What would you like to name your new list', '');
    // eslint-disable-next-line no-alert
    if (name === null || name.trim() === '') { alert('Your list must have a name!'); return; }
    name = name.trim();
    if (Object.keys(this.records).includes(name)) {
      // eslint-disable-next-line no-alert
      alert('You already have a list with the same name! Try some other name');
      return;
    }

    const records = {
      ...this.records,
      [name]: { items: [], doneItems: [] },
    };
    this.mount(records, name);
  },


  removeFromPaneList(itemName) {
    return () => {
      if (!confirm('Are you sure you want to delete the list?')) return;

      const records = (() => {
        obj = {};
        // eslint-disable-next-line no-restricted-syntax
        for (key in this.records) if (key !== itemName) obj[key] = this.records[key];
        return obj;
      })();

      this.mount(records, Object.keys(records)[0]);
    };
  },

};

export default todoApp;
