    const darkModeToggle = document.querySelector('#theme-selector');
    let manuallySpecifiedDarkMode = false;
    const body = document.querySelector('body');
    let darkMode = localStorage.getItem('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;

    const toggleDarkMode = () => {
        darkModeToggle.classList.toggle('dark-mode-active')
        body.classList.toggle('dark')
        darkMode ? localStorage.setItem('dark', "true") : localStorage.removeItem('dark');

    }
    if (darkMode) {
        toggleDarkMode()
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (manuallySpecifiedDarkMode) return;
        darkMode = !darkMode
        toggleDarkMode()
    });

    darkModeToggle.addEventListener('click', e => {
        e.preventDefault()
        darkMode = !darkMode;
        manuallySpecifiedDarkMode = true;
        toggleDarkMode()
    })


