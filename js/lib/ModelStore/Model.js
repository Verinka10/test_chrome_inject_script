/**
 *  v1.23 add group and index by function
 *  v1.212 ModelData().model -> singleton
 *  v1.21 afterDelete, beforeDelete events and data raiseEvent. Add if (true) before events
 *  v1.2 (findByAttributes for relation (and test it), find by condition field, applyFilter condition fun: regexp, fun..)
 *  v1.123 (getFilterByAttr, case sent, remove regexp, attrOpts)
 *  v1.12 (setAttr, getFilterByAttr) 
 *  v1.113 (fabrica getClassModel)
 *  v1.112 (add count)
 *  v1.11 (add version 1.11 first)
 *

	  example:
	 
			 var ModelData = getClassModel(function() {
					this.name_model = 'ModelData';
					this.attrOpts = [
						{name: "id"},
						{name: "name", def: ""},
						{name: "name2", def: ""},
					];
					
					this.optsFinder = {driverStore: 'memory'};
					
			 });
			 console.log(ModelData().model.findAll());
			 console.log(ModelData().modelHelper...);
			 
			 // init more
			 for (var i = 0; i < 311 ; i++) {
				   ModelData().newModel({
					   name: 'model_'  + i, 
					   name2: 22, 
					   sex: 44 
					}).save();
			   }
			   
			//  v2
			ModelData().model.getCopy({group_id: 3, user_id: 2}).save();
		
	 */

window._DEBUG_ = 1; //TODO in conf

