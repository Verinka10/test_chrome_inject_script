/**
 * 
 * Background controller
 */

var activeTabId;

window.backgroundController = new (function() {
	
	this.tabs_onActiveChanged = function(tabId, changeInfo, tab) {
		chrome.tabs.get(tabId, function(tab){
			activeTabId = tab.id;
			_TRACE_TAB_EVENTS && console.log('tab onActiveChanged activeTabId:', activeTabId);
			//iconManager.setTextStatus();
		});
	};
	
	this.windows_onFocusChanged = function(windowId) {
		if (windowId > -1) {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				activeTabId = tabs[0].id;
				_TRACE_TAB_EVENTS && console.log('tab onFocusChanged activeTabId:', activeTabId);
				//iconManager.setTextStatus();
			});
		}
	};
	
	this.tabs_onUpdated = function(tabId, changeInfo, tab) {
		_TRACE_TAB_EVENTS && console.log('tab onUpdated', tabId, changeInfo, tab);
		
		//tabManager.loadStat[ tab.id ] = tabManager.loadStat[ tab.id ] || {};
		//tabManager.loadStat[ tab.id ].tab = tab;
		
		if (changeInfo.status == 'loading') {
			_TRACE_TAB_EVENTS && console.log('tab onUpdated loading:', tabId, changeInfo);
			
		}
      
		if (changeInfo.status == 'complete') { 
			_TRACE_TAB_EVENTS && console.log('tab onUpdated complete:', tabId, changeInfo);
			//tabManager.markMainJsAsOld(tabId);
         configApp.script_onUpdated_complete_end && chrome.tabs.executeScript(tabId, {code: configApp.script_onUpdated_complete_end, runAt: 'document_end'});
		}
	};
	
	this.tabs_onRemoved = function(tabId, changeInfo, tab) {
		_TRACE_TAB_EVENTS && console.log('tab onRemoved:', tabId);
	};
	
	this.runtime_onMessage = function(message, sender, sendResponse) {
		if (message.command == 'content_start') {
			console.log('message.command == content_start');
         configApp.script_start && chrome.tabs.executeScript(sender.tab.id, {code: configApp.script_start, runAt: 'document_start'});
         configApp.script_start_end && chrome.tabs.executeScript(sender.tab.id, {code: configApp.script_start_end, runAt: 'document_end'});
		}
      
      if (message.command == 'content_idle') {
         console.log('message.command == content_idle');
         configApp.script_idle && chrome.tabs.executeScript(sender.tab.id, {code: configApp.script_idle, runAt: 'document_start'});
         configApp.script_idle_end && chrome.tabs.executeScript(sender.tab.id, {code: configApp.script_idle_end, runAt: 'document_end'});
      }
	};
	
	this.webNavigation_onBeforeNavigate = function(details) {
		_TRACE_TAB_EVENTS && console.log('onBeforeNavigate:', details);
	}
	//TODO test
	this.webNavigation_onTabReplaced = function(details) {
		_TRACE_TAB_EVENTS && console.log('onTabReplaced:', details);
	}
	
	/*
	chrome.webNavigation.onCommitted.addListener(function(details) {
			console.log('onCommitted:', details);
	});
		
	chrome.webNavigation.onCompleted.addListener(function(details) {
		console.log('onCompleted:', details);
	});
		
	console.log('onDOMContentLoaded:', details);
	});
	*/
	
	this.runtime_onInstalled = function(info) {
		_TRACE_EXT_EVENTS && console.log ("onInstalled", info);
		//testExtension.startSafe();
	};
	
	
	this.up = function() {
      
		chrome.runtime.onInstalled.addListener(this.runtime_onInstalled);
		chrome.tabs.onActiveChanged.addListener(this.tabs_onActiveChanged);
		chrome.windows.onFocusChanged.addListener(this.windows_onFocusChanged);
		chrome.tabs.onUpdated.addListener(this.tabs_onUpdated);
		chrome.tabs.onRemoved.addListener(this.tabs_onRemoved);
		chrome.runtime.onMessage.addListener(this.runtime_onMessage);
		
		if (chrome.webNavigation) {
			chrome.webNavigation.onBeforeNavigate.addListener(this.webNavigation_onBeforeNavigate);
			chrome.webNavigation.onTabReplaced.addListener(this.webNavigation_onTabReplaced);
		} else {
			statusExtManager.setWarns('chrome.webNavigation not define for old chrome');
		}
	}
	
	this.down = function() {
		chrome.runtime.onInstalled.removeListener(this.runtime_onInstalled);
		chrome.tabs.onActiveChanged.removeListener(this.tabs_onActiveChanged);
		chrome.windows.onFocusChanged.removeListener(this.windows_onFocusChanged);
		chrome.tabs.onUpdated.removeListener(this.tabs_onUpdated);
		chrome.tabs.onRemoved.removeListener(this.tabs_onRemoved);
		chrome.runtime.onMessage.removeListener(this.runtime_onMessage);
		
		if (chrome.webNavigation) {
			chrome.webNavigation.onBeforeNavigate.removeListener(this.webNavigation_onBeforeNavigate);
			chrome.webNavigation.onTabReplaced.removeListener(this.webNavigation_onTabReplaced);
		}
	}
	
	return this;
})();


(function() {
	
	
	(function init() {
		
		//statusExtManager.initExt();
      backgroundController.up();
		_TRACE_EXT_EVENTS && console.log('start ext - content bg');
		
	})();
	
})();