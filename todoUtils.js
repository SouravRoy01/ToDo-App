/* eslint-disable no-unused-vars */
function importUtil(){
    return {
        getSavedData() {
            if (!('notFirstLoad' in localStorage)) {
                const record = {
                    "List 1": { items: ['Build the ToDo App'], doneItems: ['Learn Design Patterns'] },
                    "List 2": { items: ['Optimize the ToDo App'], doneItems: ['Learn Flexbox'] }
                };
                localStorage.setItem("notFirstLoad", true);
                localStorage.setItem('saved', JSON.stringify(record));
            }
            return JSON.parse(localStorage.getItem('saved'));
        } ,

        createCustomElement(tag, properties, children = []) {
            let ele = document.createElement(tag);
            
            Object.assign(ele, properties);

            if (children.length) children.forEach(element => ele.appendChild(element))
            
            return ele;
        }
    }
}