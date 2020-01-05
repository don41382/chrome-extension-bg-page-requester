
const TIMER_NAME = "timer";

var runRefresh = function(cfg) {

  // query current tab, open new tab, remove new tab
  chrome.tabs.query({highlighted: true}, function (tabs) {
    var lastTab = tabs.pop();

    chrome.tabs.create({ url: cfg.url }, afterTabOpen.bind(this, lastTab));  
  });

  var afterTabOpen = function(lastTab, newTab) {   
    // return to last tab
    if (lastTab) {
      chrome.tabs.highlight({
        windowId: lastTab.windowId,
        tabs: lastTab.index
      }, function () {});
    }

    // remove new tab after 5 seconds
    setTimeout(function () {
      chrome.tabs.get(newTab.id, function(rtab) {
        chrome.tabs.remove(rtab.id, function () {});
      });
    }, 5 * 1000);

  };
 
};


var refresh = function() {
  chrome.storage.sync.get({
    url: 'https://www.google.com',
    active: false
  }, function(cfg) {
    if (cfg.active) {
      runRefresh(cfg);
    }
  });
};

var setTimer = function() {
  chrome.storage.sync.get({
    repeatTime: 1
  }, function (cfg) {
    chrome.alarms.clearAll(() => {
      chrome.alarms.create(TIMER_NAME, {
        delayInMinutes: parseInt(cfg.repeatTime),
        periodInMinutes: parseInt(cfg.repeatTime)
      });
    });
  });
}

// on timer triggers
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === TIMER_NAME) {
    refresh();
  }
});

// create timer on refresh
chrome.storage.onChanged.addListener(function () {
  setTimer();
});

// create on chrome startup
chrome.windows.onCreated.addListener(function() {
  setTimer();
});