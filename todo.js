// eslint-disable no-undef 
const util = importUtil();
        
window.onload = () => {
    const savedData = util.getSavedData();
    todoApp.init(savedData);  
}

window.onunload = () => {
    const records = todoApp.records;
    localStorage.setItem('saved', JSON.stringify(records));
}

let todoApp = { 
    init(data)
    {
        this.handleSelectPaneItem = this.handleSelectPaneItem.bind(this);
        this.mount = this.mount.bind(this);
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.strike = this.strike.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.debounce = this.debounce.bind(this);
        this.addToPaneList = this.addToPaneList.bind(this)
        this.removeFromPaneList = this.removeFromPaneList.bind(this);
        this.mount(data,Object.keys(data)[0]);
    },

    mount(data,itemName) {
        this.records = data;
        const paneNodes = pane.initPane(Object.keys(this.records), this.handleSelectPaneItem , this.addToPaneList, this.removeFromPaneList);
        this.handleSelectPaneItem(itemName)({ target: paneNodes[itemName] });
    },

    handleSelectPaneItem(itemName) {
        return (event) => {
            if(this.mountedObject) {
                this.mountedObject.paneNode.classList.remove("selected");
                this.mountedObject.reference.unmount();
            }
            const { 
                add, 
                remove, 
                strike, 
                handleEdit,
                debounce
            } = this;
            this.mountedObject = {
                    paneNode: event.target,
                    reference: new todos(itemName, this.records[itemName], { 
                    add, 
                    remove, 
                    strike, 
                    handleEdit,
                    debounce
                }),
            }; 
            this.mountedObject.paneNode.classList.add("selected");
            this.mountedObject.reference.mount();
        }
    },

    add(itemName) {
        return (event)=> {
            
            if (event.type !== 'click' && event.code !== 'Enter') return;
            let input = document.querySelector('.inputTask').value.trim();

            if(input==='') return; 
            const records = {
                ...this.records,
                [itemName]: {
                    ...this.records[itemName],
                    items: [input, ...this.records[itemName].items],   //Changed    // New task to be entered at last or first ?      
                }
            }
            document.querySelector('.inputTask').value='';
            this.mount(records,itemName);
        }
    },
  
    remove(itemName, pos, category) {
        return () => {
            if(category==='items' && !confirm("Are you sure you want to delete an uncompleted task?"))
                return;

            const records = {
                ...this.records,
                [itemName]: {
                    ...this.records[itemName],
                    [category]: this.records[itemName][category].reduce((acc,item,index)=> index!==pos ? [...acc, item] : acc, []),
                },
            }

            this.mount(records,itemName);
        }          
    },

    strike(itemName,pos,category) {
        return () => {
            const item = this.records[itemName][category][pos];
            const records = {
                ...this.records,
                [itemName]: {
                    ...this.records[itemName],
                    [category]: this.records[itemName][category].reduce((acc,item,index)=> index!==pos ? [...acc, item] : acc, []),
                },
            };

            (category === 'items') 
            ? records[itemName].doneItems = [...records[itemName].doneItems, item] 
            : records[itemName].items = [...records[itemName].items, item];
            
            this.mount(records,itemName);
        }
    },

    handleEdit(itemName,index,category){
        return (event) => {
            const text = event.target.value.trim();
            if(text==='') return;
            const records = {
                ...this.records,
                [itemName]: {
                    ...this.records[itemName],
                    [category]: this.records[itemName][category].reduce((acc, item, pos) => pos !== index ? [...acc, item]: [...acc, text], []),
                },
            };
            
            return records;
        }
             
    },

    debounce(func, interval) {
        let timeout;
        const that = this;
        return function () {
            const context = this;
            const args = arguments;
            this.style.height = 'auto'; 
            this.style.height = this.scrollHeight + 'px';
            const later = function () {
            timeout = null;
            that.records = func.apply(context, args) || that.records;
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, interval);
        }
    },

    addToPaneList() {
        let name = prompt("What would you like to name your new list","");
        if(name===null || name.trim()==="") { alert("Your list must have a name!"); return; } 
        name = name.trim();
        if(Object.keys(this.records).includes(name)) {                                   
            alert("You already have a list with the same name! Try some other name");
            return;
        }
 
        const records = {
            ...this.records,
            [name]: { items: [], doneItems: [] }
        };             
        this.mount(records, name);
    },

  
    removeFromPaneList(itemName) {
        return () => {
            if(!confirm("Are you sure you want to delete the list?"))
                return;
           
            const records = (() => {
                obj = {};
                for (key in this.records) if (key !== itemName) obj[key] = this.records[key]
                return obj;
            })();

            this.mount(records,Object.keys(records)[0]);
        }          
    },
    
}