(function() {

	
	(function() {
		var _data = {};
		
		var MemoryModel = function() {
			
			this.internal_getItem = function(id) {
				//console.log('internal_getItem', _data, id);
				return _data[ id ];
			};
			
			
			this.internal_removeItem = function(id) {
				delete _data[ id ];
			};
			
			
			this.internal_setItem = function(id, row) {
				//console.log('internal_setItem', _data, id, row);
				_data[ id ] = row;
			};
			
			
			this.internal_clearAll = function() {
				_data = {};
			};
			
			
			this.internal_getRawData = function() {
				return _data;
			};
			
		}
		window.MemoryModel = MemoryModel;
	})();
	
	
	var LocalStoreModel = function() {
		
		this.internal_getItem = function(id) {
			return localStorage.getItem(id);
		};
		
		
		this.internal_removeItem = function(id) {
			return localStorage.removeItem(id);
		};
		
		
		this.internal_setItem = function(id, row) {
			return localStorage.setItem(id, row);
		};
		
		
		this.internal_clearAll = function() {
			localStorage.clear();
		};
		
		
		this.internal_getRawData = function() {
			throw 'not support LocalStoreModel getRawData';
		};
		
	}
	
	
	
	var Model = function() {
		
		/**
		 * spaceNameModel if filterFormObj nik("#filer-model").formToObj() and name such ModelData[name]...
		 */
		this.setAttr = function(attr, spaceNameModel, onlySafe) {
			if (!this.raiseEvent('beforeSetAttr', attr)) {
				return this;
			}
			for (var i in attr) {
				var name = i;
				if (spaceNameModel) {
					name = i.toString().match(new RegExp((typeof spaceNameModel == 'string' ? 
							spaceNameModel : this.name_model) + "\\[(\\w+)\\]"))[1];  
				}
				if (name in this.attr)
					this.attr[ name ] = attr[ i ];
				//else throw i + ' not defined in ' + JSON.stringify(this.attr);
				else if (onlySafe)
					console.error(name + ' not defined in ' + JSON.stringify(this.attr));
			}
			this.raiseEvent('afterSetAttr');
			return this;
		}
		
		
		//this.getInstance = function(modelClass) {
		//	return new modelClass; 
		//}
		
		/**
		 	var modelSearch = new ModelData;			
			var filterFormObj = nik("#filer-model").formToObj();
			modelSearch.setAttr(filterFormObj, true);
			table.setFilter(modelSearch.getFilterByAttr({caseSent: 1}));
		 */
		this.getFilterByAttr = function(opts) {
			opts = opts || {};
			
			var filters = '';
			for (var i in this.attr) {
				var value = this.attr[i];
				//TODO filter false 3 status checkbox
				// value === false || 
				if (value === "" || value === null || value === undefined) continue;
				//filters += (filters ? " && " : '') + ("t." + i + ".toString()."  + (opts.caseSent ? "indexOf(\""+value+"\") != -1" : "match(/"+value.replace(/([\[\]\.\*\?\+\^\$])/g, '\\$1')+"/i)"));
				filters += (filters ? " && " : '');
				//console.log(this.attrOptsName[ i ]);
				
				var wt = this.attrOptsName[ i ].type;
				if (wt && wt.match(/^(bool)/)) {
					filters += "t." + i + "==" + value;
					continue;
				}
				
				if (opts.caseSent) {
					filters += "t." + i + ".toString().indexOf(\""+value+"\") != -1";
				} else
					filters += "t." + i + ".toString().toLowerCase().indexOf(\""+value.toString().toLowerCase()+"\") != -1";
			}
			//console.log(222, filters);
			return filters ? filters : null;
		}
		
	};
	
	
	
	var DataHashAccess = function(storeModel, preFilters, postFilters, preIdFilters) {
	
			this.processFilter = function(d, filters, method, params) {
				//console.log('filter: ', d, method);
				for (var i in filters) {
					if(filters[i][ method ]) 
						d = filters[i][ method ].call(filters[i], d, params);
				}
				return d;
			}
			
			
			this.hasPreFilters = function() {
				return preFilters && preFilters.length;
			}
			
			this.hasPostFilters = function() {
				return postFilters && postFilters.length;
			}
			
			this.hasIdPreFilters = function() {
				return preIdFilters && preIdFilters.length;
			}
			
			
			
			
			this.get = function(id, opts) {
				
				opts = opts || {};
				
				
				if (!opts.disableIdPreFilter && this.hasIdPreFilters()) id = this.processFilter(id, preIdFilters, 'decode');
				
				var d = this.internal_getItem(id);
				if (!opts.disablePreFilter && this.hasPreFilters()) d = this.processFilter(d, preFilters, 'decode');
				if (!opts.raw && d) d = JSON.parse(d);
				if (!opts.disablePostFilter && this.hasPostFilters()) d = this.processFilter(d, postFilters, 'decode');
				
				return d;
			}
			
			
			this.set = function(id, value, opts) {
				opts = opts || {};
				
				if (!opts.disableIdPreFilter && this.hasIdPreFilters()) id = this.processFilter(id, preIdFilters, 'encode');
				
				if (!opts.disablePostFilter && this.hasPostFilters()) value = this.processFilter(value, postFilters, 'encode');
				if (!opts.raw) value = JSON.stringify(value);
				// TODO save store as array (more compact!)
				//console.log('set: ', id,  value, typeof value);
				
				if (!opts.disablePreFilter && this.hasPreFilters()) value = this.processFilter(value, preFilters, 'encode');
				return this.internal_setItem(id, value);
			}
			
			
			this.remove = function(id, opts) {
				opts = opts || {};
				if (!opts.disablePreFilter && this.hasPreFilters()) this.processFilter(null, preFilters, 'remove', id);
				return this.internal_removeItem(id);
			}
			
			
			this.removeAll = function(opts) {
				opts = opts || {};
				if (!opts.disablePreFilter && this.hasPreFilters()) this.processFilter(null, preFilters, 'removeAll');
				return this.internal_clearAll(); 
			}
			
			
			this.getRaw = function(opts) {
				opts = opts || {};
				var d = this.internal_getRawData();
				if (!opts.disablePreFilter && this.hasPreFilters()) d = this.processFilter(d, preFilters, 'getRaw');
				return d;
			}
			
			
			storeModel.apply(this);
	};
	
	
	
	var FinderModel = function(_opts) { //TODO _opts -> globalOpts
	
		
		var _filters = [];
		_opts = _opts || {};
		//TODO _opts 
		var opts_ttt = {};
		
		
		this.isNew = true;
		//this.driverStore = _opts.driverStore;
		
		this.getAutoIncrement = function() {
			//return parseInt(localStorage.getItem(this.sysKeyName('_sys_autoincrement'))) || 0;
			return parseInt(this.dataHashAccess.get(this.sysKeyName('_ai'), {raw:1})) || 0;
		}
		
		this.setAutoIncrement = function(n) {
			this.dataHashAccess.set(this.sysKeyName('_ai'), n, {raw:1});
		}
		
		this.sysKeyName = function(id) {
			return this.name_space + '_' + this.name_model + ( id ? '_' + id : '');
		}
		
		//TODO
		/*function defOpts(opts) {
			for (var i in opts)
				_opts[ i ] = opts[ i ]; 
			return _opts; 
		}*/
		
		
		/////////////// public
		
		
		this.dump = function(opts) {
			opts = opts || {};
			
			var _ctx = this;
			var data = opts.compactLevel > 1 ? '' : ('\n//---------------------  '+ this.name_space + '.' +  this.name_model + '  ---------------------\n');
			
			if (opts.v2) {
				data += ('this.internal_setItem("'+ this.sysKeyName('_ai') +'", ' +  this.getAutoIncrement()  + ');');	
				this.forEach(function(v) {
					data += ('\nthis.internal_setItem("'+ _ctx.sysKeyName(v.id) +'", \'' +  JSON.stringify(v)  + '\');');
				}, {noPopulate : 1});
				data += '\n//------------------ end ------------------';
				
				
			} else {
				//opts.noPopulate = 1;
				opts.optsDataHash = {raw:1};
				//var models = [];
				//console.log(222, this.findAll(opts));
				data += '[';
				this.forEach(function(v) {
					//console.log(this);
					//models.push(JSON.stringify(v));
					//data += (typeof v == 'string' ? v : JSON.stringify(v)) + ",\n";
					data +=  v + ',' + (opts.compactLevel ?  '' : "\n");
				}, opts);
				data = data.replace(/[,\n]+$/, '');
				data += ']';
				//data += models.join(',\n');	
			}
			
			// index
			if (opts.withAllIndex) {
				for (var key in this.skeys) {
					opts.field = key;
					opts.index = key;
					var keyValues = this.findAll(opts);
					for (var value in keyValues) {
						var index = this.getModelIndex(key, value);
						//console.log(111, index.findAll(opts));
						data += index.dump();  
					}
					/*this.forEach(function($_) {
					}, {noPopulate : 1});*/ //TODO up variant if memory down
				}
			}

			return data;
		}
		
		
		this.import = function(data, opts) {
		
			opts = opts || {};
			
			if (typeof data == 'string') {
				data = data.replace(/\/\/.+/g, '');
				data = JSON.parse(data);
			}
			var addIndex = 0;
			for (var i = 0; i < data.length; i++) {
				var model = new this.instance(_opts);
				model.setAttr(data[i]);
				model.save({noFreshIndex: 1});
				addIndex += model.analuser__.numTotalIndexAdd;
			}
			console.log('import rows:' + i + ' index add: ' + addIndex);
		}
		
		
		this.exportToJson = function(opts, indent) {
			opts = opts || {};
			opts.noPopulate = 1;
			
			var model = new this.instance();
			var res = [];
			model.forEach(function(v) {
				if (!opts.withId) delete v.id;
				
				if (!opts.nullInclude) {
					for (var i in v) 
						if (v[ i ] === null) delete v[ i ]; 
				}
				
				if (opts.excludeFilds) {
					for (var i in opts.excludeFilds) 
						if (opts.excludeFilds[ i ] in v) delete v[ opts.excludeFilds[ i ] ];
				}
				
				res.push(v);
			}, opts);
			
			return JSON.stringify(res, null, indent);
		}
	
		
		this.importToJson = function(data, opts) {
			
			opts = opts || {};
			
			var data = JSON.parse(data);
			for (var i = 0; i < data.length; i++) {
				var model = new this.instance();
				model.setAttr(data[ i ]).save();
			}
		}
		
		
		
		this.save = function(opts) {
			opts = opts || {};
		
			if (!this.raiseEvent('beforeSave')) {
				return false;
			}
			//if (this.isNew)
			
			var ai = this.getAutoIncrement();
			
			if (this.attr.id > ai) {
				this.setAutoIncrement(this.attr.id);
			}
			
			if (!this.attr.id) {
				this.attr.id = ai + 1;
				this.setAutoIncrement(this.attr.id);
				this.addAllKeyFieldToIndex();
				
			} else if (opts.noFreshIndex) {
				
				this.addAllKeyFieldToIndex();
				
			} else {
				var oldAttr = this.findByPk(this.attr.id, {noPopulate: 1, optsDataHash: opts.optsDataHash});
				if (oldAttr) {
					//if (this.isNew)
					//	throw 'new model can not replace exist model';
					this.freshKeyFieldsToIndex(oldAttr);
					//this.isNew = false;
					//if (oldAttr.id != this.attr.id) this.isNew = true;
					//oldAttr.id != this.attr.id && this.addAllKeyFieldToIndex();
				} else
					this.addAllKeyFieldToIndex();
			} 
			
			//this.isNew && this.addAllKeyFieldToIndex();
			
			//console.log('save on key',this.sysKeyName(this.attr.id),  JSON.stringify(this.attr));
			
			var attr = this.attr;
			if (!opts_ttt.asJsonStorageRow) {
				attr = [];
				//for (var i in this.attr)
				//	attr.push(this.attr[ i ]);
				for (var i = 0;  i < this.attrOpts.length; i++) {
					//var value = this.attr[ this.attrOpts[i].name ];
					var attrOpts = this.attrOpts[i];
					var value = this.evaluteAttrBeforeSave(attrOpts.name, attrOpts.type, attrOpts.ftype);
					attr.push(value);
				}
			}
			
			this.dataHashAccess.set(this.sysKeyName(this.attr.id), attr, opts.optsDataHash);
			this.isNew = false;
			this.raiseEvent('afterSave');
			
			return true;
		}
		
		
		
		this.findByPk = function(id, opts) {
			opts = opts || {};
			//console.log('get pk :', this.sysKeyName(id), id);
			//var attr = localStorage.getItem(this.sysKeyName(id));
			var attr = this.dataHashAccess.get(this.sysKeyName(id), opts.optsDataHash);
			if (attr) {
				//this.raiseEvent('beforeFind'); TODO
				// array -> attr object
				if (!opts_ttt.asJsonStorageRow) {
					/*var attrTo = {};
					var posKey = 0;
					for (var i in this.attr) {
						attrTo[ i ] = attr[ posKey ];
						posKey++;
					}*/
					
					var attrTo = {};
					for (var i = 0;  i < this.attrOpts.length; i++) {
						attrTo[ this.attrOpts[i].name ] = attr[i];
					}
					attr = attrTo;
				}
				
				
				//if(!opts.raw) attr = JSON.parse(attr);
				if (opts.optsDataHash && opts.optsDataHash.raw  || opts.noPopulate) {
					//console.log(888, opts.optsDataHash, attr);
					return attr;
				}
				var model = new this.instance(_opts);
				model.name_space = this.name_space;
				model.name_model = this.name_model;
				model.setAttr(attr);
				//this.raiseEvent('afterFind'); TODO
				return model;
			}
			return null;
		}
		
		/*index*/
		
		this.getModelIndex = function(key, value) {
			if (! (key in this.skeys)) 
				throw 'not define "' + key  + '" sk in skeys ';
			
			var opts = this.skeys[key] || {};
			//opts.driverStore = this.driverStore; 
			opts.driverStore = opts_ttt.driverStore;
			//console.log(777, this, opts);
			var index = new Index(opts);
			index.name_space = this.sysKeyName('i');
			index.name_model = key + "_" + (value === undefined ? 'null' : value);
			return index;
		}
		
		
		this.delKeyFieldToIndex = function(key) {
			var index = this.getModelIndex(key, this.attr[ key ] == undefined ? null : this.attr[ key ]);
			//console.log(999, key, this.attr[ key ]);
			//console.log('index all', index);
			index = index.find('t.ref_id == ' + this.attr.id);
			//console.log('index to del:', index, this.attr.id);
			index.deleteModel();
this.analuser__ && this.analuser__.numTotalIndexDelete++;
		}
		
		
		this.delAllKeyFieldToIndex = function() {
			for (var key in this.skeys) {
				this.delKeyFieldToIndex(key);
			}
		}
		
		
		this.addKeyFieldToIndex = function(key) {
			var index = this.getModelIndex(key, this.attr[ key ] == undefined ? null : this.attr[ key ]);
			index.attr.ref_id = this.attr.id;
			index.save();
this.analuser__ && this.analuser__.numTotalIndexAdd++;
		}
		
		
		this.addAllKeyFieldToIndex = function() {
			for (var key in this.skeys) {
				//if (this.attr[ key ] == undefined) continue; //TODO check
				this.addKeyFieldToIndex(key);
			}
		}
		
		this.freshKeyFieldsToIndex = function(oldAttr) {
			
			if (!this.attr.id)
				throw 'only init id reccord freash index';
				
			if (!oldAttr) return;
			
			for (var key in this.skeys) {
				//console.log(111, this.attr);
				if (oldAttr[ key ] != this.attr[ key ]) {
					//_DEBUG_ && console.log('change attr:', key);
					
					var index = this.getModelIndex(key, oldAttr[ key ]);
					index = index.find('t.ref_id == ' + this.attr.id);
					//console.log('index to del:', index);
					index.deleteModel();
					
					this.addKeyFieldToIndex(key);
this.analuser__ ? this.analuser__.numTotalIndexFresh++ : null;
					
				}
			}
		}
		
		
		
		this.findAllBySk = function(skeys, opts) {
			
this.analuser__ ? this.analuser__.numFindRow = 0 : null;				
this.analuser__ ? this.analuser__.numFilterCompareRow = 0 : null;

			this.applyFilter(opts);
			opts = opts || {};
			var res =  opts.index || opts.group ? {} : [];
			var _ctx = this;
			
			this.limitProvider.normalizeOption(opts);
			//var start = this.limitProvider.getStart(opts);
			var start = 1;
			//TODO skeys && or || finds  
			
			// merge indexes for more sk field
			var indexMerges;
			if (Object.keys(skeys).length > 1) {
				indexMerges = {};
				for (var key in skeys) {
					var index = this.getModelIndex(key, skeys[ key ]);
					//indexMerges.concat(index.findAll({noPopulate: 1})); 
					index.forEach(function($_) {
						if (!indexMerges[ $_.ref_id ]) indexMerges[ $_.ref_id ] = 0;
						indexMerges[ $_.ref_id ]++;
					},{noPopulate: 1});
				}
				//console.log('indexMerges', indexMerges);
			}
			
			for (var key in skeys) {
				// TODO more keys
				var index = this.getModelIndex(key, skeys[ key ]);
				//console.log('222', this.attr[ key ], index.findAll({noPopulate: 1}));
				var count = 0;
				index.forEach(function($_) {
					
					if (indexMerges) {
						if (!($_.ref_id in indexMerges)) return;
						if (Object.keys(skeys).length != indexMerges[ $_.ref_id ]) return;
						delete indexMerges[ $_.ref_id ];
					}
					
_ctx.analuser__ && _ctx.analuser__.numFindRow++;
_ctx.analuser__ && _ctx.analuser__.numTotalFindRow++;

					var attr = _ctx.findByPk($_.ref_id, {noPopulate: 1, optsDataHash: opts.optsDataHash});
					//console.log('find by sk:', $_, attr);
	
					if(attr && _ctx.compare(attr, opts)) {
						//console.log('each sk:', attr, opts);
						//_ctx.populateRecord(res, attr, opts);
						//if (opts.limit && ++count == opts.limit) return false;
						
						if (_ctx.limitProvider.isAfterSkeepPopulate(opts, count)) 
							_ctx.populateRecord(res, attr, opts);
						
						if (_ctx.limitProvider.isBreak(opts, ++count)) return false;
					}
					
				//}, {noPopulate: 1, limit: _filters.length ? null: opts.limit});
				//}, {noPopulate: 1, limit: opts.limit, fun: opts.fun});
				//}, {noPopulate: 1, limit: opts.limit});
				}, {noPopulate: 1});
			}
			//console.log(444, index.analuser__);
			reset();
			res = this.sortAndLimitRecords(res, opts);
			return res;
		}
		
		//TODO each for sk
		
		this.findBySk = function(skeys, opts) {
			opts = opts || {};
			opts.limit = 1;
			var model = this.findAllBySk(skeys, opts)[0];
			return model ? model : null; 
		}
		
		
		// TODO uniq support ?
		/*this.findBySkUniq = function(key, value, opts) {
			opts = opts || {};
			
			var index = this.getModelIndex(key, value);
			index = index.findByPk(1);
			if (!index) {
				//throw 'not found index ' + key;
				return null;
			}
			var attr = this.findByPk(index.attr.ref_id, {noPopulate: 1, optsDataHash: opts.optsDataHash});
			// TODO union logik fot findByPk ?
			if (attr) {
				if (opts.optsDataHash && opts.optsDataHash.raw  || opts.noPopulate) {
					return attr;
				}
				var model = new this.instance(_opts);
				model.name_space = this.name_space;
				model.name_model = this.name_model;
				model.setAttr(attr);
				
				return model;
			}
			
			return null; 
		}*/

		
		/*end index*/
		
		this.compare = function(attr) {
			var found = true;
			if (_filters.length) {
				for (var j = 0; j < _filters.length; j++) {  
					
this.analuser__ && this.analuser__.numFilterCompareRow++;
this.analuser__ && this.analuser__.numTotalFilterCompareRow++;

					if (!_filters[j].fun.call(this, attr)) { 
						found = false;
						break;
					}
				}
			}
			return found;
		}

		
		this.limitProvider = new function() {
			
			this.normalizeOption = function(opts) {
				opts.limit = typeof opts.limit == 'number' ? [0, opts.limit] : opts.limit;
			};
			
			this.getStart = function(opts) {
				// beginning on 1
				return !opts.limit || _filters.length  ? 1 : opts.limit[0] + 1;
			};
			
			this.isAfterSkeepPopulate = function(opts, count) {
				//return (!opts.limit || !_filters.length) || count >= opts.limit[0];
				return opts.sort || !opts.limit || count >= opts.limit[0];
				//return (!opts.limit || opts.limit && !_filters.length) || count >= opts.limit[0];
			};
			
			
			this.isBreak = function(opts, count) {
				//return opts.limit && !opts.sort && count == (_filters.length ? opts.limit[0] : 0) + opts.limit[1];
				return opts.limit && !opts.sort && count == (opts.limit[0] + opts.limit[1]);
			};
		};
		
		
		/**
		 * TODO limit, sort
		 * @param opts
		 * @returns {Array}
		 */
		this.findAll = function(opts) {
			
			// check pk 
			if (opts && opts.condition) {
				for (var field in opts.condition) {
					if (this.skeys && this.skeys[ field ]) {
						res = this.findAllBySk(opts.condition, opts);
						return res;				
					}
				}
			}
			
			this.applyFilter(opts);
			opts = opts || {};
			
			var res =  opts.index || opts.group ? {} : [];
			var count = 0;
			
			/*if (opts.condition) {
				var ctx = this;
				// TODO more attributes
				for (var field in opts.condition) {
					if (this.skeys && this.skeys[ field ]) {
						res = this.findAllBySk(opts.condition, opts);
						return res;				
					} else {
						//var value = opts.condition[ field ];
						//var fun = opts.fun;
						//opts.fun = function(m) { return (fun ? fun.call(this, m) : 1) && m[ field ] == value;  };
						//opts.condition = null;
						var res = this.findAll(opts);
						//opts.fun = fun;
						return res;
					}
				}
			}*/
			
			/*if (opts.fields_find_sk) {
				var res = this.findAllBySk(opts.fields_find_sk, opts);
				return res;
			}*/
			
			
			this.limitProvider.normalizeOption(opts);
			//var start = this.limitProvider.getStart(opts);
			var start = 1;
			
			try {
				
this.analuser__ ? this.analuser__.numFindRow = 0 : null;				
this.analuser__ ? this.analuser__.numFilterCompareRow = 0 : null;

				for (var i = start;  i <= this.getAutoIncrement(); i++) {
this.analuser__ && this.analuser__.numFindRow++;
this.analuser__ && this.analuser__.numTotalFindRow++;

				var attr = this.findByPk(i, {noPopulate: 1, optsDataHash: opts.optsDataHash});
				if (attr) {
						if(this.compare(attr, opts)) {
							
							if (this.limitProvider.isAfterSkeepPopulate(opts, count))
									this.populateRecord(res, attr, opts);
							
							if (this.limitProvider.isBreak(opts, ++count)) break;
							
						}
					}
				}
			} catch(e) {
				reset();
				throw e;
			}
			reset();
			res = this.sortAndLimitRecords(res, opts);
			return res;
		}
		
		
		//TODO place
		this.sortAndLimitRecords = function(res, opts) {
			if (opts.sort){
				res.sort(typeof opts.sort == 'function' ? opts.sort : null);
				if (opts.limit) res = typeof opts.limit == 'number' ? res.slice(0, opts.limit) : res.slice(opts.limit[0], opts.limit[0] + opts.limit[1]); 
			}
			return res;
		}
		
		this.findAllByAttributes = function(attr, opts) {
			opts = opts || {}; 
			opts.condition = attr;
			return this.findAll(opts);
		}
		
		
		this.findByAttributes = function(attr, opts) {
			opts = opts || {};
			opts.condition = attr;
			return this.find(opts);
		}
		
		
		//TODO place
		this.populateRecord = function(res, attr, opts) {
			
			var newAttr = {};
			this.raiseEvent('beforePopulateRecord');
			if (opts.field) {
				if (typeof opts.field == 'string') {
					newAttr = attr[ opts.field ];
				}
				
				if (typeof opts.field == 'object') {
					for (var i in opts.field)
						newAttr[ opts.field[ i ] ] = attr[ opts.field[ i ] ];
				}
				
				if (typeof opts.field == 'function') {
					newAttr = opts.field.call(this, attr);
				}
			} else if (opts.noPopulate || opts.optsDataHash && opts.optsDataHash.raw) {
					newAttr = attr;
			 } else {
				newAttr = new this.instance(_opts);
				newAttr.name_space = this.name_space;
				newAttr.name_model = this.name_model;
				newAttr.setAttr(attr);
				newAttr.isNew = false;
			}
			
			// group
			if (opts.group) {
				var groupValue;
				if (typeof opts.group == 'function') {
					groupValue = opts.group.call(this, newAttr);  
				} else {
					groupValue = attr[ opts.group ];
				}
				res[ groupValue ] = res[ groupValue ] || [];
				res[ groupValue ].push(newAttr);
			} else {
				// indexing
				//opts.index ? res[ attr[ opts.index ] ] = newAttr : res.push(newAttr);
				if (opts.index) {
					var indexValue = typeof opts.index == 'function' ? opts.index.call(this, newAttr) : attr[ opts.index ];
					res[ indexValue ] = newAttr; 
				} else {
					res.push(newAttr);
				}
			}
			this.raiseEvent('afterPopulateRecord');
		}
		
		
		this.find = function(opts) {
			opts = opts || {};
			opts.limit = 1;
			var model = this.findAll(opts)[0];
			return model ? model : null; 
		}
		
		
		this.forEach = function(fun, opts) {
			
			this.applyFilter(opts);
			opts = opts || {};
			
			
this.analuser__ ? this.analuser__.numFindRow = 0 : null;				
this.analuser__ ? this.analuser__.numFilterCompareRow = 0 : null;			

			var count = 0;
			this.limitProvider.normalizeOption(opts);
			//var start = this.limitProvider.getStart(opts);
			var start = 1;
			
			for (var i = start; i <= this.getAutoIncrement(); i++) {
			
				var mix = this.findByPk(i, opts);
				
this.analuser__ && this.analuser__.numFindRow++;
this.analuser__ && this.analuser__.numTotalFindRow++;

				//console.log(111, mix, opts);
				if(mix && this.compare(mix.attr ? mix.attr : mix, opts)) {
					//console.log('each:', mix);
					
					if (this.limitProvider.isAfterSkeepPopulate(opts, count) && fun && fun.call(this, mix) === false) break;
					if (this.limitProvider.isBreak(opts, ++count)) break;
				}
			}
			reset();
			return count;
		}
		
		
		this.count = function(opts) {
			//if (!opts || !opts.fun)	return 
			opts = opts || {};
			opts.noPopulate = 1;
			return this.forEach(null, opts);
		}
		
		
		
		this.deleteModel = function(opts) {
			opts = opts || {};
			if (!this.raiseEvent('beforeDelete')) {
				return false;
			}
			
			this.delAllKeyFieldToIndex();
			//console.trace(222, this.sysKeyName(this.attr.id));
			this.dataHashAccess.remove(this.sysKeyName(this.attr.id), opts.optsDataHash);
			this.raiseEvent('afterDelete');
			
			return true;
		}
		
		this.deleteByPk = function(id) {
			return this.findByPk(id).deleteModel();
		}
		
		this.deleteAll = function(opts) {
			this.forEach(function($_) {
				//console.log('del:', $_);
				$_.deleteModel();
			}, opts);
		}
		
		this.deleteByAttributes = function(attr, opts) {
			opts = opts || {};
			opts.condition = attr;
			var model = this.find(opts);
			if (model) {
				return model.deleteModel();
			}
			return false;
		}
		
		//TODO test
		this.deleteAllByAttributes = function(attr, opts) {
			opts = opts || {};
			opts.condition = attr;
			return this.deleteAll(opts);
		}
		
		
		function reset() {
			_filters = [];
			//_optsConditions = {}; //TODO
		}
		
		/**
		 * 
		 * @param opts (mix: string, fun or {fun:fun, ...})
		 */
		this.applyFilter = function(_opts) {
			
			if (!_opts) return this;
			var opts = modelHelper.cloneObj(_opts);
			
			if (typeof opts != 'object' ) 
				opts = {fun: opts};
				
			opts.fun = typeof opts.fun == 'string' && 
					eval("(function(t){ return "+ opts.fun +"; })") || opts.fun;
			
			if (opts.condition) {
				var ctx = this;
				// TODO more attributes
				//var funs = {};
				//if (opts.fun) funs[0] = opts.fun;
				var fun;
				if (opts.fun) _filters.push({fun: opts.fun});
				
				for (var field in opts.condition) {
					if (this.skeys && this.skeys[ field ]) {
						// mod opts for sk
						//if (!opts.fields_find_sk) opts.fields_find_sk = {}; 
						//opts.fields_find_sk[ field ] = opts.condition[ field ];
					} else {
						//var value = opts.condition[ field ];
						//var fun = opts.fun;
						//opts.fun = function(m) { return (fun ? fun.call(this, m) : 1) && m[ field ] == value;  };
						//opts.condition = null;
						//opts.fun = fun;
						(function() {
							var value = opts.condition[ field ];
							var _field = field;
							//funs[ field ] = function(m) { 
							fun = function(m) {
								//var _field = field;
								//console.log(222, _field);
								//console.log(value.exec, m[ _field ], _field, value);
								//console.log(m[ _field ], _field, value);
								
								if (typeof value == 'function' )
										return value.call(ctx, m[ _field ], m);
								if (value && value.exec) 
									return m[ _field ] && m[ _field ].match(value);  
								
								return m[ _field ] == value;
							};
						})();
						_filters.push({fun: fun});
					}
				}
				/*if (Object.keys(funs).length)
					opts.fun = function(m) {  
						for (var field in funs) {
							//console.log(333, field, funs[ field ].call(ctx, m, field));
							if (!funs[ field ].call(ctx, m)) return false; 
						}
						return true;    
					}*/
				//opts.condition = null;
			} else
				if (opts.fun) _filters.push(opts);
			
			return this;
		}
		
		
		this.setConfig = function(opts) {
			
			if (typeof opts != 'object')
				throw 'opts not object';
			
			//TODO ???
			//_opts = opts;
			
			//TODO merge if
			if (opts.preFilters) this.preFilters = opts.preFilters; 
			if (opts.postFilters) this.postFilters = opts.postFilters;
			if (opts.skeys) this.skeys = opts.skeys;
			if (opts.preIdFilters) this.preIdFilters = opts.preIdFilters;
			
			
			for (var i in opts) {
				//this[ i ] = opts[ i ];
				opts_ttt[ i ] = opts[ i ];
			}
			//console.log(666, opts, this.preFilters);
			switch (opts_ttt.driverStore) {
			case 'memory': 
				//MemoryModel.apply(this);
				this.dataHashAccess = new DataHashAccess(MemoryModel, this.preFilters, this.postFilters, this.preIdFilters);
				break;
			default:
				//LocalStoreModel.apply(this);
				this.dataHashAccess = new DataHashAccess(LocalStoreModel, this.preFilters, this.postFilters, this.preIdFilters);
			}
		}
		
		
		this.initFinder = function(opts) {
			opts = opts || {};
			this.attrOptsName = {};
			
			// init
			if (_DEBUG_ || _TEST_) { // TODO
				//AnaluserModel.apply(this);
				this.analuser__ = new AnaluserModel(); 
			}
			// set attr by attr opts
			if (this.attrOpts) {
				this.attr = this.attr || {};
				for (var i = 0;  i < this.attrOpts.length; i++) {
					var prop = this.attrOpts[i];
					this.attr[ prop.name ] = typeof prop.def == 'function' ? prop.def.call(this) : prop.def;
					this.attrOptsName[ prop.name ] = prop;
				}
			} else {
				// for old format
				this.attrOpts = [];
				for (var i in this.attr) {
					this.attrOpts.push({name: i, def: this.attr[i]});
				}
			}
			//
			// rels
			/*ctx = this;
			for (var i in this.rel) {
				var prop = ctx.rel[i];
				this[i] = function(opts){return ctx.getRel(prop.modelClass, prop.belongField, prop.type, prop.fieldSelf, opts );  };
			}*/
			//
			
			this.setConfig(opts);
		};
		
		
		/*this.getRelNear = function(modelClass, conditions, type, opts) {
			opts = opts || {};
			var relModel = opts.model ? opts.model : new modelClass;
			var isMany = type && type.toUpperCase() == 'MANY';
			var ctx = this;
			var res;
			
			var cond = {};
			for (var i in conditions) {
				cond[i] = this.attr[ conditions[i] ];
			}
			opts.condition = cond; 
			res = isMany ? relModel.findAll(opts) : relModel.find(opts);
			
this.analuser__ ? this.analuser__.rel_analuser = relModel.analuser__ : null;
			return res;
		}
		
		
		this.getRel = function(params) {
			
			var modelClass = params.modelClass;
			if (Array.prototype.isPrototypeOf(params.modelClass)) {
				modelClass = params.modelClass[0];
			}
			var res = this.getRelNear(modelClass, params.conditions, params.type, params.opts);
			
			return res;
		}*/
		
		
		this.getCopy = function(attr, opts) {
			var model = new this.instance;
			model.setAttr(attr);
			return model;
		}
		
		this.raiseEvent = function(name, data) {
			var evName = 'on' + name.charAt(0).toUpperCase() + name.slice(1);
			if (this[ evName ]) { 
				return this[ evName ].call(this, data); //TODO new Event
			}
			return true;
		}
		
		
		this.evaluteAttrBeforeSave = function(name, type, callback) {
			
			if (name == 'id' && !type) type = 'int';
			
		    var value = this.attr[ name ];
			switch(type) {
					case 'int':
							value = parseInt(value);
						break;
					case 'float':
						value = parseFloat(value);
						break;
					case 'bool':
					case 'boolean':
						if (typeof value == 'string'){
							value = value && !value.match(/^(0|false)$/i)
						}
						value = !!value;
						break;
					//case 'json':
					//	value = typeof value == 'string' ? value : JSON.stringify(value);
					//	break;
					//case 'object':
					//	value = typeof value == 'object' ? JSON.stringify(value) : value;
					//	break;
				default:
					value = value;
			}
			if (callback) value = callback.call(this, value, name);
			return value;
		}
	};
	FinderModel.prototype = new Model; 	
	
	
	var getClassModel = function(ctx) {
		
		var newModel = function(paramsOver) {
			
			if (!this.initFinder) {
				return {
					model: singleModel,
					modelHelper: modelHelper,
					newModel: function(attr){ return new newModel().setAttr(attr); },
				}
			}
			
			this.name_model = 't';
			this.name_space = 'b';
			this.instance = newModel;
			
			for (var i in paramsOver) {
				this[i] = paramsOver[i];
			}
			
			ctx.apply(this);
			
			this.initFinder(this.optsFinder);
			this.raiseEvent('init');
			
			if (!this.attr)
				throw 'attr not set';
			
			
		};
		newModel.prototype = new FinderModel;
		
		var singleModel = new newModel; 
		
		return newModel;
	};
	window.getClassModel = getClassModel;
	
	
	var AnaluserModel = function() {
			
		this.numFindRow;
		this.numTotalFindRow;
		this.numFilterCompareRow;
		this.numTotalFilterCompareRow;
		
		this.numTotalIndexAdd;
		this.numTotalIndexDelete;
		this.numTotalIndexFresh;
		
		this.reset = function() {
			this.numFindRow = 0;
			this.numTotalFindRow = 0;
			this.numFilterCompareRow = 0;
			this.numTotalFilterCompareRow = 0;
			
			this.numTotalIndexAdd = 0;
			this.numTotalIndexDelete = 0;
			this.numTotalIndexFresh = 0;
		};
		
		// init
		this.reset();
	};
	
	
	var Index = function(opts) {
		
		//_opts = _opts || {};
		
		this.name_space;
		this.name_model;
		this.instance = Index;
		//this.driverStore = _opts.driverStore;
		
		this.attr = {
				id: null,
				ref_id : null
		};
		this.initFinder(opts);
	};
	Index.prototype = new FinderModel; 
	
	
	
	
	// pre filters
	
	var CryptSjclPreFilter = function(opts) {
		opts = opts || {};
		
		//this.dataCrypt = opts.dataCrypt || 1;
		//this.indexHash = opts.indexHash || 0;
		
		this.encode = function(d) {
			//if (this.dataCrypt) obj.d = obj.d ? sjcl.encrypt(opts.pass, obj.d.toString(), opts.params) : obj.d;
			d = d ? sjcl.encrypt(opts.pass, d.toString(), opts.params) : d;
			return d;
		}
		
		
		this.decode = function(d) {
			//sjcl.codec.hex.fromBits(sjcl.hash.sha512.hash('1122'))
			d = d ? sjcl.decrypt(opts.pass, d.toString(), opts.params) : d;
			return d;
		}
	};
	
	
	/**
	 * opts{hash, fun, salt, lenHash}
	 */
	var HashIdPreFilter = function(opts) {
		opts = opts || {};
		
		opts.hash = opts.hash ? opts.hash : 'ripemd160'; 
		
		this.encode = function(id) {
			 //console.log('HashIdPreFilter', id, sjcl.codec.hex.fromBits(sjcl.hash[ opts.hash ].hash(id)));
			
			if (opts.salt) id += opts.salt;
			if (opts.fun) id = opts.fun.call(this, id);
			else
				id = sjcl.codec.hex.fromBits(sjcl.hash[ opts.hash ].hash(id));
			if (opts.lenHash) id = id.substr(0, opts.lenHash);
			return id;
		}
		
		
		this.decode = function(id) {
			return this.encode(id);
		}
		
		
	};
	
	
	var ModelHelper = function() {
		
		this.cloneObj = function (obj) {
			var res;
			if (!obj || typeof obj != "object" || obj instanceof RegExp)
				return obj;

			if (obj instanceof Date) {
				res = new Date();
				res.setTime(obj.getTime());
				return res;
			}
			if (obj instanceof Array) {
				res = [];
				for ( var i = 0, len = obj.length; i < len; i++) {
					res[i] = this.cloneObj(obj[i]);
				}
				return res;
			}
			if (obj instanceof Object) {
				res = {};
				for ( var attr in obj) {
					if (obj.hasOwnProperty(attr))
						res[attr] = this.cloneObj(obj[attr]);
				}
				return res;
			}
			return obj;
			//throw new Error("Unable to copy obj! Its type isn't supported.");
		}
		//TODO 
		/*this.fillData = function (model, count) {
			 for (var i = 0; i < count ; i++) {
			      var m = new ModelData;
			      m.attr.name = 'model_'  + i;
			      m.attr.name2 = 22;
			      m.attr.sex = 44;
			      //m.attr.name2 = Math.floor(Math.random() * 1000);
			      //m.attr.sex = Math.floor(Math.random() * 2);
			      m.save();
			   }
		}*/
		
	}
	var modelHelper = new ModelHelper;
	
	// set global
	window.CryptSjclPreFilter = CryptSjclPreFilter;
	window.HashIdPreFilter = HashIdPreFilter;
	window.FinderModel = FinderModel;
	
	//TODO hide
	//window.Index = Index;
	
})();
