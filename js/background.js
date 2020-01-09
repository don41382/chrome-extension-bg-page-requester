
const TIMER_NAME = "timer";

function loadTabDetailsAfterLoad(tab, callback) {
  chrome.tabs.query({windowId: tab.windowId, index: tab.index}, function (tabs) {
    const ntab = tabs.pop();
    if (ntab !== undefined && tab.status == "loading") {
      setTimeout(function() {
        loadTabDetailsAfterLoad(ntab, callback);
      }, 500);
    } else {
      return callback(tab);
    }    
  });
}

function runRefresh(cfg) {

  // query current tab, open new tab, remove new tab
  chrome.tabs.query({highlighted: true, currentWindow: true}, function (tabs) {
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

    loadTabDetailsAfterLoad(newTab, function (loadedTab) {

      if (cfg.expectedPageTitle === '' || loadedTab.title.startsWith(cfg.expectedPageTitle)) {

        // remove new tab after 5 seconds
        setTimeout(function () {
          chrome.tabs.get(newTab.id, function(rtab) {
            chrome.tabs.remove(rtab.id, function () {});
          });
        }, 5 * 1000);

      } else {

        // highlight the window and show error
        chrome.tabs.highlight({
          windowId: newTab.windowId,
          tabs: newTab.index
        }, function () {
          alert('Loaded page with title "'+loadedTab.title+'" didn\'t match expected title: "'+cfg.expectedPageTitle)+'"';
        });    
      }

    });

  };
 
};


function refresh() {
  chrome.storage.local.get({
    url: 'https://www.google.com',
    expectedPageTitle: '',
    active: false
  }, function(cfg) {
    if (cfg.active) {
      runRefresh(cfg);
    }
  });
};

function setTimer() {
  chrome.storage.local.get({
    repeatTime: 1
  }, function (cfg) {
    chrome.alarms.clearAll(() => {
      chrome.alarms.create(TIMER_NAME, {
        delayInMinutes: parseFloat(cfg.repeatTime),
        periodInMinutes: parseFloat(cfg.repeatTime)
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
  refresh();
});

// create on chrome startup
chrome.windows.onCreated.addListener(function() {
  setTimer();
});