class todos {
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
        let addButton = document.querySelector('#add');
        let taskInput = document.querySelector('.inputTask');
        this.addEventHandler = this.helpers.add(this.listName);
        addButton.addEventListener('click',this.addEventHandler);
        taskInput.addEventListener('keydown',this.addEventHandler);
        this.attachToDOM();
    }

    unmount() {
        let addButton = document.querySelector('#add');
        let taskInput = document.querySelector('.inputTask');
        addButton.removeEventListener('click',this.addEventHandler);
        taskInput.removeEventListener('keydown',this.addEventHandler);
        return this.record;
    }

    createNode(index,destItems,category) {
        let li = document.createElement('li');
        li.classList.add('listItem');
        let cbox = document.createElement('input');  
        cbox.type = 'checkbox';   
        cbox.className = 'check';

        if(destItems === this.record.doneItems) {
            cbox.checked=true;
            li.classList.add('strike');
        }
        cbox.addEventListener('click',this.helpers.strike(this.listName,index,category));
        li.appendChild(cbox);     
        this.createText(destItems[index], index, category, li);        
        let del = document.createElement('button');
        del.innerHTML = '<i class="fas fa-trash"></i>';
        del.id = 'delete';
        del.addEventListener('click',this.helpers.remove(this.listName, index, category));
        li.appendChild(del);
        return li;
    }

    createText(textValue, index, category, li) {
        let p = document.createElement('textarea');  
        p.className = 'itemText';              
        p.value = textValue;
        p.addEventListener('click', (event) => { event.target.focus()});
        p.addEventListener('input', this.helpers.debounce(this.helpers.handleEdit(this.listName, index, category),1000));
        li.appendChild(p);
    }

    autoResize() {
        let test = document.querySelectorAll('.itemText');
        test.forEach( (item) => { item.style.height = 'auto'; item.style.height = item.scrollHeight + 'px'; } );
    }

    attachToDOM() {
        while(this.list.firstChild)
            this.list.removeChild(this.list.firstChild);
        for (let itemCategory in this.record) 
            this.record[itemCategory].forEach((_, index, collection) => this.list.appendChild(this.createNode(index, collection, itemCategory)));
        this.autoResize();
    }
}


let pane = {
    initPane(records, onSelectPaneItem, onAddToPaneList, onRemoveFromPaneList) {
        this.paneRecords = records;
        this.onSelectPaneItem = onSelectPaneItem;
        this.onAddToPaneList = onAddToPaneList;
        this.onRemoveFromPaneList = onRemoveFromPaneList;
        this.paneList = document.querySelector('#paneButtons');
        this.createNodePaneList = this.createNodePaneList.bind(this);
        this.attachToDOMPane = this.attachToDOMPane.bind(this);
        this.newButton = document.querySelector('#newList');
        this.newButton.addEventListener('click',this.onAddToPaneList);
        return this.attachToDOMPane();
    },

    createNodePaneList(name) {
        let listButton = document.createElement('button');
        listButton.className = 'btn btn-outline-dark paneItems'; 
        listButton.innerHTML = name;
        this.paneList.appendChild(listButton);
        listButton.addEventListener('click', this.onSelectPaneItem(name));    
        let but = document.createElement('button');
        but.className = 'btn btn-outline-danger paneDelete'; 
        but.innerHTML = 'X';
        but.addEventListener('click',this.onRemoveFromPaneList(name));
        this.paneList.appendChild(but);
        return listButton;
    },

    attachToDOMPane() {
        while(this.paneList.firstChild)
            this.paneList.removeChild(this.paneList.firstChild);
        return this.paneRecords.reduce((acc, item) => ({ ...acc, [item]: this.createNodePaneList(item) }), {});
    }
}