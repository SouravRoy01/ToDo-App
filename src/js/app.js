/* eslint-disable no-undef */
// eslint-disable no-undef

import Todos from './todos';
import pane from './pane';
import getDataInstance from './data';
// const dataInstance = getDataInstance();

const app = {
  init() {
    this.dataInstance = getDataInstance();
    this.handleSelectPaneItem = this.handleSelectPaneItem.bind(this);
    this.mount = this.mount.bind(this);
    this.mountPane = this.mountPane.bind(this);
    this.mount(Object.keys(this.dataInstance.getData)[0]);
  },

  mount(itemNameArg, deletedItemArg) {
    let itemName = itemNameArg;
    const deletedItem = deletedItemArg;
    const paneNodes = this.mountPane();
    // this.handleSelectPaneItem(itemName, true)({ target: paneNodes[itemName] });
    let skipTodos = false;
    if (deletedItem) {
      itemName = this.currentList;
      if (deletedItem.index !== 0) deletedItem.index -= 1;
      if (deletedItem.item === itemName) itemName = Object.keys(paneNodes)[deletedItem.index];
      skipTodos = true;
    }
    this.handleSelectPaneItem(itemName, skipTodos)({ target: paneNodes[itemName] });
  },

  mountPane() {
    return pane.initPane(this.handleSelectPaneItem, this.mount);
  },

  handleSelectPaneItem(itemName, reselect) {
    return (event) => {
      if (reselect && this.currentList === itemName) {
        if (this.mountedObject) this.mountedObject.paneNode = event.target;
        this.mountedObject.paneNode.classList.add('selected');
        return;
      }
      if (this.mountedObject) {
        if (this.mountedObject.paneNode) this.mountedObject.paneNode.classList.remove('selected');
        this.mountedObject.reference.unmount();
      }
      this.mountedObject = {
        paneNode: event.target,
        reference: new Todos(itemName, this.handleSelectPaneItem, event.target),
      };
      if (this.mountedObject.paneNode) this.mountedObject.paneNode.classList.add('selected');
      this.mountedObject.reference.mount();
      this.currentList = itemName;
    };
  },

};

export default app;
