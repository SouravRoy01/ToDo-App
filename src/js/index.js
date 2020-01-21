/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import css from '../css/style.css';
import util from './todoUtils';
import app from './app';
import getDataInstance from './data';

window.onload = () => {
  const savedData = util.getSavedData();
  getDataInstance(savedData);
  app.init();
};

window.onunload = () => {
  const records = getDataInstance().getData;
  localStorage.setItem('saved', JSON.stringify(records));
};
