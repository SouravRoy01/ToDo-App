/* eslint-disable no-undef */
let obj1
const util = importUtil();
window.onload = () => {
    const savedData = util.getSavedData();
    //todo.init(savedData);
    // { list1: savedData
    // list2: savedData }
    
    obj1 = new list(savedData);
    let records = ["hi","bye"];
    pane.initPane(records);
}

window.onunload = () => localStorage.setItem('saved', JSON.stringify(obj1.record));


class list {
    constructor(initData) {
        this.record = initData;
        this.list = document.querySelector('.myList');
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this); 
        this.strike = this.strike.bind(this);
        this.attachToDOM = this.attachToDOM.bind(this);
        this.createNode = this.createNode.bind(this);
        let addButton = document.querySelector('#add');
        let taskInput = document.querySelector('.inputTask');
        addButton.addEventListener('click',this.add);
        taskInput.addEventListener('keydown',() => {
            if(event.code=='Enter')
            this.add();
        });
        this.attachToDOM();
    }

    add() {
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
    count: 0,

    initPane(records){
        this.records = records;
        this.paneList = document.querySelector('#paneButtons');
        this.addPane = this.addPane.bind(this);
        this.attachToDOMPane = this.attachToDOMPane.bind(this);
        this.createNodePane = this.createNodePane.bind(this);

        let newButton = document.querySelector('#newList');
        newButton.addEventListener('click',this.addPane);

        this.attachToDOMPane();
    },

    addPane(){
        let name = "List " + ++this.count;
        this.records.push(name);
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





//totoUtils.js

// function importUtil(){
//     return {
//         getSavedData(){
//             if (!('notFirstLoad' in localStorage)) {
//                 const record = {
//                     items: ['Build the ToDo App'],
//                     doneItems: ['Learn Design Patterns'],
//                 };
//                 localStorage.setItem("notFirstLoad", true);
//                 localStorage.setItem('saved', JSON.stringify(record));
//             }
//             return JSON.parse(localStorage.getItem('saved'));
//         }
//     }
// }