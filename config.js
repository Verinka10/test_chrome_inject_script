/**
 * 
 * Background config
 */

const _DEBUG_ = 1;
const _TEST_ = 0; //TODO in Model error

const _TRACE_TAB_EVENTS = 1;
const _TRACE_EXT_EVENTS = 0;

const _OLD_VER_COMMON = 32;


var configFun = {
		
		
		isUserLevelDev: function() {
			return configApp.userLevelClass == 'user-level-dev';
		},
		
		isUserLevelLow: function() {
			return configApp.userLevelClass == 'user-level-user';
		},
	
		isExists: function() {
			return localStorage.getItem(configApp._keyVer);
		},
		
		getDefaultTimeOutTempAllowSec: function() {
			return (Math.round(configApp.defaultTimeOutTempAllow / 1000));
		},
		
		
		load: function() {
			var dataString = localStorage.getItem(configApp._keyVer);
			if (dataString) {
				var data = JSON.parse(dataString);
				nik().cpyob(configApp, data);
				//configApp = data;
			}
		},
		
		save: function(data) {
			configApp.atUpdated = (new Date).toLocaleString();
			if (!this.isExists()) {
				configApp.atCreated = configApp.atUpdated;
			}
			data = data || configApp;
			localStorage.setItem(configApp._keyVer, JSON.stringify(data));
		},
		
		loadDef: function(opts) {
			opts = opts || {};
			
			//TODO clear configApp
			nik().cpyob(configApp, defConfig);
			//console.log(555, configApp);
			opts.noSave || configFun.save();
		},
		
		setDefaultResourceTypeOtherRequest: function() {
				if (!statusExtManager) return false;
				
				configApp.resourceTypeOtherRequest = [];
				configApp.resourceTypeOtherRequest = statusExtManager.info.chromeVersion <= 31 ? 
						nik().cpyob(configApp.resourceTypeOtherRequest, defaultResourceTypeOtherRequestOldVersion)
						: nik().cpyob(configApp.resourceTypeOtherRequest, defaultResourceTypeOtherRequest);
				configFun.save();
		},
		
		postInit: function() {
			configApp.resourceTypeOtherRequest || configFun.setDefaultResourceTypeOtherRequest();
		}
};

var configApp = {
		
		_keyVer:  'configInject7',
		
		stat: {
		},
      script_start: "(function(){\n// Script load start, start document\n\n})();",
      script_start_end: "(function(){\n// Script load start, end document\n\n})();",
	   script_idle: "(function(){\n// Script load idle, start document\n\n})();", 
      script_idle_end: "(function(){\n// Script load idle, end document\n\n})();", 
      script_onUpdated_complete_end: "(function(){\n// Script onUpdated tab, end document\n\n})();",
      
}

var defConfig = nik().cpyob({}, configApp);

if (!configFun.isExists()) {
	configFun.save();
}
configFun.load();
