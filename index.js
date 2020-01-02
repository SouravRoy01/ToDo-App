import util from './todoUtils';
import todoApp from './todo';
        
window.onload = () => {
    const savedData = util.getSavedData();
    todoApp.init(savedData);  
}

window.onunload = () => {
    const records = todoApp.records;
    localStorage.setItem('saved', JSON.stringify(records));
}