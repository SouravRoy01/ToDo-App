/* eslint-disable no-undef */
const util = importUtil();
        
window.onload = () => {
    const savedData = util.getSavedData();
    todoApp.init(savedData);  
}


window.onunload = () => {
    const records = todoApp.getRecords();
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
        this.createText = this.createText.bind(this);
        this.createEditableText = this.createEditableText.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.addToPaneList = this.addToPaneList.bind(this)
        this.removeFromPaneList = this.removeFromPaneList.bind(this);
        this.mount(data,Object.keys(data)[0]);
        
    },

    getRecords() {
        return this.records;
    },

    mount(data,itemName) {
        this.records = data;
        pane.initPane(Object.keys(this.records), this.handleSelectPaneItem , this.addToPaneList, this.removeFromPaneList);
        this.handleSelectPaneItem(itemName)();
    },

    handleSelectPaneItem(itemName) {
        return () => {
            if(this.mountedObject) {
                const { itemName, reference } = this.mountedObject;
                const updatedRecords = reference.unmount();
                this.records[itemName] = updatedRecords;
            }    
            const { 
                add, 
                remove, 
                strike, 
                createText, 
                createEditableText, 
                handleEdit 
            } = this;
            this.mountedObject = {
                itemName,
                reference: new todos(itemName, this.records[itemName], { 
                    add, 
                    remove, 
                    strike, 
                    createText, 
                    createEditableText, 
                    handleEdit 
                }),
            }; 
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

           
            //records[itemName].items.push(val);
            //records[itemName].items = [...records[itemName].items, val]
            document.querySelector('.inputTask').value='';
            this.mount(records,itemName);
        }
    },
    //check
    remove(itemName,pos,category) {
        return () => {
            if(category==='items' && !confirm("Are you sure you want to delete an uncompleted task?"))
                return;
            //destItems.splice(index,1);
            //records[itemName][category].splice(index,1);
            const records = {
                ...oldRecords,
                [itemName]: {
                    ...oldRecords[itemName],
                    [category]: oldRecords[itemName][category].reduce((acc,item,index)=> index!==pos ? [...acc, item] : acc, []),
                },
            }
            //this.attachToDOM();
            this.mount(records,itemName);
        }          
    },

    //check
    strike(itemName,pos,category) {
        return () => {
            //const records = this.records;

            // const item = destItems[index];
            // destItems.splice(index, 1);  
            // (destItems === this.record.items) ? this.record.doneItems.push(item) : this.record.items.push(item);     
            const { records: oldRecords } = this;
            const item = this.records[itemName][category][pos];
            //records[itemName][category].splice(index,1);
            //x.splice(y, 1) => x.reduce((acc, item, index) => index !== y ? [...acc, item] : acc, [])
            const records = {
                ...oldRecords,
                [itemName]: {
                    ...oldRecords[itemName],
                    [category]: oldRecords[itemName][category].reduce((acc,item,index)=> index!==pos ? [...acc, item] : acc, []),
                },
            }
            
            debugger;
            //(category === 'items') ? records[itemName].doneItems.push(item) : records[itemName].items.push(item);
            (category === 'items') 
            ? records[itemName].doneItems = [...records[itemName].doneItems, item] 
            : records[itemName].items = [...records[itemName].items, item];
            //this.attachToDOM();
            this.mount(records,itemName);
        }
    },

    //check
    createText(itemName,index,category) {
        const records = this.records;
        let p = document.createElement('p');  
        p.className = 'itemText';              
        let t = document.createTextNode(records[itemName][category][index].value);
        p.appendChild(t);  
        return p;
    },

    //check
    createEditableText(itemName,index,category,li) {
        const records = this.records;
        let t = document.createElement('textarea');    
        t.className = 'editText';
        t.value = records[itemName][category][index].value;

        let cancel = document.createElement('button');
        cancel.innerHTML = '<i class="fas fa-window-close"></i>';
        cancel.id = 'cancel';
        let save = document.createElement('button');
        save.innerHTML = '<i class="fas fa-check-square"></i>';
        save.id = 'save';
        li.appendChild(t);
        // save.addEventListener('click',this.handleSave(index,destItems,t));      
        // cancel.addEventListener('click', this.handleCancel(index,destItems));
        save.addEventListener('click',this.handleSave(itemName,index,category,t));      
        cancel.addEventListener('click', this.handleCancel(itemName,index,category));
        t.insertAdjacentElement("afterend",cancel);
        t.insertAdjacentElement("afterend",save);
        return li;
    },

    //check
    handleEdit(itemName,index,category){
        return () => {
            const records = this.records;
            //destItems[index].isEditable=true;
            records[itemName][category][index].isEditable = true;
            this.mount(records,itemName);
            //this.attachToDOM();
        }
    },

    //check
    handleSave(itemName,index,category,t){
        return () => {
            const records = this.records;
            if(t.value.trim()!==''){
                //destItems[index].value = t.value;
                records[itemName][category][index].value = t.value;
            }
            this.handleCancel(itemName,index,category)();
            //this.attachToDOM();
            this.mount(records,itemName);
        }
    },

    //check
    handleCancel(itemName,index,category){
        return () => {
            const records = this.records;
            //destItems[index].isEditable = false;
            //this.attachToDOM();
            records[itemName][category][index].isEditable = false;
            this.mount(records,itemName);
        }
    },

    //check
    addToPaneList(){
       
        let name = prompt("What would you like to name your new list","");
        if(name===null || name==="") return;
        if(Object.keys(this.records).includes(name)){                                   //this.paneRecords.includes(name)
            alert("You already have a list with the same name! Try some other name");
            return;
        }
        //this.paneRecords.push(name);
        //todoApp.records[name] = { items: [], doneItems: [] };  
        const records = {
            ...this.records,
            [name]: { items: [], doneItems: [] }
        };             //??
        //this.createNodePaneList(name,this.paneRecords.length-1);
        //this.attachToDOMPane();   
        this.mount(records, name);
    },

    //check
    removeFromPaneList(itemName){
        return () => {
            if(!confirm("Are you sure you want to delete the list?"))
                return;
           
            //delete todoApp.records[this.paneRecords[index]];   //not working?
            const records = (() => {
                obj = {};
                for (key in this.records) if (key !== itemName) obj[key] = this.records[key]
                return obj;
            })();

            //this.paneRecords.splice(index,1);
            //this.attachToDOMPane();
            this.mount(records,Object.keys(this.records)[0]);

            
        }          
    },
    
}


