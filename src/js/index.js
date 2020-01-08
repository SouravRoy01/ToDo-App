/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import css from '../css/style.css';
import util from './todoUtils';
import todoApp from './todoApp';

window.onload = () => {
  const savedData = util.getSavedData();
  todoApp.init(savedData);
};

window.onunload = () => {
  const { records } = todoApp;
  localStorage.setItem('saved', JSON.stringify(records));
};
