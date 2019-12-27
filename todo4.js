window.onload = () => todo.init();
let todo={

    items:[],
    list: [],
    init: function(){
        this.items = (["Build the ToDo App","Learn Design Patterns"]);
        this.list = document.querySelector('.myList');
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this); 
        this.attachToDOM = this.attachToDOM.bind(this);
        this.createNode = this.createNode.bind(this);
        let addButton = document.querySelector('#add');
        let taskInput = document.querySelector('.inputTask');
        addButton.addEventListener("click",this.add);
        taskInput.addEventListener("keydown",() => {
            if(event.code=="Enter")
            this.add();
        });
        this.attachToDOM();
    },

    add: function(){
        let input = document.querySelector('.inputTask').value.trim();
        if(input!=='')
            this.items.includes(input)?alert("Task already exists"):(this.items.push(input), this.list.appendChild(this.createNode(this.items.length-1)));
        
        document.querySelector('.inputTask').value='';
    },

    remove: function(item){
        return () => {
            this.items.splice(item,1);
            this.attachToDOM();
        }          
    },

    createNode: function(item){
        let li = document.createElement("li");
        let cbox = document.createElement("input");  //
        cbox.type = "checkbox";   //
        cbox.checked=true;
        
        li.appendChild(cbox);     //
        let t = document.createTextNode(" " + this.items[item]);
        li.className="listItem";
        li.appendChild(t);
        let but = document.createElement("button");
        but.className="delete";
        but.innerHTML="X";
        but.addEventListener("click",this.remove(item))
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