class todos {
    constructor(listName, initData, helpers) {
        this.record = initData; 
        this.listName = listName;
        this.list = document.querySelector('.myList');
        this.attachToDOM = this.attachToDOM.bind(this);
        this.createNode = this.createNode.bind(this);

        this.helpers = helpers;

        this.mount = this.mount.bind(this);
        this.unmount = this.unmount.bind(this);
    }

    mount() {
        let addButton = document.querySelector('#add');
        let taskInput = document.querySelector('.inputTask');
        addButton.addEventListener('click',this.helpers.add(this.listName));
        taskInput.addEventListener('keydown',this.helpers.add(this.listName));
        this.attachToDOM();
    }

    unmount() {
        let addButton = document.querySelector('#add');
        let taskInput = document.querySelector('.inputTask');
        addButton.removeEventListener('click',this.helpers.add);
        taskInput.removeEventListener('keydown',this.helpers.add);
        return this.record;
    }

    createNode(index,destItems,category) {
        let li = document.createElement('li');
        li.classList.add('listItem');
        let cbox = document.createElement('input');  
        cbox.type = 'checkbox';   
        cbox.className = 'check';

        if(destItems === this.record.doneItems){
            cbox.checked=true;
            li.classList.add('strike');
        }
        cbox.addEventListener('click',this.helpers.strike(this.listName,index,category));
        li.appendChild(cbox);     

        if(destItems[index].isEditable)
        {
            //li = this.createEditableText(index,destItems,li);
            li = this.helpers.createEditableText(this.listName,index,category,li);
        }
        else
        {
            //let p = this.createText(destItems[index].value)
            let p = this.helpers.createText(this.listName,index,category);
            li.appendChild(p);
            p.addEventListener('click',this.helpers.handleEdit(this.listName,index,category));
        }
        
        let del = document.createElement('button');
        del.innerHTML = '<i class="fas fa-trash"></i>';
        del.id = 'delete';
        //del.addEventListener('click',this.remove(index,destItems));
        del.addEventListener('click',this.helpers.remove(this.listName,index,category));
        li.appendChild(del);
        return li;
    }


    attachToDOM(){
        while(this.list.firstChild)
            this.list.removeChild(this.list.firstChild);
        for (let itemCategory in this.record) 
            this.record[itemCategory].forEach((_, index, collection) => this.list.appendChild(this.createNode(index, collection, itemCategory)));
    }
    
    //check
    // remove(index,destItems) {
    //     return () => {
    //         if(destItems==this.record.items && !confirm("Are you sure you want to delete an uncompleted task?"))
    //             return;
    //         destItems.splice(index,1);
    //         this.attachToDOM();
    //     }          
    // }

    //check
    // strike(index,destItems) {
    //     return () => {
    //         const item = destItems[index];
    //         destItems.splice(index, 1);  
    //         (destItems === this.record.items) ? this.record.doneItems.push(item) : this.record.items.push(item);                                          
    //         this.attachToDOM();
    //     }
    // }

    

