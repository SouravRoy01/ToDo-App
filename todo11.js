/* eslint-disable no-undef */


//Before SOT Architecture change

const util = importUtil();
        
window.onload = () => {
    const savedData = util.getSavedData();
    todoApp.init(savedData,0);  
}

window.onunload = () => localStorage.setItem('saved', JSON.stringify(todoApp.records));

class todos {
    constructor(initData) {
        this.record = initData; 
        this.list = document.querySelector('.myList');
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this); 
        this.strike = this.strike.bind(this);
        this.attachToDOM = this.attachToDOM.bind(this);
        this.createNode = this.createNode.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.createText = this.createText.bind(this);
        this.mount = this.mount.bind(this);
        this.unmount = this.unmount.bind(this);
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

        // non-optimized p creation
        // let p = document.createElement('p');  
        // p.className = 'itemText';               
        // let t = document.createTextNode(destItems[index]);
        // p.appendChild(t);                   
        
        let p = this.createText(destItems[index]);

        li.classList.add('listItem');
        li.appendChild(p);                      // p instead of t wed

        p.addEventListener('click',this.handleEdit(index,destItems,li,p));  //wed2
        

        let del = document.createElement('button');
        del.innerHTML = '<i class="fas fa-trash"></i>';
        del.id = 'delete';
        del.addEventListener('click',this.remove(index,destItems));
        li.appendChild(del);
        return li;
    }


    //wed2
    handleEdit(index,destItems,li,p) {
        return () => {
            let t = document.createElement('textarea');    
            t.className = 'editText';
            t.value = destItems[index];

            let cancel = document.createElement('button');
            cancel.innerHTML = '<i class="fas fa-window-close"></i>';
            cancel.id = 'cancel';
            let save = document.createElement('button');
            save.innerHTML = '<i class="fas fa-check-square"></i>';
            save.id = 'save';

            li.replaceChild(t,p);

            save.addEventListener('click',this.handleSave(save,cancel,index,destItems,li,t));      //wed3
            cancel.addEventListener('click', this.handleCancel(save,cancel,index,destItems,destItems[index],li,t));  //wed3
        
            t.insertAdjacentElement("afterend",cancel);
            t.insertAdjacentElement("afterend",save);
        }
    }

    // //wed3
    // onSave(cancel,index,destItems,li,t) {  
    //     return () => {
    //         let p = document.createElement('p');  
    //         p.className = 'itemText';               
    //         let txt = document.createTextNode(t.value);
    //         p.appendChild(txt);
    //         li.replaceChild(p,t);
    //         event.target.remove();
    //         cancel.remove();
    //         destItems[index]=t.value;  //wed4
    //     }
    // }
    // //wed3
    // onCancel(save,index,destItems,li,t) {  
    //     return () => {
    //         let p = document.createElement('p');  
    //         p.className = 'itemText';               
    //         let txt = document.createTextNode(destItems[index]);
    //         p.appendChild(txt);
    //         li.replaceChild(p,t);
    //         event.target.remove();
    //         save.remove();
    //     }
    // }


    //wed4
    handleSave(save,cancel,index,destItems,li,t) {  
        return () => {
            if(t.value.trim()!=='')
            {
                this.handleCancel(save,cancel,index,destItems,t.value,li,t)();
                destItems[index]=t.value;
            }
            else
                this.handleCancel(save,cancel,index,destItems,destItems[index],li,t)();
        }
    }
    //wed4
    handleCancel(save,cancel,index,destItems,value,li,t) {  
        return () => {
            // for non-optimized p creation
            // let p = document.createElement('p');  
            // p.className = 'itemText';               
            // let txt = document.createTextNode(value);
            // p.appendChild(txt);
            let p = this.createText(value);
            li.replaceChild(p,t);
            p.addEventListener('click',this.handleEdit(index,destItems,li,p));
            save.remove();
            cancel.remove();
        }
    }

    //wed5
    createText(value) {
        let p = document.createElement('p');  
        p.className = 'itemText';              
        let t = document.createTextNode(value);
        p.appendChild(t);  
        return p;
    }
   

    attachToDOM(){
        while(this.list.firstChild)
            this.list.removeChild(this.list.firstChild);
        this.record.items.forEach((_, index, collection) => this.list.appendChild(this.createNode(index, collection)));
        this.record.doneItems.forEach((_, index, collection) => this.list.appendChild(this.createNode(index, collection))); 
    }

}

