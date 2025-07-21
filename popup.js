document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('data');
  const clearBtn = document.getElementById('clear');

  chrome.storage.local.get('siteData', data => {
    const usage = data.siteData || {};
    const sorted = Object.entries(usage).sort((a, b) => b[1].time - a[1].time);

    let productiveTotal = 0;
    let unproductiveTotal = 0;

    sorted.forEach(([site, info]) => {
      const mins = Math.round(info.time / 60000);
      const div = document.createElement('div');
      div.textContent = `${site}: ${mins} min (${info.category})`;
      div.className = info.category;
      container.appendChild(div);

      if (info.category === 'productive') productiveTotal += mins;
      if (info.category === 'unproductive') unproductiveTotal += mins;
    });

    const summary = document.createElement('div');
    summary.innerHTML = `
      <hr>
      <strong>Summary:</strong><br>
      Productive Time: ${productiveTotal} min<br>
      Unproductive Time: ${unproductiveTotal} min
    `;
    container.appendChild(summary);
  });

  clearBtn.addEventListener('click', () => {
    chrome.storage.local.clear(() => {
      container.innerHTML = '';
    });
  });
});