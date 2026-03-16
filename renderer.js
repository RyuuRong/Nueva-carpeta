const frame = document.getElementById('web-frame');
const addressBar = document.getElementById('address-bar');
const statusText = document.getElementById('status-text');
const engineBadge = document.getElementById('engine-badge');
const panelTitle = document.getElementById('panel-title');
const panelBody = document.getElementById('panel-body');

const historyStack = [addressBar.value];
let historyIndex = 0;

const panelData = {
  apps: {
    title: 'Apps rápidas',
    links: [
      { label: 'ChatGPT', url: 'https://chat.openai.com' },
      { label: 'YouTube', url: 'https://youtube.com' },
      { label: 'GitHub', url: 'https://github.com' },
      { label: 'Gmail', url: 'https://mail.google.com' }
    ]
  },
  history: {
    title: 'Historial reciente',
    links: []
  },
  bookmarks: {
    title: 'Favoritos',
    links: [
      { label: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
      { label: 'Electron', url: 'https://www.electronjs.org' }
    ]
  },
  settings: {
    title: 'Configuración',
    links: [
      { label: 'Privacidad (demo)', url: 'https://example.com/privacy' },
      { label: 'Motor Chromium', url: 'https://www.chromium.org' }
    ]
  }
};

const normalizeUrl = (value) => {
  const candidate = value.trim();
  if (!candidate) return 'https://example.com';
  if (/^https?:\/\//i.test(candidate)) return candidate;
  if (candidate.includes(' ') || !candidate.includes('.')) {
    return `https://duckduckgo.com/?q=${encodeURIComponent(candidate)}`;
  }
  return `https://${candidate}`;
};

const renderPanel = (panelKey) => {
  const panel = panelData[panelKey];
  panelTitle.textContent = panel.title;

  const links = panelKey === 'history'
    ? [...new Set(historyStack)].reverse().slice(0, 8).map((url) => ({ label: url, url }))
    : panel.links;

  panelBody.innerHTML = links
    .map(
      (link) =>
        `<a class="quick-link" href="#" data-url="${link.url.replace(/"/g, '&quot;')}">${link.label}</a>`
    )
    .join('');
};

const navigate = (target, record = true) => {
  const url = normalizeUrl(target);
  frame.src = url;
  addressBar.value = url;
  statusText.textContent = `Cargando ${url}`;

  if (record) {
    historyStack.splice(historyIndex + 1);
    historyStack.push(url);
    historyIndex = historyStack.length - 1;
  }
};

const setActiveSidebarButton = (button) => {
  document.querySelectorAll('.sidebar-icon').forEach((item) => {
    item.classList.toggle('active', item === button);
  });
};

frame.addEventListener('load', () => {
  statusText.textContent = `Listo: ${addressBar.value}`;
});

document.getElementById('go-btn').addEventListener('click', () => navigate(addressBar.value));
document.getElementById('reload-btn').addEventListener('click', () => {
  navigate(addressBar.value, false);
});
document.getElementById('back-btn').addEventListener('click', () => {
  if (historyIndex > 0) {
    historyIndex -= 1;
    navigate(historyStack[historyIndex], false);
  }
});
document.getElementById('forward-btn').addEventListener('click', () => {
  if (historyIndex < historyStack.length - 1) {
    historyIndex += 1;
    navigate(historyStack[historyIndex], false);
  }
});

addressBar.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    navigate(addressBar.value);
  }
});

document.querySelectorAll('.sidebar-icon').forEach((button) => {
  button.addEventListener('click', () => {
    setActiveSidebarButton(button);
    renderPanel(button.dataset.panel);
  });
});

panelBody.addEventListener('click', (event) => {
  const element = event.target;
  if (!(element instanceof HTMLAnchorElement)) return;
  const url = element.dataset.url;
  if (!url) return;
  event.preventDefault();
  navigate(url);
});

engineBadge.textContent =
  `${window.browserInfo?.engine ?? 'Motor desconocido'} · ${window.browserInfo?.sidebarMode ?? ''}`;
renderPanel('apps');
navigate(addressBar.value, false);
