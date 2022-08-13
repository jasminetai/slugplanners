import { toggleClass } from '../utils.js';

document.querySelector('.menu-icon').addEventListener('click', function() {
  toggleClass(this, 'click');
  toggleClass(document.querySelector('.sidebar'), 'show');
});

document.querySelector('.class-btn').addEventListener('click', function() {
  toggleClass(document.querySelector('nav ul .class-show'), 'show');
  toggleClass(document.querySelector('nav ul .first'), 'rotate');
});

document.querySelector('.res-btn').addEventListener('click', function() {
  toggleClass(document.querySelector('nav ul .res-show'), 'show2');
  toggleClass(document.querySelector('nav ul .first'), 'rotate');
});

document.querySelector('nav ul li').addEventListener('click', function() {
  document.querySelectorAll('nav ul li').forEach(element => element.classList.remove('active'))
  this.classList.add('active');
});
