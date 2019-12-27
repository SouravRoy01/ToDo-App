/* eslint-disable no-undef */


//Creates textbox while editing with save,cancel options (data structure with isEditable field)

const util = importUtil();
        
window.onload = () => {
    const savedData = util.getSavedData();
    todoApp.init(savedData);  
}


window.onunload = () => {
    const records = todoApp.unEdit();
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
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.addToPaneList = this.addToPaneList.bind(this)
        this.removeFromPaneList = this.removeFromPaneList.bind(this);
        this.unEdit = this.unEdit.bind(this);
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
                handleSave,
                handleCancel,
                handleEdit,
            } = this;
            this.mountedObject = {
                    paneNode: event.target,
                    reference: new todos(itemName, this.records[itemName], { 
                    add, 
                    remove, 
                    strike, 
                    handleSave,
                    handleCancel,
                    handleEdit,
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
            
            let val = {
                value: input,
                isEditable: false
            };

            if(input==='') return; 
            const records = {
                ...this.records,
                [itemName]: {
                    ...this.records[itemName],
                    items: [...this.records[itemName].items, val],             
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
            //records[itemName][category].splice(index,1);
            const records = {
                ...this.records,
                [itemName]: {
                    ...this.records[itemName],
                    [category]: this.records[itemName][category].reduce((acc,item,index)=> index!==pos ? [...acc, item] : acc, []),
                },
            };
        
            //(category === 'items') ? records[itemName].doneItems.push(item) : records[itemName].items.push(item);
            (category === 'items') 
            ? records[itemName].doneItems = [...records[itemName].doneItems, item] 
            : records[itemName].items = [...records[itemName].items, item];
            
            this.mount(records,itemName);
        }
    },

    
    handleEdit(itemName, index, category) {
        return () => {
            this.unEdit();
            const records = {
                ...this.records,
                [itemName]: {
                    ...this.records[itemName],
                    [category]: this.records[itemName][category].reduce((acc, item, pos) => pos !== index ? [...acc, item]: [...acc, { ...item, isEditable: true }], []),
                },
            };
            this.mount(records, itemName);
        }
    },

    // handleSave(itemName, index, category, textAreaNode) {
    //     return () => {
    //         let records;
    //         const val = textAreaNode.value.trim()
    //         if(val!=='') {
    //             //records[itemName][category][index].value = val; 
    //             records = {
    //                 ...this.records,
    //                 [itemName]: {
    //                     ...this.records[itemName],
    //                     [category]: this.records[itemName][category].reduce((acc, item, pos) => pos !== index ? [...acc, item]: [...acc, { value: val, isEditable: false }], []),
    //                 },
    //             };
    //             this.mount(records,itemName);
    //             return;
    //         }
    //         this.handleCancel(itemName,index,category)();
    //     }
    // },

    handleSave(itemName, index, category, textAreaNode) {
        return () => {
            let records;
            const val = textAreaNode.value.trim()
            if(val!=='') {
                //records[itemName][category][index].value = val; 
                records = {
                    ...this.records,
                    [itemName]: {
                        ...this.records[itemName],
                        [category]: this.records[itemName][category].reduce((acc, item, pos) => pos !== index ? [...acc, item]: [...acc, { ...item, value: val }], []),
                    },
                };
                

            }
            this.mount(records,itemName);
            this.handleCancel(itemName,index,category)();
           
        }
    },

    handleCancel(itemName, index, category) {
        return () => {
            //records[itemName][category][index].isEditable = false; 
            const records = {
                ...this.records,
                [itemName]: {
                    ...this.records[itemName],
                    [category]: this.records[itemName][category].reduce((acc, item, pos) => pos !== index ? [...acc, item]: [...acc, { ...item, isEditable: false }], []),
                },
            };

            this.mount(records,itemName);
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
        //this.paneRecords.push(name);
        //todoApp.records[name] = { items: [], doneItems: [] };  
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
           
            //delete todoApp.records[this.paneRecords[index]];  
            const records = (() => {
                obj = {};
                for (key in this.records) if (key !== itemName) obj[key] = this.records[key]
                return obj;
            })();

            this.mount(records,Object.keys(records)[0]);
        }          
    },

    unEdit() {
        for(itemName in this.records)
        {
            for(category in this.records[itemName])
                this.records[itemName][category].forEach((_, index) => { todoApp.records[itemName][category][index].isEditable = false });
        }
        return this.records;
    }
    
}


class todos {
    constructor(listName, initData, helpers) {
        this.record = initData; 
        this.listName = listName;
        this.list = document.querySelector('.myList');

        this.attachToDOM = this.attachToDOM.bind(this);
        this.createNode = this.createNode.bind(this);
        this.createText = this.createText.bind(this);
        this.createEditableText = this.createEditableText.bind(this);

        this.helpers = helpers;

        this.mount = this.mount.bind(this);
        this.unmount = this.unmount.bind(this);
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

    createEditableText(textValue, index, category, li) {
        let t = document.createElement('textarea');    
        t.className = 'editText';
        t.value = textValue;

        let cancel = document.createElement('button');
        cancel.innerHTML = '<i class="fas fa-window-close"></i>';
        cancel.id = 'cancel';
        let save = document.createElement('button');
        save.innerHTML = '<i class="fas fa-check-square"></i>';
        save.id = 'save';
        li.appendChild(t);

        save.addEventListener('click',this.helpers.handleSave(this.listName, index, category, t));      
        cancel.addEventListener('click', this.helpers.handleCancel(this.listName, index, category));
        t.insertAdjacentElement("afterend",cancel);
        t.insertAdjacentElement("afterend",save);
    }

    createText(textValue, index, category, li) {
        let p = document.createElement('p');  
        p.className = 'itemText';              
        let t = document.createTextNode(textValue);
        p.appendChild(t);  
        p.addEventListener('click', this.helpers.handleEdit(this.listName, index, category));
        li.appendChild(p);
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

        if(destItems[index].isEditable)
        {
            this.createEditableText(destItems[index].value, index, category, li);
        }
        else
        {
            this.createText(destItems[index].value, index, category, li);
        }
        
        let del = document.createElement('button');
        del.innerHTML = '<i class="fas fa-trash"></i>';
        del.id = 'delete';
        del.addEventListener('click',this.helpers.remove(this.listName, index, category));
        li.appendChild(del);
        return li;
    }


    attachToDOM() {
        while(this.list.firstChild)
            this.list.removeChild(this.list.firstChild);
        for (let itemCategory in this.record) 
            this.record[itemCategory].forEach((_, index, collection) => this.list.appendChild(this.createNode(index, collection, itemCategory)));
    }
}


let pane = {
    initPane(records, onSelectPaneItem, onAddToPaneList, onRemoveFromPaneList) {
        this.paneRecords = records;
        this.onSelectPaneItem = onSelectPaneItem;
        this.onAddToPaneList = onAddToPaneList;
        this.onRemoveFromPaneList = onRemoveFromPaneList;

        this.paneList = document.querySelector('#paneButtons');

        this.attachToDOMPane = this.attachToDOMPane.bind(this);
        this.createNodePaneList = this.createNodePaneList.bind(this);
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