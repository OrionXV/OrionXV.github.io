(() => {
  const button = document.querySelector('.theme-toggle');
  if (!button) return;
  const root = document.documentElement;
  const browserColour = document.querySelector('meta[name="theme-color"]');

  const applyTheme = (value, persist = false) => {
    const theme = value === 'disco' ? 'disco' : 'sunset';
    root.dataset.appearance = theme;
    button.setAttribute('aria-checked', String(theme === 'disco'));
    button.title = theme === 'disco' ? 'Switch to Sunset theme' : 'Switch to Disco theme';
    if (browserColour) browserColour.content = theme === 'disco' ? '#1c2423' : '#241a3b';
    if (persist) {
      try {
        localStorage.setItem('arsalaan-theme', theme);
      } catch (_) {
        // A blocked storage write must not prevent an in-page theme change.
      }
    }
  };

  applyTheme(root.dataset.appearance);
  button.hidden = false;
  button.addEventListener('click', () => applyTheme(root.dataset.appearance === 'disco' ? 'sunset' : 'disco', true));
  window.addEventListener('storage', (event) => {
    if (event.key === 'arsalaan-theme' || event.key === null) applyTheme(event.newValue);
  });
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    try {
      applyTheme(localStorage.getItem('arsalaan-theme'));
    } catch (_) {
      // Keep the current palette when a cached page cannot read storage.
    }
  });
})();

(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#site-links');
  if (!toggle || !menu) return;

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(expanded));
    menu.classList.toggle('is-open', expanded);
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.sunset-nav')) closeMenu();
  });
  window.matchMedia('(min-width: 881px)').addEventListener('change', closeMenu);
})();
