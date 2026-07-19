var browsers = {
  brave: "Picture in picture",
  chromium: "Picture in picture",
  "google-chrome": "Picture in picture",
  firefox: "Picture-in-Picture",
  waterfox: "Picture-in-Picture",
};

// Corner enum order must match contents/config/main.xml.
var TOP_LEFT = 0, TOP_RIGHT = 1, BOTTOM_LEFT = 2, BOTTOM_RIGHT = 3;

function readNumber(key, def) {
  var n = parseFloat(readConfig(key, def));
  return isNaN(n) ? def : n;
}

function readBool(key, def) {
  return String(readConfig(key, def)) === "true";
}

// Read once on (re)load; KWin reloads the script when settings are applied.
var config = {
  heightRatio: readNumber("HeightPercent", 25) / 100,
  corner: readNumber("Corner", BOTTOM_RIGHT),
  margin: readNumber("Margin", 0),
  keepAbove: readBool("KeepAbove", true),
  skipTaskbar: readBool("SkipTaskbar", true),
};

function isPip(window) {
  return (
    window.normalWindow &&
    Object.keys(browsers).includes(window.resourceName) &&
    window.caption === browsers[window.resourceName]
  );
}

function placeGeometry(window) {
  // clientArea() is per-monitor and excludes panels; it carries the monitor's
  // x/y offset, so add them to land in the correct screen's chosen corner.
  var area = workspace.clientArea(KWin.MaximizeArea, window);
  var m = config.margin;
  var height = area.height * config.heightRatio;
  var width = (window.width * height) / window.height;

  var left = area.x + m;
  var top = area.y + m;
  var right = area.x + area.width - width - m;
  var bottom = area.y + area.height - height - m;

  var pos;
  switch (config.corner) {
    case TOP_LEFT: pos = { x: left, y: top }; break;
    case TOP_RIGHT: pos = { x: right, y: top }; break;
    case BOTTOM_LEFT: pos = { x: left, y: bottom }; break;
    default: pos = { x: right, y: bottom }; break; // BOTTOM_RIGHT
  }

  window.frameGeometry = { x: pos.x, y: pos.y, width: width, height: height };
}

function applyPip(window) {
  if (!isPip(window)) return;

  window.skipTaskbar = config.skipTaskbar;
  if (config.keepAbove) window.keepAbove = true;

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
    if (config.keepAbove && isPip(window) && !window.keepAbove)
      window.keepAbove = true;
  });
}

workspace.windowAdded.connect(trackWindow);

// re-track already-open windows on script (re)load
workspace.windowList().forEach(trackWindow);
