/* eslint-disable no-undef */
const pane = {
  initPane(records, onSelectPaneItem, onAddToPaneList, onRemoveFromPaneList) {
    this.paneRecords = records;
    this.onSelectPaneItem = onSelectPaneItem;
    this.onAddToPaneList = onAddToPaneList;
    this.onRemoveFromPaneList = onRemoveFromPaneList;
    this.paneList = document.querySelector('#paneButtons');
    this.createNodePaneList = this.createNodePaneList.bind(this);
    this.attachToDOMPane = this.attachToDOMPane.bind(this);
    this.newButton = document.querySelector('#newList');
    this.newButton.addEventListener('click', this.onAddToPaneList);
    return this.attachToDOMPane();
  },

  createNodePaneList(name) {
    const listButton = document.createElement('button');
    listButton.className = 'btn btn-outline-dark paneItems';
    listButton.innerText = name;
    this.paneList.appendChild(listButton);
    listButton.addEventListener('click', this.onSelectPaneItem(name));
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
    return this.paneRecords.reduce((acc, item) => ({ ...acc, [item]: this.createNodePaneList(item) }), {});
  },
};

export default pane;
