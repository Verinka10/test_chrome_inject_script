/**
 * v 1.11 (add sync)
 */

(function() {

	var Test = function() {
		
		var count = 0;
		var countOk = 0;
		var counTest = 0;
		var countIgnore = 0;
		var countError = 0;
		var currTest;
		var tim;
		var _ctx = this;
		this.continueOnError;
		
		
		this.asyncTimeout = 7000;
		var asyncEndStack = {};
		var intAsync;
		var hasError;
		
		
		function ok(idAsync) {
			countOk++;
			if (idAsync){
				//console.info('test async', asyncEndStack[ idAsync ]);
				delete asyncEndStack[ idAsync ];
			}
		}
		
		
		this.error = function (mes, idAsync) {
			
			
			if (!this.continueOnError && hasError) {
				return;
			}
			
			hasError = true; 
			countError++;
			console.trace();
			if (idAsync) {
				delete asyncEndStack[ idAsync ];
			}
			
			if (!this.continueOnError) {
				this.end && this.end.call(this);
				this.outResults();
				intAsync && clearInterval(intAsync);
				throw mes;
			} else 
				console.error(mes);
		}
		
		this.assertTrue = function(expression, message, idAsync) {
			count++;
			if (expression) ok(idAsync);
				else this.error('error: ' + currTest + (message ? ' ' + message : ''));
		}
		
		
		this.assertCount = function(arrayActual, expectLen, message, idAsync) {
			count++;
			if (arrayActual.length == expectLen) ok(idAsync);
				else this.error('error: ' + currTest + (" " + arrayActual.length + "!=" + expectLen + " ") + (message ? ' ' + message : ''));
		}
		
		
		this.assertNotUndefined = function(actual, message, idAsync) {
			count++;
			if (actual !== undefined) ok(idAsync);
				else this.error('error: ' + currTest + (" " + actual + " result") + (message ? ' ' + message : ''));
		}
		
		
		this.assertInstanceof = function(actual, expect, message, idAsync) {
			count++;
			if (actual instanceof expect) ok(idAsync);
				else this.error('error: ' + currTest + (" " + actual + " not instanceof") + ' ' + ' ' + (message ? ' ' + message : ''));
		}
		
		
		this.assertEqual = function(actual, expected, message, idAsync) {
			count++;
			if (typeof expected == 'object') expected = JSON.stringify(expected);
			if (typeof actual == 'object') actual = JSON.stringify(actual);
			
			if (actual == expected) ok(idAsync);
				else this.error('error: ' + currTest + (" " + actual + '!=' + expected + " ") + (message ? ' ' + message : ''), idAsync);
		}
		
		/*this.assertEqualAsync = function(actual, expected, timeout, message) {
			setTimeout(function(){ _ctx.assertEqual(actual, expected, message); }, timeout);
		}*/
		
		
		this.addWaiteEndAsync = function(params) {
			params = params || {id: Object.keys(asyncEndStack).length + 1}; 
			asyncEndStack[ params.id ] = params;
		}
		
		this.deleteAsyncEndWaite = function(idAsync) {
			delete asyncEndStack[ idAsync ];
		}
		
		
		this.start = function() {
			_ctx = this; //refresh
			this.startTest && this.startTest.call(this);
			//try {
				tim = (new Date).getTime();
				for (var i in this) {
					if (i.toString().match(/^test/)) {
						counTest++;
						currTest = i;
						console.log('test: ' + i);
						this[ i ].call(this);
					}
				}
			//} //catch(e) {
			//	throw e;
			//}
			/*if (this.asyncTimeout) {
				setTimeout(this.outResults(), this.asyncTimeout);
			} else
				this.outResults();*/
			//console.log(111, asyncEndStack);	
			//console.info('end', _ctx.end);
			if (Object.keys(asyncEndStack).length) {
				console.info('wait empty asyncEndStack...', asyncEndStack);
				var timAsync = (new Date).getTime();
				
				intAsync = setInterval(function() {
					//console.info('white empty asyncEndStack', asyncEndStack, (new Date).getTime() - timAsync , _ctx.asyncTimeout);
					if (Object.keys(asyncEndStack).length == 0) { 
						clearInterval(intAsync);
						//countError || _ctx.outResults();
						//countError || _ctx.end && _ctx.end.call(_ctx);
						_ctx.outResults();
						_ctx.end && _ctx.end.call(_ctx);
						//console.info('white end', asyncEndStack);
					}
					if ((new Date).getTime() - timAsync > _ctx.asyncTimeout) {
						_ctx.outResults();
						//_ctx.end && _ctx.end.call(_ctx);
						clearInterval(intAsync);
						hasError = true;
						throw 'async timeout';
					}
					
				}, 100);
			} else {
				this.outResults();
				this.end && this.end.call(this);
			}
		}
		
		this.outResults = function() {
			console.log('test done: ' + counTest + 
					'\nassert done: ' + count +
					'\nerrors: ' + countError +
					'\nignore: ' + countIgnore +
					'\nok: ' + countOk +
					(Object.keys(asyncEndStack).length ?  '\nasync stack count: ' + Object.keys(asyncEndStack).length : '') +
					'\n' + (((new Date).getTime() - tim) / 1000) + ' sec'
					);
		}
		
	}
	
	window.Test = Test;
})();