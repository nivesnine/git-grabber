function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

function checkGit(currentUrl, callback, errorCallback) {
  var x = new XMLHttpRequest();
  x.open('GET', currentUrl);
  x.onload = function() {
    if (x.status == 404) {
      renderStatus('No git exposed');
      return;
    }
    else if(x.status != 200){
      renderStatus('Git might be exposed' + x.status);
      return;
    }
    else{
      renderStatus('Git exposed');
      return;
    }
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    renderStatus('Performing Git check for ' + url);
    checkGit(url + '.git');
  });
});
