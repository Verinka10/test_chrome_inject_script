/**
 *  nikjs
 *  v1.1225 setAttr
 *  v1.1224 (form, setForm)
 *  v1.1224 (fix getData)
 *  v1.1223 (ajax - funend)
 *  v1.122 (cookie) 
 *  v1.121
 */

(function() {

	
		var DebugLog = function() {
			this.count_remove = 0;
			this.count_find_ok = 0;
			this.count_findAll_ok = 0;
			this.count_each_ok = 0;
		}
				
		
		
		var coreNik = new function() {

			var last_created;
			//var ctx = this;
			var is_find_all;
			
			this.resetResults = function(){
				this.results = [];
				this.length = 0;
			}
			
			//TODO make private
			this.isArrayResult = function() {
				return 	is_find_all ||
						this.roots && this.roots.length > 1 ||
						this.selectors && !this.selectors.nodeName && this.selectors.length > 1;// ||
						//TODO test
						//this.length > 1;
			}
				
			this.find = function(and) {
				is_find_all = false;
				//TODO
				if (this.results && this.results.length) { 
					for (var i = 0; i < this.results.length; i++) {
						and && this.isF(and) && and.call(this, this.results[i], i);
						this.length++;
					}
				} 
				else
			for (var k=0; k<this.roots.length; k++) {
				if (this.selectors) {
					for (var i = 0; i < this.selectors.length; i++) {
						var element = this.roots[k].querySelector(this.selectors[i]);
						if (element) {
							this.__debug_log && this.__debug_log.count_find_ok++;
							and && this.isF(and) && and.call(this, element, i);
							this.length++;
							this.results.push(element);
						}
					}
				}
				//return element;
			}
				
			if (typeof and === 'string') {
				//TODO if reset result?
				//return this.instance(and, this.results).find();
				//TODO test
				if (this.results && this.results.length)
					return nik(and, this.results).find();
			}
				return this;
			}
			
			
			this.findAll = function(and) {
				
				is_find_all = true;
				/*if (!and) {
				console.log(222, this.roots);
				//return;
				}*/
				
				if (this.selectors) {
					for (var k=0; k<this.roots.length; k++) {
					for (var i = 0; i < this.selectors.length; i++) {
						var elements = this.roots[k].querySelectorAll(this.selectors[i]);
						if (elements.length) {
							and && this.isF(and) && and.call(this, elements, i);
if (this.__debug_log) this.__debug_log.count_findAll_ok+= elements.length;
							this.length += elements.length;
							this.results = this.results.concat(Array.prototype.slice.call(elements));
						}
					}
				}
			 }
				if (typeof and === 'string') {
					//TODO
					if (this.results && this.results.length)
						return nik(and, this.results).findAll();
				}
				return this;
			}

			this.each = function(fun, funforArray) {
				is_find_all = true;
				//this.root = this.root || this;
				//var count = 0;
				if (this.isA(fun)) {
					for (var i = 0; i < fun.length; i++) {
						if (funforArray){
							funforArray.call(this, fun[i], i);
							//this.results.push(fun[i]);
						}
						//count++;
						this.length++;
					}
				} 
				if (this.isO(fun) && !this.isF(fun)) {
					for (var i in fun) {
						funforArray.call(this, fun[i], i);
						this.length++;
					}
				}
				else
				// TODO
				if (this.results && this.results.length) {
					for (var i = 0; i < this.results.length; i++) {
						fun && fun.call(this, this.results[i], i);
if (this.__debug_log) this.__debug_log.count_each_ok++;
						//this.length++;
					}
				} 
				else
				if (this.selectors) {
				for (var k=0; k<this.roots.length; k++) {
					for (var i = 0; i < this.selectors.length; i++) {

						var elements = this.roots[k].querySelectorAll(this.selectors[i]);
if (this.__debug_log) this.__debug_log.count_each_ok+= elements.length;
						
						for (var j = 0; j < elements.length; j++) {
							fun && fun.call(this, elements[j], j);
							//this.results.push(elements[j]);
							this.length++;
						}
					}
				}
			  }

				return this;
			}
			
			
			this.isA = function(ob) {
				return Array.prototype.isPrototypeOf(ob);
			}
			
			this.isF = function(ob) {
				return Function.prototype.isPrototypeOf(ob);
			}
			
			this.isO = function(ob) {
				return Object.prototype.isPrototypeOf(ob);
			}

			this.cr = function(pat, child) {
				if (pat.toString().match(/^\s*<.+>\s*$/m)) {
					var cont = document.createElement("div");
					cont.innerHTML = pat;
					pat = cont.firstChild;
				} else if (pat
						.toString()
						.match(
								/^(div|span|a|b|i|p|form|input|select|option|ul|li|ol|a|link|meta|title|fieldset|legend|body|canvas|button|textarea)$/))
					pat = document.createElement(pat);
				else
					pat = document.createTextNode(pat);
				if (child)
					pat.appendChild(this.cr(child));
				
				last_created = pat;
				return pat;
			}
			
			this.getCreated = function() {
				return last_created ? nik(last_created) : last_created;  
			}
			

			this.append = function(el) {
				return this.find(function(cont){  cont.appendChild(typeof el == 'object' ? el : this.cr(el));  });
			}

			this.after = function(el) {
				return this.find(function(elA){ elA.parentNode.insertBefore(typeof el == 'object' ? el : this.cr(el), elA.nextSibling);  });
			}

			this.before = function(el) {
				return this.find(function(elA){ elA.parentNode.insertBefore(typeof el == 'object' ? el : this.cr(el), elA);  });
			}
			
			
			this.insert = function(el) {
				return this.find(function(cont){  cont.insertBefore(typeof el == 'object' ? el : this.cr(el), cont.firstChild);  });
			}

			this.remove = function(fun) {
				return this.find(function(el){ 
						el && el.parentNode.removeChild(el); 
						this.__debug_log && el && this.__debug_log.count_remove++;
						//console.log(444, el);
					});
			}
			
			this.exists = function(and) {
				return this.find(and).length > 0;
			}

			this.removeAll = function(fun) {
				return this.each(function(el) {
					el.parentNode.removeChild(el);
				});
			}
			
			this.setAttr = function(attributes) {
				return this.each(function(el) {
					for (var i in attributes) {
						el.setAttribute(i, attributes[ i ])
					}
				});
			}
			
			//TODO make aplly for nik
			this.cpyob = function(d, s, noreplace) {
				for ( var p in s) {
					if (s[p] && typeof s[p] === 'object' && !this.isF(s[p])) {
						if ((!(p in d) && noreplace) || !noreplace)
							if (Element.prototype.isPrototypeOf(s[p]))
								d[p] = s[p].cloneNode(true);
							else {
								d[p] = this.isA(s[p]) ? [] : {};
								this.cpyob(d[p], s[p], noreplace);
							}
					} else {
						if ((!(p in d) && noreplace) || !noreplace) {
							d[p] = s[p];
						}
					}
				}
				return d;
			}
			
			//TODO tree support
			this.formToObj = function(specFields){
				specFields = specFields || {};
				var o = {};
				var cont = this.find().get(0);
				cont && cont.nik("input, textarea, select").each(function(el) {
					var name = el.getAttribute("name");
					if (name) {
						
						//if (el.nodeName == 'TEXTAREA')
						//	o[ name ] = el.innerHTML;
						
						//if (el.nodeName == 'INPUT')	
						switch (el.type) {
							case 'checkbox':
							case 'radio':
								o[ name ] = el.checked; 
								break;
								default:
									o[ name ] = el.value;
						} 
						switch (el.nodeName.toLowerCase()) {
							case 'select':
								//TODO eq(selectedIndex)
								o[ name ]= el.nik('option').findAll().get(el.selectedIndex).value;
								break;
						}
						//TODO test
						o[ name ] = specFields[ name ] && specFields[ name ].value 
									? specFields[ name ].value.call(this, o[ name ]) : o[ name ];
					}
				});
				return o;
			}
			
			//TODO tree support
			this.setForm = function(o, modelSpace, specFields) {
				var cont = this.find().get(0);
				cont && cont.reset();
				cont && cont.nik("input, textarea, select").each(function(el) {
					var name = el.getAttribute("name");
					if (name) {
						if (modelSpace) name = name.replace(new RegExp(modelSpace + "\\[(\\w+)\\]"), '$1');
						var value = specFields && specFields[ name ] && specFields[ name ].value 
									? specFields[ name ].value.call(this, o[ name ]) : o[ name ];
											
						//if (el.nodeName == 'TEXTAREA')
						//	el.innerHTML = value;
									
						//if (el.nodeName == 'INPUT')			
						switch (el.type) {
							case 'checkbox':
							case 'radio':
								el.checked = value; 
								break;
								default:
									if(value) el.value =  value;
						} 
						
						switch (el.nodeName.toLowerCase()) {
						case 'select':
							//TODO [value="1"]
							if (value === null) el.selectedIndex = 0;
								else
									el.selectedIndex = value ? 1 : 2; 
							break;
					}
					}
				});
				return o;
			}
			
			
			this.addev = function(events, fun) {
				
				//var _ctx = this;
				
				return this.each(function(el) {
					events.split(',').forEach(function(ev) {
						ev = ev.replace(/\s+/,'');
						//console.log('each: ', el);
						if(el.addEventListener)
							el.addEventListener(ev,fun,false);
						else  if(el.attachEvent)  el.attachEvent("on" + ev, fun);
					});
				});
			}
			
			this.setData = function(data, key) {
				/*return this.each(function(el) {
					el.nikdata = el.nikdata || {};
					el.nikdata[ key ? key : 'def'] = data;	
				});*/
				var el = this.get();
				el.nikdata = el.nikdata || {};
				el.nikdata[ key ? key : 'def'] = data;
				return this;
				
			}
			
			
			this.getData = function(key, defaultData) {
				//var data = this.find().get() && this.find().get().nikdata;
				var data = this.get() && this.get().nikdata;
				return data !== undefined && data[key ? key : 'def'] || defaultData;
			}

			//*************************** get results, value or other filter
			
			/*this.get = function(n) {
				return this.results[n ? n : 0];
			}*/
			
			/*this.get = function(n) {
				n = n || 0;
				return this.results.length ? this.results[ n ] : null;
			}
			
			this.getAll = function() {
				return this.results;
			}*/
			
			this.get = function() {
				if (this.isArrayResult())
					return this.results;
				 else
					 return this.results.length ? this.results[0] : null;  
			}
			
			this.getFirst = function() {
				var result = this.get();
				return this.isA(result) ? result[0] : result;
			}
			
			/*this.getVal = function() {
				 if (!this.results) {
					 this.__debug_log && console.error('this.result no init, call find before it');
					 return null;
				 }
				 var results = [];
				 this.results.forEach(function(el) {
				 });
				 return results.length > 1 ? results : results;
			}*/

			var internal_getVal = function(el) {
				switch (el.nodeName.toLowerCase()) {
					case 'input':
					case 'textarea':
						if (el.type == 'checkbox' || el.type == 'radio')
							return el.checked;
						else
							return el.value;
						break;
					default:
				}
			}
			
			//****************************
			

			this.ajax = function(opts) {
				var g = new XMLHttpRequest;
				var saccess = false;

				opts = this.cpyob({
					type: 		'GET',
					headers: 	[],
					async:	true,
					timeOut: 	50000	//msec
				}, opts);

				// TODO data for post encode
				
				g.onreadystatechange = function() {
					if (g.readyState == 4) {
						if (g.status == 200) {
							saccess = true;
							try {
								// TODO
								// Lastmod =видел, воспроизвести не могу
								// g.getResponseHeader("Last-Modified");
								// Etag = g.getResponseHeader("Etag");
							} catch (e) {
							}
							opts.funok && opts.funok.call(this, g.responseText, g);
						} else 
							opts.fune && isF(opts.fune) && opts.fune.call(this, g);
						
						opts.funend && opts.funend.call(this, g.responseText, g);	
					}
				}

				g.open(opts.type, opts.url, opts.async);
				//g.setRequestHeader("If-Modified-Since", Lastmod || "Thu, 05 Jan 1982 00:00:00 GMT");
				//g.setRequestHeader("If-None-Match", Etag || "NikR");
				if (opts.type == 'POST') {
					g.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					//opts.data && g.setRequestHeader("Content-length", opts.data.length);
					for (var i in opts.headers) {
						g.setRequestHeader(opts.headers[ i ].name, opts.headers[ i ].value);
					}
				}
				//g.setRequestHeader("Connections", "close");
				g.send(opts.data);
				//console.log('nikr.ajax', 'request: ' + opts.url);
				
				if (opts.fune) {
					setTimeout(function() {
						if (!saccess) {
							g.abort();
							this.isF(opts.fune) && opts.fune.call(this, g);
						}
					}, opts.timeOut);
				}
				return g;
			}
			
			
			
			this.setCookie = function (name, value, expires, path, domain, secure) {
			     var curCookie = name + "=" + escape(value) +
			             ((expires) ? "; expires=" + expires.toUTCString() : "") +
			             ((path) ? "; path=" + path : "") +
			             ((domain) ? "; domain=" + domain : "") +
			             ((secure) ? "; secure" : "");
			     document.cookie = curCookie; 
			}


			this.getCookie = function (name) {
			        var prefix = name + "=";
			        var cookieStartIndex = document.cookie.indexOf(prefix);
			        if (cookieStartIndex == -1)
			                return null;
			        var cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length);
			        if (cookieEndIndex == -1)
			                cookieEndIndex = document.cookie.length;
			        return unescape(document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex));
			}
			
			/**
			 * see classAdd classDel to use
			 */
			function strListReplace(str, substr, replaced, delimit, uniq) {
				delimit = delimit || ' ';
				uniq = uniq || true; 
				var list = str.split(delimit);
				var index = list.indexOf(substr);
				if (index > -1) {
					// replace or delete
					var params = [index, 1];
					if (replaced) params.push(replaced);
					list.splice.apply(list, params);
				} else if (!substr && replaced) {
					// add
					if (!uniq || list.indexOf(replaced) == -1)
					list.push(replaced);
				}
				return list.join(delimit);
			}
			
			
			this.classAdd = function(className) {
				return this.each(function(el) {
					el.className = strListReplace(el.className, '', className);
				});
			}
			
			this.classDel = function(className) {
				return this.each(function(el) {
					el.className = strListReplace(el.className, className);
				});
			}
			
			this.classToggle = function(classNameA, classNameB) {
				classNameB = classNameB || '';
				return this.each(function(el) {
					if (el.className.indexOf(classNameA) > -1)
						el.className = strListReplace(el.className, classNameA, classNameB);
					else
					 if (el.className.indexOf(classNameB) > -1)
						el.className = strListReplace(el.className, classNameB, classNameA);
					 else
						 el.className = strListReplace(el.className, '', classNameA);
				});
			}
			
			this.classExists = function(className) {
				var res = false;
				this.each(function(el) {
					if (res) return;
					if ((new RegExp('(\\s|^)'+ className +'(\\s|$)')).test(el.className)) res = true;
				});
				return res;
			}

			
			
			//Array.prototype.each = this.each;
		}

		var instance = function(roots, selectors) {
			this.roots = roots;
			this.length = 0;
			this.results = [];
			this.ctx = this;
			//XXX
			//this.instance = this;
			
			//console.log(555, roots);
			
			// TODO
			if (typeof selectors === 'object') {
				//nodeName
				this.results = this.results.concat(Array.prototype.slice.call(this.isA(selectors) ? selectors : [selectors]));
				//console.log(555, this.results, selectors);
			}
			selectors = typeof selectors == 'string' ? selectors.split(',') : selectors;
			//console.log(333, selectors);
			
			this.selectors = selectors;
			
			this.__debug_log = new DebugLog();
			
			
			this.getInstancePrototype = function() {
				return instance.prototype;
			}
			
			return this;
		}
		instance.prototype = coreNik;

		
		var nik = function(selectors, roots) {
			
		if (!roots || !roots.length) {	
			
	   roots = [this];
			
	   for (var i=0; i<roots.length; i++) {
			if ('parent' in this
					&& (this['parent'] == '[object Window]' || this['parent'] === window))
				roots[i] = document.documentElement;
			

			if (typeof roots[i] === 'string' || roots[i] instanceof String) {
				 var d = document.createElement('div'); 
				 d.innerHTML = root;
				 roots[i] = d;
			}
		}
	   //console.log(333, roots);
	  }
		//console.log(555, roots);
			return new instance(roots, selectors);
		//this.instance = new instance(roots, selectors);
		//return this.instance;
		}

		
		
		
		// init
		window.nik = nik;
		document.nik = nik;
		Element.prototype.nik = nik;
		String.prototype.nik = nik;
})();
    
