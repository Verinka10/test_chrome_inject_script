
(function() {
	
	var curRule;
   var bg = chrome.extension.getBackgroundPage();
   
	// params get
	var paramsHost = location.search.match(/(host\=)([^&]+)/);
	if (paramsHost) paramsHost = paramsHost[2];
	//
	
	document.addEventListener('DOMContentLoaded', function () {
		console.log('load opt script');
      
      // init tab
      nik("#tab1").tab();
      nik("#tab1").tab({changed: function(n, cont) { 
         bg.curOptionTab = n; 
      }});
      bg.curOptionTab && nik("#tab1").tab({activeIndex: bg.curOptionTab});
      
      
      
      // init ui first state 
      nik("#cont-data-start-start").find().get().value = bg.configApp.script_start;
      nik("#cont-data-idle-start").find().get().value = bg.configApp.script_idle;
      nik("#cont-data-script_onUpdated_complete_end").find().get().value = bg.configApp.script_onUpdated_complete_end;
      
      nik("#json-raw-config").find().get().value = JSON.stringify(bg.configApp, null, ' ');
      
      
      
      
      // init ui events 
      nik('#button-save-start-start').addev("click", function(e) {
         bg.configApp.script_start = nik("#cont-data-start-start").find().get().value;
         lineMessager.fix().ok({message: "Saved ok!"});
      });
      nik('#cont-data-start-start').addev("change", function(e) { nik("#button-save-start-start").find().get().dispatchEvent(new Event("click")); });
      
      nik('#button-save-idle-start').addev("click", function(e) {
         bg.configApp.script_idle = nik("#cont-data-idle-start").find().get().value;
         lineMessager.fix().ok({message: "Saved ok!"});
      });
      nik('#cont-data-idle-start').addev("change", function(e) { nik("#button-save-idle-start").find().get().dispatchEvent(new Event("click")); });
      
      nik('#button-save-script_onUpdated_complete_end').addev("click", function(e) {
         bg.configApp.script_onUpdated_complete_end = nik("#cont-data-script_onUpdated_complete_end").find().get().value;
         lineMessager.fix().ok({message: "Saved ok!"});
      });
      nik('#cont-data-script_onUpdated_complete_end').addev("change", function(e) { nik("#button-save-script_onUpdated_complete_end").find().get().dispatchEvent(new Event("click")); });
      
         // raw config
      nik('#button-raw-config-save').addev("click", function(e) { 
         try {
            var data = JSON.parse(nik('#json-raw-config').find().get().value);
            bg.configFun.save(data);
            bg.configFun.load();
         } catch(e) {
            lineMessager.fix().war({message: "Error parse json " + e});
            return;
         }
         lineMessager.fix().ok({message: "Saved raw config"});
     });
      
			
	}); //loaded

})();