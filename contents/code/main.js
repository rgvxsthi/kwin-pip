var browsers = {
  brave: "Picture in picture",
  chromium: "Picture in picture",
  "google-chrome": "Picture in picture",
  firefox: "Picture-in-Picture",
  waterfox: "Picture-in-Picture",
};

function isPip(window) {
  return (
    window.normalWindow &&
    Object.keys(browsers).includes(window.resourceName) &&
    window.caption === browsers[window.resourceName]
  );
}

function applyPip(window) {
  if (!isPip(window)) return;

  var area = workspace.clientArea(KWin.MaximizeArea, window);
  var pipHeightRatio = 0.25;
  var height = workspace.workspaceHeight * pipHeightRatio;
  var width = (window.width * height) / window.height;
  var x = area.width - width;
  var y = area.height - height;

  window.frameGeometry = { x, y, width, height };
  window.skipTaskbar = true;
  window.keepAbove = true;
}

function trackWindow(window) {
  // caption often set AFTER windowAdded -> apply now and on every caption change
  applyPip(window);
  window.captionChanged.connect(function () {
    applyPip(window);
  });
  // re-assert keepAbove if the browser/KWin clears it later
  window.keepAboveChanged.connect(function () {
    if (isPip(window) && !window.keepAbove) window.keepAbove = true;
  });
}

workspace.windowAdded.connect(trackWindow);

// re-track already-open windows on script (re)load
workspace.windowList().forEach(trackWindow);
