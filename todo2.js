window.onload = () => {
    let items = ["Dispose Garbage","Wash the dishes","Go to the gym","Build the ToDo App","Pay Electricity Bill","Clean the washbasin"];
    reloadTodo();
    let add = document.querySelector('#add');
    add.addEventListener("click",enter);
    document.addEventListener("keydown",function(){
        if(event.code=="Enter")
            enter();
    });
    
    function reloadTodo(){
        let list = document.querySelector('.myList');
        while(list.firstChild)
            list.removeChild(list.firstChild);
        for(let item in items){
            let li = document.createElement("li");
            let t = document.createTextNode(items[item]);
            li.className="listItem";
            li.appendChild(t);
            let but = document.createElement("button");
            but.className="delete";
            but.innerHTML="X";
            but.id=`btn${item}`;
            li.appendChild(but);
            list.appendChild(li);
        }
        let del=Array.from(document.getElementsByClassName('delete'));
        del.forEach(element => {
            element.addEventListener("click",function(){
            items.splice(element.id[3],1)
            reloadTodo();
            })
        });  
    }

    function enter(){
        let input = document.querySelector('.inputTask').value.trim();
        if(input!=='')
            items.includes(input)?alert("Task already exists"):items.push(input);
        reloadTodo();
    }

}