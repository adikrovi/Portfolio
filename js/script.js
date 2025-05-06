document.body.classList.add('dark-mode');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || !savedTheme) {
  document.body.classList.add('dark-mode');
}

const toggleButton = document.getElementById('toggle-theme');
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
});
