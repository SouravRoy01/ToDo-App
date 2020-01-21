/* eslint-disable no-undef */

function getSavedData() {
  if (!('notFirstLoad' in localStorage)) {
    const record = {
      'List 1': { items: ['Build the ToDo App'], doneItems: ['Learn Design Patterns'] },
      'List 2': { items: ['Optimize the ToDo App'], doneItems: ['Learn Flexbox'] },
    };
    localStorage.setItem('notFirstLoad', true);
    localStorage.setItem('saved', JSON.stringify(record));
  }
  return JSON.parse(localStorage.getItem('saved'));
}

function debounce(func, interval) {
  let timeout;
  function debouncer(...rest) {
    const context = this;
    const args = rest;
    this.style.height = 'auto';
    this.style.height = `${this.scrollHeight}px`;
    const later = () => {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, interval);
  }
  return debouncer;
}

export default { getSavedData, debounce };
