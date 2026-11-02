document.getElementById("download").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.id) {
    return;
  }

  const [{ result: images = [] } = {}] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      return Array.from(document.images)
        .map(img => img.currentSrc || img.src)
        .filter(src => src && !src.startsWith("data:"));
    }
  });

  for (let i = 0; i < images.length; i++) {
    chrome.downloads.download({
      url: images[i],
      filename: `images/image-${i + 1}`,
      conflictAction: "uniquify",
      saveAs: false
    });
  }
});