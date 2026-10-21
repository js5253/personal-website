const element = document.querySelectorAll('.grid-i-outer');


element.forEach(elem => elem.addEventListener('mouseenter', () => {
  elem.querySelector('.grid-i-slide').classList.toggle('hidden');
}));


element.forEach(elem => elem.addEventListener('mouseleave', () => {
  elem.querySelector('.grid-i-slide').classList.toggle('hidden');
}));