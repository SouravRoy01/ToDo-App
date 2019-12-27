window.onload = () => todo.init();
let todo={

    items:[],
    list: [],
    init: function(){
        this.items = [{ value:'Build the ToDo App', striked:false }, { value:'Learn Design Patterns', striked:false }];
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
            this.items.some(item => item.value === input)
            ? alert('Task already exists')
            : (
                this.items.push({ value: input }), 
                this.list.appendChild(this.createNode(this.items.length-1))
            );
        document.querySelector('.inputTask').value='';
    },

    remove: function(item){
        return () => {
            this.items.splice(item,1);
            this.attachToDOM();
        }          
    },

    strike: function(item){
        return () => {
            const itemValue = this.items[item];
            itemValue.striked=!itemValue.striked;
            if (itemValue.striked) {                            //  Send striked items at the last
                this.items.splice(item, 1);
                this.items.push(itemValue);
            }
            this.attachToDOM();
        }
    },

    createNode: function(item){
        let li = document.createElement('li');
        let cbox = document.createElement('input');  //
        cbox.type = 'checkbox';   //

        if(this.items[item].striked) {
            cbox.checked=true;
            li.classList.add('strike');
        }

        cbox.addEventListener('click',this.strike(item));
        
        li.appendChild(cbox);     //
        let t = document.createTextNode(' ' + this.items[item].value);
        li.classList.add('listItem');
        li.appendChild(t);
        let but = document.createElement('button');
        but.className='delete';
        but.innerHTML='X';
        but.addEventListener('click',this.remove(item));
        li.appendChild(but);
        return li;
    },

    attachToDOM: function(){
        while(this.list.firstChild)
            this.list.removeChild(this.list.firstChild);
        //this.items.forEach((item) => this.list.appendChild(this.createNode(item)));
        for(let item in this.items){
            this.list.appendChild(this.createNode(item));
        }
    }

}