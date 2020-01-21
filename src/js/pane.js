/* eslint-disable no-undef */
import getDataInstance from './data';
import paint from './paintDOM';

const pane = {
  initPane(onSelectPaneItem, mountApp) {
    this.dataInstance = getDataInstance();
    // this.records = getDataInstance().getData;
    // this.paneRecords = Object.keys(this.records);
    this.onSelectPaneItem = onSelectPaneItem;
    this.paneList = document.querySelector('#paneButtons');
    this.mountApp = mountApp;
    this.onAddToPaneList = this.onAddToPaneList.bind(this);
    this.onRemoveFromPaneList = this.onRemoveFromPaneList.bind(this);
    this.newButton = document.querySelector('#newList');
    this.newButton.addEventListener('click', this.onAddToPaneList);
    this.createNodePaneList = paint.paintPane.createNodePaneList.bind(this);
    this.attachToDOMPane = paint.paintPane.attachToDOMPane.bind(this);
    return this.attachToDOMPane();
  },

  onAddToPaneList() {
    // eslint-disable-next-line no-alert
    let name = prompt('What would you like to name your new list', '');
    // eslint-disable-next-line no-alert
    if (name === null || name.trim() === '') { alert('Your list must have a name!'); return; }
    name = name.trim();
    if (Object.keys(this.dataInstance.getData).includes(name)) {
      // eslint-disable-next-line no-alert
      alert('You already have a list with the same name! Try some other name');
      return;
    }
    const records = {
      ...this.dataInstance.getData,
      [name]: { items: [], doneItems: [] },
    };
    this.newButton.removeEventListener('click', this.onAddToPaneList);
    this.dataInstance.setData = records;
    this.mountApp(name);
  },

  onRemoveFromPaneList(itemName) {
    return () => {
      if (!confirm('Are you sure you want to delete the list?')) return;
      const deletedItemIndex = Object.keys(this.dataInstance.getData).indexOf(itemName)
      this.newButton.removeEventListener('click', this.onAddToPaneList);
      const records = (() => {
        const obj = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const key in this.dataInstance.getData) {
          if (key !== itemName) obj[key] = this.dataInstance.getData[key];
        }
        return obj;
      })();
      this.dataInstance.setData = records;
      // this.mountApp(Object.keys(records)[0]);
      this.mountApp(null, { item: itemName, index: deletedItemIndex });
    };
  },
};

export default pane;
