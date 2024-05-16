
(function() {
	
	var tab;
	var bg = chrome.extension.getBackgroundPage();
	
   document.addEventListener('DOMContentLoaded', function () {
      
      localizeHtmlPage();
      
      nik('#opt-more').addev('click', function(){
         chrome.tabs.create({"url":  chrome.extension.getURL("options.html"), "selected": true});
      });
   
   });

})();
