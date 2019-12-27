/* eslint-disable no-undef */
const util = importUtil();
        
window.onload = () => {
    const savedData = util.getSavedData();
    todoApp.init(savedData);  
}

window.onunload = () => localStorage.setItem('saved', JSON.stringify(todoApp.records));

class list {
    constructor(initData) {
        this.record = initData; 
        this.list = document.querySelector('.myList');
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this); 
        this.strike = this.strike.bind(this);
        this.attachToDOM = this.attachToDOM.bind(this);
        this.createNode = this.createNode.bind(this);
    }

    mount() {
        let addButton = document.querySelector('#add');
        let taskInput = document.querySelector('.inputTask');
        addButton.addEventListener('click',this.add);
        taskInput.addEventListener('keydown',this.add);
        this.attachToDOM();
    }

    unmount() {
        let addButton = document.querySelector('#add');
        let taskInput = document.querySelector('.inputTask');
        addButton.removeEventListener('click',this.add);
        taskInput.removeEventListener('keydown',this.add);
        return this.record;
    }

    add(event) {
        if (event.type !== 'click' && event.code !== 'Enter') return;

        let input = document.querySelector('.inputTask').value.trim();
        
        if(input!=='')
            this.record.items.includes(input) || this.record.doneItems.includes(input)
            ? alert('Task already exists')
            : (
                this.record.items.push(input), 
                this.list.appendChild(this.createNode(this.record.items.length-1,this.record.items)),
                this.attachToDOM()   
            );
        document.querySelector('.inputTask').value='';
    }

    remove(index,destItems) {
        return () => {
            if(destItems==this.record.items && !confirm("Are you sure you want to delete an uncompleted task?"))
                return;
            destItems.splice(index,1);
            this.attachToDOM();
        }          
    }

    strike(index,destItems) {
        return () => {
            const itemValue = destItems[index];
            destItems.splice(index, 1);  
            (destItems === this.record.items) ? this.record.doneItems.push(itemValue) : this.record.items.push(itemValue);                                          
            this.attachToDOM();
        }
    }

    createNode(index,destItems) {
        let li = document.createElement('li');
        let cbox = document.createElement('input');  
        cbox.type = 'checkbox';   
        cbox.className = 'check';
        if(destItems === this.record.doneItems){
            cbox.checked=true;
            li.classList.add('strike');
        }
        cbox.addEventListener('click',this.strike(index,destItems));
        li.appendChild(cbox);     
        let t = document.createTextNode(destItems[index]);
        li.classList.add('listItem');
        li.appendChild(t);
        let but = document.createElement('button');
        but.className = 'btn btn-outline-danger delete'; 
        but.innerHTML = 'X';
        but.addEventListener('click',this.remove(index,destItems));
        li.appendChild(but);
        return li;
    }

    attachToDOM(){
        while(this.list.firstChild)
            this.list.removeChild(this.list.firstChild);
        this.record.items.forEach((_, index, collection) => this.list.appendChild(this.createNode(index, collection)));
        this.record.doneItems.forEach((_, index, collection) => this.list.appendChild(this.createNode(index, collection))); 
    }

}

let pane = {
    count: 2,               //Change

    initPane(records, onSelectPaneItem){
        this.records = records;
        this.onSelectPaneItem = onSelectPaneItem;

        this.paneList = document.querySelector('#paneButtons');

        this.addPane = this.addPane.bind(this);
        this.attachToDOMPane = this.attachToDOMPane.bind(this);
        this.createNodePane = this.createNodePane.bind(this);

        let newButton = document.querySelector('#newList');
        newButton.addEventListener('click',this.addPane);

        this.attachToDOMPane();
    },

    addPane(){
        //let name = "List " + ++this.count;
        let name = "List " + (this.records.length+1);
        this.records.push(name);
        todoApp.records[name] = { items: [], doneItems: [] }; //
        this.createNodePane(name);
        this.attachToDOMPane();    
    },

    removePane(index){
        return () => {
            if(!confirm("Are you sure you want to delete the list?"))
                return;
            this.records.splice(index,1);
            this.attachToDOMPane();
        }          
    },

    createNodePane(name,index){
        let listButton = document.createElement('button');
        listButton.className = 'btn btn-outline-dark paneItems'; 
        listButton.innerHTML = name;
        this.paneList.appendChild(listButton);

        listButton.addEventListener('click', this.onSelectPaneItem(name));    

        let but = document.createElement('button');
        but.className = 'btn btn-outline-danger paneDelete'; 
        but.innerHTML = 'X';
        but.addEventListener('click',this.removePane(index));
        this.paneList.appendChild(but);
    },

    attachToDOMPane(){
        while(this.paneList.firstChild)
            this.paneList.removeChild(this.paneList.firstChild);
            this.records.forEach((item,index) => this.createNodePane(item,index));
    }
}


let todoApp = { 
    init(data)
    {
        this.handleSelectPaneItem = this.handleSelectPaneItem.bind(this);
        this.records = data;

        pane.initPane(Object.keys(this.records), this.handleSelectPaneItem);

        this.handleSelectPaneItem(Object.keys(this.records)[0])();
    },

    handleSelectPaneItem(itemName) {
        return () => {
            if(this.mountedObject) {
                const { itemName, reference } = this.mountedObject;
                const updatedRecords = reference.unmount();
                this.records[itemName] = updatedRecords;
            }    
            console.log(this.records[itemName]);
            this.mountedObject = {
                itemName,
                reference: new list(this.records[itemName]),
            }; 
            this.mountedObject.reference.mount();
        }
    }
}

