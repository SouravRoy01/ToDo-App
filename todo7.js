/* eslint-disable no-undef */

const util = importUtil();
window.onload = () => {
    const savedData = util.getSavedData();
    todo.init(savedData);
}

window.onunload = () => localStorage.setItem('saved', JSON.stringify(todo.record));

let todo = {

    init(initData){
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
    },

    add(){
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
    },

    remove(index,destItems){
        return () => {
            if(destItems==this.record.items && !confirm("Are you sure you want to delete an uncompleted task?"))
                return;
            destItems.splice(index,1);
            this.attachToDOM();
        }          
    },

    strike(index,destItems){
        return () => {
            const itemValue = destItems[index];
            destItems.splice(index, 1);  
            (destItems === this.record.items) ? this.record.doneItems.push(itemValue) : this.record.items.push(itemValue);                                          
            this.attachToDOM();
        }
    },

    createNode(index,destItems){
        let li = document.createElement('li');
        let cbox = document.createElement('input');  
        cbox.type = 'checkbox';   
        cbox.className = 'check';
        if(destItems===this.record.doneItems){
            cbox.checked=true;
            li.classList.add('strike');
        }
        cbox.addEventListener('click',this.strike(index,destItems));
        li.appendChild(cbox);     
        let t = document.createTextNode(destItems[index]);
        li.classList.add('listItem');
        li.appendChild(t);
        let but = document.createElement('button');
        but.className = 'delete';
        but.innerHTML = 'X';
        but.addEventListener('click',this.remove(index,destItems));
        li.appendChild(but);
        return li;
    },

    attachToDOM(){
        while(this.list.firstChild)
            this.list.removeChild(this.list.firstChild);
        this.record.items.forEach((_, index, collection) => this.list.appendChild(this.createNode(index, collection)));
        this.record.doneItems.forEach((_, index, collection) => this.list.appendChild(this.createNode(index, collection))); 
    }

}