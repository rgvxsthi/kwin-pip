var browsers = {
  brave: "Picture in picture",
  chromium: "Picture in picture",
  "google-chrome": "Picture in picture",
  firefox: "Picture-in-Picture",
  waterfox: "Picture-in-Picture",
};

var pipHeightRatio = 0.25;

function isPip(window) {
  return (
    window.normalWindow &&
    Object.keys(browsers).includes(window.resourceName) &&
    window.caption === browsers[window.resourceName]
  );
}

function placeGeometry(window) {
  // clientArea() is per-monitor and excludes panels; it carries the monitor's
  // x/y offset, so add them to land in the correct screen's bottom-right corner.
  var area = workspace.clientArea(KWin.MaximizeArea, window);
  var height = area.height * pipHeightRatio;
  var width = (window.width * height) / window.height;
  var x = area.x + area.width - width;
  var y = area.y + area.height - height;

  window.frameGeometry = { x, y, width, height };
}

function applyPip(window) {
  if (!isPip(window)) return;

  window.skipTaskbar = true;
  window.keepAbove = true;

  // Place once so the user can freely move/resize afterwards; later caption
  // events won't snap it back to the corner.
  if (!window.pipPlaced) {
    placeGeometry(window);
    window.pipPlaced = true;
  }
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
