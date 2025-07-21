let currentTab = null;
let startTime = null;
let siteData = {};

// Classify domains as productive or unproductive
const productiveSites = ['github.com', 'stackoverflow.com', 'w3schools.com'];
const unproductiveSites = ['facebook.com', 'instagram.com', 'youtube.com'];

function getDomain(url) {
  const a = document.createElement('a');
  a.href = url;
  return a.hostname.replace('www.', '');
}

function classifySite(domain) {
  if (productiveSites.includes(domain)) return 'productive';
  if (unproductiveSites.includes(domain)) return 'unproductive';
  return 'neutral';
}

function saveData() {
  chrome.storage.local.set({ siteData });
}

function switchTab(newUrl) {
  const now = Date.now();
  if (currentTab && startTime) {
    const duration = now - startTime;
    const domain = currentTab;
    const category = classifySite(domain);

    if (!siteData[domain]) {
      siteData[domain] = { time: 0, category };
    }
    siteData[domain].time += duration;
  }

  currentTab = getDomain(newUrl);
  startTime = now;
  saveData();
}

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab && tab.url && tab.url.startsWith('http')) {
      switchTab(tab.url);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete' && tab.url.startsWith('http')) {
    switchTab(tab.url);
  }
});

setInterval(() => {
  if (currentTab && startTime) {
    const now = Date.now();
    const duration = now - startTime;
    const domain = currentTab;
    const category = classifySite(domain);

    if (!siteData[domain]) {
      siteData[domain] = { time: 0, category };
    }
    siteData[domain].time += duration;
    startTime = now;
    saveData();
  }
}, 300000); // 5 min