    //check
    // createText(value) {
    //     let p = document.createElement('p');  
    //     p.className = 'itemText';              
    //     let t = document.createTextNode(value);
    //     p.appendChild(t);  
    //     return p;
    // }

    //check
    // createEditableText(index,destItems,li) {
    //     let t = document.createElement('textarea');    
    //     t.className = 'editText';
    //     t.value = destItems[index].value;

    //     let cancel = document.createElement('button');
    //     cancel.innerHTML = '<i class="fas fa-window-close"></i>';
    //     cancel.id = 'cancel';
    //     let save = document.createElement('button');
    //     save.innerHTML = '<i class="fas fa-check-square"></i>';
    //     save.id = 'save';
    //     li.appendChild(t);
    //     //check the listeners
    //     save.addEventListener('click',this.handleSave(index,destItems,t));      
    //     cancel.addEventListener('click', this.handleCancel(index,destItems));
    //     t.insertAdjacentElement("afterend",cancel);
    //     t.insertAdjacentElement("afterend",save);
    //     return li;
    //     //add listeners
    // }

    //check
    // handleEdit(index,destItems){
    //     return () => {
    //         destItems[index].isEditable=true;
    //         this.attachToDOM();
    //     }
    // }

    //check
    // handleSave(index,destItems,t){
    //     return () => {
    //         if(t.value.trim()!==''){
    //             destItems[index].value = t.value;
    //         }
    //         this.handleCancel(index,destItems)();
    //         this.attachToDOM();
    //     }
    // }

    //check
    // handleCancel(index,destItems){
    //     return () => {
    //         destItems[index].isEditable = false;
    //         this.attachToDOM();
    //     }
    // }

}


let pane = {
    initPane(records, onSelectPaneItem, onAddToPaneList, onRemoveFromPaneList){
        this.paneRecords = records;
        this.onSelectPaneItem = onSelectPaneItem;
        this.onAddToPaneList = onAddToPaneList;
        this.onRemoveFromPaneList = onRemoveFromPaneList;

        this.paneList = document.querySelector('#paneButtons');

        //this.addToPaneList = this.addToPaneList.bind(this);
        this.attachToDOMPane = this.attachToDOMPane.bind(this);
        //this.removeFromPaneList = this.removeFromPaneList.bind(this);
        this.createNodePaneList = this.createNodePaneList.bind(this);
        //this.paneUnmount = this.paneUnmount.bind(this);
        //if(!this.newButton) {
        this.newButton = document.querySelector('#newList');
        this.newButton.addEventListener('click',this.onAddToPaneList);
        //}

        this.attachToDOMPane();
    },

    //check
    // addToPaneList(){
    //     let name = prompt("What would you like to name your new list","");
    //     if(name===null || name==="") return;
    //     if(this.paneRecords.includes(name)){
    //         alert("You already have a list with the same name! Try some other name");
    //         return;
    //     }
    //     this.paneRecords.push(name);
    //     todoApp.records[name] = { items: [], doneItems: [] };  // 
       
    //     this.createNodePaneList(name,this.paneRecords.length-1);
    //     this.attachToDOMPane();     
    // },

    //check
    // removeFromPaneList(index){
    //     return () => {
    //         if(!confirm("Are you sure you want to delete the list?"))
    //             return;
            
    //         delete todoApp.records[this.paneRecords[index]];   //not working?
    //         this.paneRecords.splice(index,1);
    //         this.attachToDOMPane();

    //     }          
    // },

    createNodePaneList(name,index){
        let listButton = document.createElement('button');
        listButton.className = 'btn btn-outline-dark paneItems'; 
        listButton.innerHTML = name;
        this.paneList.appendChild(listButton);

        listButton.addEventListener('click', this.onSelectPaneItem(name));    

        let but = document.createElement('button');
        but.className = 'btn btn-outline-danger paneDelete'; 
        but.innerHTML = 'X';
        //but.addEventListener('click',this.onRemoveFromPaneList(index));
        but.addEventListener('click',this.onRemoveFromPaneList(name));
        this.paneList.appendChild(but);
    },

    attachToDOMPane(){
        while(this.paneList.firstChild)
            this.paneList.removeChild(this.paneList.firstChild);
        this.paneRecords.forEach((item,index) => this.createNodePaneList(item,index));
    }
}

// x.push(y) => x = [...x, y]

// x.splice(y, 1) => x.reduce((acc, item, index) => index !== y ? [...acc, item] : acc, [])

// delete x[y] => (() => {
//         obj = {};
//         for (keys in x) if (key !== y) obj[key] = x[key]
//         return obj;
// })()




