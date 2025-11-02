(function () {
    var STORAGE_KEY = 'theme';
    var body = document.body;
    var toggle = null;
    var toggleIcon = null;
    var toggleLabel = null;

    function getSystemPreference() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function getSavedTheme() {
        try { return localStorage.getItem(STORAGE_KEY) || ''; }
        catch (e) { return ''; }
    }

    function saveTheme(theme) {
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { }
    }

    function applyTheme(theme) {
        body.setAttribute('data-theme', theme);
        document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#0b0f14' : '#ffffff');
        if (toggleIcon && toggleLabel) {
            if (theme === 'dark') {
                toggleIcon.classList.remove('fa-sun');
                toggleIcon.classList.add('fa-moon');
                toggleLabel.textContent = 'Dark';
            } else {
                toggleIcon.classList.remove('fa-moon');
                toggleIcon.classList.add('fa-sun');
                toggleLabel.textContent = 'Light';
            }
        }
    }

    function init() {
        toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggleIcon = toggle.querySelector('.icon');
            toggleLabel = toggle.querySelector('.toggle-label');
            toggle.addEventListener('click', function () {
                var current = body.getAttribute('data-theme') || getSystemPreference();
                var next = current === 'dark' ? 'light' : 'dark';
                applyTheme(next);
                saveTheme(next);
            });
        }

        var saved = getSavedTheme();
        var initial = saved || getSystemPreference();
        applyTheme(initial);

        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
                var savedNow = getSavedTheme();
                if (!savedNow) applyTheme(e.matches ? 'dark' : 'light');
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();



