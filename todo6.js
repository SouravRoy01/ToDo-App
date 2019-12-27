window.onload = () => todo.init();
let todo={

    init: function(){
        this.items = ['Build the ToDo App'];
        this.doneItems = ['Learn Design Patterns'];
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

    add: function(){
        let input = document.querySelector('.inputTask').value.trim();
        if(input!=='')
            this.items.includes(input) || this.doneItems.includes(input)
            ? alert('Task already exists')
            : (
                this.items.push(input), 
                this.list.appendChild(this.createNode(this.items.length-1,this.items)),
                this.attachToDOM()   //
            );
        document.querySelector('.inputTask').value='';
    },

    remove: function(index,destItems){
        return () => {
            if(destItems==this.items && !confirm("Are you sure you want to delete an uncompleted task?"))
                return;
            destItems.splice(index,1);
            this.attachToDOM();
        }          
    },

    strike: function(index,destItems){
        return () => {
            const itemValue = destItems[index];
            destItems.splice(index, 1);  
            (destItems === this.items) ? this.doneItems.push(itemValue) : this.items.push(itemValue);                                          
            this.attachToDOM();
        }
    },

    createNode: function(index,destItems){
        let li = document.createElement('li');
        let cbox = document.createElement('input');  
        cbox.type = 'checkbox';   

        if(destItems===this.doneItems){
            cbox.checked=true;
            li.classList.add('strike');
        }
        cbox.addEventListener('click',this.strike(index,destItems));
        
        li.appendChild(cbox);     
        let t = document.createTextNode(' ' + destItems[index]);
        li.classList.add('listItem');
        li.appendChild(t);
        let but = document.createElement('button');
        but.className = 'delete';
        but.innerHTML = 'X';
        but.addEventListener('click',this.remove(index,destItems));
        li.appendChild(but);
        return li;
    },

    attachToDOM: function(){
        while(this.list.firstChild)
            this.list.removeChild(this.list.firstChild);
        this.items.forEach((_, index, collection) => this.list.appendChild(this.createNode(index, collection)));
        this.doneItems.forEach((_, index, collection) => this.list.appendChild(this.createNode(index, collection)));
    }

}