/**
 * 
 * Content start controller
 */
(function() {
		//chrome.runtime.sendMessage({command: 'doc_inf2', location: location});
		//chrome.runtime.sendMessage({command: 'content_start'});
		//console.log('content start');
	chrome.runtime.sendMessage({command: 'content_start'});
	chrome.runtime.sendMessage({command: 'web-request-before'});
})();