let pane = {
    initPane(records, onSelectPaneItem){
        this.paneRecords = records;
        this.onSelectPaneItem = onSelectPaneItem;

        this.paneList = document.querySelector('#paneButtons');

        this.addToPaneList = this.addToPaneList.bind(this);
        this.attachToDOMPane = this.attachToDOMPane.bind(this);
        this.removeFromPaneList = this.removeFromPaneList.bind(this);
        this.createNodePaneList = this.createNodePaneList.bind(this);
        //this.paneUnmount = this.paneUnmount.bind(this);

        let newButton = document.querySelector('#newList');
        newButton.addEventListener('click',this.addToPaneList);

        this.attachToDOMPane();
    },

    addToPaneList(){
        //let name = "List " + (this.records.length+1); 
        let name = prompt("What would you like to name your new list","");
        if(name===null || name==="") return;
        if(this.paneRecords.includes(name)){
            alert("You already have a list with the same name! Try some other name");
            return;
        }
        this.paneRecords.push(name);
        todoApp.records[name] = { items: [], doneItems: [] }; //
       
        this.createNodePaneList(name,this.paneRecords.length-1);
        this.attachToDOMPane();    
        
        // //unmounting the listener
        // let newButton = document.querySelector('#newList');
        // newButton.removeEventListener('click',this.addToPaneList);
        // todoApp.init(todoApp.records,this.records.length-1);  

    },

    removeFromPaneList(index){
        return () => {
            if(!confirm("Are you sure you want to delete the list?"))
                return;
            
            delete todoApp.records[this.paneRecords[index]];   //not working?
            this.paneRecords.splice(index,1);
            this.attachToDOMPane();

            //unmounting the listener
            // let newButton = document.querySelector('#newList');
            // newButton.removeEventListener('click',this.addToPaneList);
            // for(ind in this.paneRecords)
            //     this.paneUnmount(this.paneRecords[ind],ind)
            // todoApp.init(todoApp.records,0);  
        
         
        }          
    },

    // paneUnmount(item,index){
    //     let listButton = document.querySelector('.paneItems');
    //     listButton.removeEventListener('click', this.onSelectPaneItem(item));
    //     let delButton = document.querySelector('.paneDelete')
    //     delButton.removeEventListener('click',this.removeFromPaneList(index));
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
        but.addEventListener('click',this.removeFromPaneList(index));
        this.paneList.appendChild(but);
    },

    attachToDOMPane(){
        while(this.paneList.firstChild)
            this.paneList.removeChild(this.paneList.firstChild);
        this.paneRecords.forEach((item,index) => this.createNodePaneList(item,index));
    }
}


let todoApp = { 
    init(data,index)
    {
       
        this.handleSelectPaneItem = this.handleSelectPaneItem.bind(this);
        this.records = data;
        if(Object.keys(this.records).length){
        pane.initPane(Object.keys(this.records), this.handleSelectPaneItem);

        this.handleSelectPaneItem(Object.keys(this.records)[index])();
        }
    },

    handleSelectPaneItem(itemName) {
        return () => {
            if(this.mountedObject) {
                const { itemName, reference } = this.mountedObject;
                const updatedRecords = reference.unmount();
                this.records[itemName] = updatedRecords;
            }    

            this.mountedObject = {
                itemName,
                reference: new todos(this.records[itemName]),
            }; 
            this.mountedObject.reference.mount();
        }
    }
}

UTILS
// function importUtil(){
//     return {
//         getSavedData(){
//             if (!('notFirstLoad' in localStorage)) {
//                 const record = {
//                     "List 1": { items: ['Build the ToDo App'], doneItems: ['Learn Design Patterns'] },
//                     "List 2": { items: ['Optimize the ToDo App'], doneItems: ['Learn Flexbox'] }
//                 };
//                 localStorage.setItem("notFirstLoad", true);
//                 localStorage.setItem('saved', JSON.stringify(record));
//             }
//             return JSON.parse(localStorage.getItem('saved'));
//         } 
//     }
// }

