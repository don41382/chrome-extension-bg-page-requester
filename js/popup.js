function save_options() {
	var inputUrl = document.getElementById('inputUrl');
	var inputRepeatTime = document.getElementById('inputRepeatTime');
	var inputActive = document.getElementById('inputActive');
	chrome.storage.sync.set({
		url: inputUrl.value,
		repeatTime: inputRepeatTime.value,
		active: inputActive.checked
	}, function () {
		window.close();
	});
}

function load_options() {
  chrome.storage.sync.get({
    url: 'https://www.google.com',
    repeatTime: 10,
    active: false
  }, function(cfg) {
    $('#inputUrl').val(cfg.url);
    $('#inputRepeatTime').val(cfg.repeatTime);
    $('#inputActive').prop('checked', cfg.active);
  });
}

document.addEventListener('DOMContentLoaded', (event) => {
	load_options();
	document.getElementById('save').addEventListener('click',save_options);	
});
