function save_options() {
	var inputUrl = $('#inputUrl');
	var inputRepeatTime = $('#inputRepeatTime');
	var inputExpectedPageTitle = $('#inputExpectedPageTitle');
	var inputActive = $('#inputActive');
	chrome.storage.local.set({
		url: inputUrl.val(),
		repeatTime: inputRepeatTime.val(),
		expectedPageTitle: inputExpectedPageTitle.val(),
		active: inputActive.is(':checked')
	}, function () {});
	window.close();
}

function load_options() {
  chrome.storage.local.get({
    url: 'https://www.google.com',
    repeatTime: 10,
    expectedPageTitle: '',
    active: false
  }, function(cfg) {
    $('#inputUrl').val(cfg.url);
    $('#inputRepeatTime').val(cfg.repeatTime);
    $('#inputExpectedPageTitle').val(cfg.expectedPageTitle);
    $('#inputActive').prop('checked', cfg.active);
  });
}

document.addEventListener('DOMContentLoaded', (event) => {
	load_options();
	$('#save').click(save_options);	
});