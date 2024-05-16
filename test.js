
(function() {

	var TestExtension = function() {
		
		this.testOne = function() {
      }
		
		
		this.loadBeginning = function() {
			configFun.loadDef({noSave: true});
			//tabManager.loadStat = {};
		}
		
			
		this.end = function() {
			this.loadBeginning();
			configFun.load();
			//WebRequestRuleEngine.isTest = false;
			//singleRuleModel.setDisableTest();
		}
		
		this.startSafe = function() {
			try {
				//WebRequestRuleEngine.isTest = true;
				this.start();
			} catch(e) {
				//statusExtManager.setStatusTest(false, e);
				//WebRequestRuleEngine.isTest = false;
				//singleRuleModel.setDisableTest();
				throw e;
			}
		}
		
	};
	TestExtension.prototype = new Test;
	testExtension = new TestExtension; 
	_DEBUG_ && testExtension.startSafe();
})();