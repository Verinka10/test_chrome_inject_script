/**
 * core face v2
 * requred core nik
 */


function setop(ob, i) {
	if (ob.filters){
		var a = ob.filters['DXImageTransform.Microsoft.alpha'] || ob.filters.alpha;
		if (a) a.opacity = (i*100);
	}
	if ("filter" in ob.style && !a)
		 		ob.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity="+(i*100)+")";
	if ("opacity" in ob.style)
         			ob.style.opacity=i;
}


function anime0(ob, step, start, stop, speed, display_show_property, fun_end){
	var i = start;
	var inc, iid;
	var deb = "";
	
	if (!("nodeName" in ob)) {
		throw 'ob not element';
	}
	
	speed = speed || 10;
	
	if (start == 0) {
		if (display_show_property) {
			ob.style.display=display_show_property;
		} else {
			//TODO test
			ob.style.visibility="visible";
			setop(ob, 0);
		}
	}
	
	start>stop ? inc=0 : inc=1;
	
	function hide() {
		//if (ob.className == "divpanprog") alert(deb);
		if (display_show_property){
			ob.style.display="none";
		} else {
			ob.style.visibility="hidden";
		}
	}
	
	   function hhi(){
		inc ? i+=step : i-=step;
			//alert(i+"__"+step);
			
		if (i-step<0) hide();
	
		if ((i>stop && !inc) || (i<stop && inc)) {
			curopop=i;
			deb+=i+"__"+step+"\n";
			setop(ob, i);
			//window.setTimeout(hhi,speed);
		} else {
			//alert("ssssssss");
			//if (ob.className == "divpanprog") alert(deb);
			if (fun_end) fun_end.call(this, ob);
			clearInterval (iid);
		}
	   }
	
	     //hhi();
	    iid = setInterval(hhi, speed);
	    
	   return iid; 
}

// ********************* tab

/**
  	<div id="tab1" class="nik-tab">
		<div class="tab-head">
			<label class="active">tab-1</label> <label>tab-2</label>
		</div>
		<div>

			<div class="tab-cont active">
				<h2>cont tab 1</h2>
			</div>

			<div class="tab-cont">
				<h2>cont tab 2</h2>
			</div>
			
		</div>
	</div>
	<script type="text/javascript">
		nik("#tab1").tab();
   </script>
 * @param nik
 * @returns
 */
(function(nik) {
	
	if (!nik) { 
		console.error('nik is not define');
		return;
	}
	nik().getInstancePrototype().tab = function(cfg) {
			cfg = cfg || {};
			
			function getContent(el) {
				return nik(el).find().getData("nik-tab");
			}
			
			function setContent(el, data) {
				var content = nik().cpyob(getContent(el) || {}, data);
				return nik(el).find().setData(content, "nik-tab");
			}
			
			function setActiveIndex(n, el) {
				if (nik(el).find('.tab-head label:nth-child('+(n+1)+')').get().className.indexOf("disable") > -1) {
					return false;
				}
				nik(el).findAll(".active").classDel("active");
				//nik(e.target).classAdd('active');
				nik(el).find('.tab-head label:nth-child('+(n+1)+')').classAdd('active');
				nik(el).find('.tab-cont:nth-child('+(n+1)+')').classAdd('active');
				
				var content = getContent(el);
				content && content.changed && content.changed.call(this, n, el);
			}
			
			function setDisable(el, n, disable) {
				var label = nik(el).find('.tab-head label:nth-child('+(n+1)+')').get();
				if (label.className.indexOf("disable") > -1) {
					return false;
				}
				disable ? nik(label).classAdd("disable") : nik(label).classDel("disable");
			}
			
			// init for all
			this.each(function(el) {
				
				var initCfg = getContent(el); 
				
				if (!initCfg) {
					// init one
					//console.log("init", el);
					cfg = nik().cpyob({
						width: null,
						activeIndex: 0,
					}, cfg || {});
					
					cfg.el = el;
					nik(el).findAll('.tab-head label').each(function(label, n) {
						nik(label).addev("click", function(e) { setActiveIndex(n, el); });
					});
				}
				
				// set dynamic cfg
				if (cfg.width) el.style.width = cfg.width;  
				if (cfg.activeIndex !== undefined) {
					setActiveIndex(cfg.activeIndex, el);
				}
				
				if (cfg.disable !== undefined && cfg.index !== undefined) {
					setDisable(el, cfg.index, cfg.disable);
				}
				
				setContent(el, cfg);
			});
			
			//var firstEl = this.find().get();
			// for get content
			/*return {
				setActiveIndex: function(n){ setActiveIndex(firstEl, n); }
			};*/
			// for get content for one
			/*if (this.isArrayResult()) {
				return this.findAll()
			} else
				return getContent(this.find().get());
				*/
			//TODO return only first?
			return getContent(this.find().get());
	};
	
})(window.nik);


/**
  auto ('.nik-switcher-set'):
 <span class="nik-switcher-set">OOO<label>label!!!</label></span>
 or
 <span class="manual-class">OOO<label>label!!!</label></span>
 nik(".manual-class").switcher({theme: 'img'});

 manual transform visual checkboxes standart tempalate:
 <div class="row checkbox-template-standart"><input type="checkbox"><label>test check 1</label></div>
 nik(".checkbox-template-standart").switcher({label: xxx, theme: 'img'});
 or (found by input)
 nik("input[type=checkbox]").switcher();


*/
(function(nik) {
	
	if (!nik) { 
		console.error('nik is not define');
		return;
	}
	nik().getInstancePrototype().switcher = function(cfg) {
			cfg = cfg || {};
			var kname = 'nik-checkbox';
			
			var themes = {
					'def': {contClass: '', labelClass: 'link-button', labelOnClass: 'toggle-down'},
					'visual': {contClass: 'nik-switcher-visual', labelClass: 'link-button', labelOnClass: 'toggle-down'},
					//TODO find image norm
					'img': {contClass: 'nik-switcher-img', labelClass: '', labelOnClass: ''},
			};
			
			function getContent(el) {
				if (!el) return null;
				return nik(el).find().getData(kname);
			}
			
			function setContent(el, data) {
				var content = nik().cpyob(getContent(el) || {}, data);
				return nik(el).find().setData(content, kname);
			}
			
			function setValue(el, value, cfg) {
				var th = themes[ cfg.theme ? cfg.theme : 'def' ]; //TODO set manual error
				nik(el).classDel("nik-switcher-on");
				nik(el).classDel("nik-switcher-off")
				value ? nik(el).classAdd("nik-switcher-on") : nik(el).classAdd("nik-switcher-off");
				var input = nik(el).find('input[type=checkbox]').get();
				input.checked = !!value;
				value ? input.setAttribute('checked', 'checked') : input.removeAttribute('checked');
				if (th.labelOnClass) {
					value ? nik(el).find('label').classAdd(th.labelOnClass) : nik(el).find('label').classDel(th.labelOnClass);
				}
			}
			
			function setToggle(el, cfg) {
				setValue(el, ! nik(el).classExists("nik-switcher-on"), cfg);
			}
			
			function setTheme(el, cfg) {
				var label = nik(el).find('label').get();
				var th = themes[ cfg.theme ];
				//console.log(333, label, cfg.theme, th.contClass);
				
				for (var i in themes) {
					nik(el).classDel(themes[ i ].contClass);
					label && nik(label).classDel(themes[ i ].labelClass);
				}
				if (th.contClass) {
					nik(el).classAdd(th.contClass);
				}
				if (label && th.labelClass) {
					nik(label).classAdd(th.labelClass);
				}
			}
			
			// init for all
			this.each(function(el) {
				
				if (el.nodeName.toLowerCase() == 'input' 
						&& nik(el.parentNode).findAll("input").length == 1
						&& nik(el.parentNode).findAll("label").length < 2
						//&& el.parentNode.childNodes.length < 5 //TODO
					) {
						el = el.parentNode;
				}
					
				if (el.nodeName.toLowerCase() == 'input') {
						return;
				}
					
				var initCfg = getContent(el); 
				
				//console.log("init", el.className, nik(el).classExists('nik-switcher'));
				if (!initCfg && !nik(el).classExists('nik-switcher') && !nik(el.parentNode).classExists('nik-switcher')) {
					// init one
					cfg = nik().cpyob({
						width: null,
						theme: (nik(el).classExists('nik-switcher-visual') ? 'visual' : '') || 'def',
					}, cfg || {});
					
					cfg.el = el;
					//XXX
					//var th = themes[ cfg.theme ];
					
					// create by template <div class="row checkbox-template-standart"><input type="checkbox"><label>test check 1</label></div>
					// or manual from .nik-switcher-set
					// init nik("div.row").switcher();
					/*if (el.nodeName.toLowerCase() == 'input' 
						&& nik(el.parentNode).findAll("input").length == 1
						&& nik(el.parentNode).findAll("label").length < 2
						//&& el.parentNode.childNodes.length < 5 //TODO
					) {
						el = el.parentNode;
					}
					if (el.nodeName.toLowerCase() == 'input') {
						return;
					}*/
					
					var label = nik(el).find('label').get();
					var input = nik(el).find('input[type=checkbox]').get();
					if (!nik(el).getData('init-done') && !nik(el).find('.nik-switcher').get()) {
						if (!label && cfg.label) label = nik().cr('<label>'+ cfg.label +'</label>');
						if (!input) input = nik().cr('<input type="checkbox">');
						// for standart template
						if (!nik(el).classExists('nik-switcher-set') && el.nodeName.toLowerCase() != 'input') {
							var div = nik().cr("<div></div>");
							nik(el).append(div);
							el = div
						}
						/*if (th.contClass) {
							nik(el).classAdd(th.contClass);
						}
						if (label && th.labelClass) {
							nik(label).classAdd(th.labelClass);
						}*/
						nik(el).append("<div class='sw-visual'><span class='sw-t-on'>ON</span><div class='sw-reb'></div><span class='sw-t-off'>OFF</span></div>");
						nik(el).append(input);
						label && nik(el).append(label);
						nik(input).classAdd('hidden');
						setTheme(el, cfg);
					}
					nik(el).classAdd('nik-switcher');
					nik(el).setData(1, 'init-done');
					nik(el).addev("click", function(e) { setToggle(e.currentTarget, cfg); input.dispatchEvent(new Event("change")); e.stopPropagation(); });
					//nik(el).addev("mousedown", function(e) { if (e.button != 0) return; setToggle(e.currentTarget, cfg); input.dispatchEvent(new Event("change")); e.stopPropagation(); });
					setValue(el, nik(el).find('input[type=checkbox]').get().checked, cfg);
				}
				
				// set dynamic cfg
				if (cfg.width) el.style.width = cfg.width;  
				if (cfg.value !== undefined) {
					setValue(el, cfg.value, cfg);
				}
				if (cfg.label) {
					nik(el).find('label').get().innerHTML = cfg.label;
				}
				if (cfg.theme) {
					setTheme(el, cfg);
				}
				
				setContent(el, cfg);
			});
			
			return getContent(this.find().getFirst());
	};
	
})(window.nik);

// load other widget after load page

(function(nik) {
	if (!nik) { 
		console.error('nik is not define');
		return;
	}
	
	// groupToggle
	nik().getInstancePrototype().groupToggle = function(cfg) {
		cfg = nik().cpyob({
			element: '',
			classToggle: '',
		}, cfg || {});
		
		this.each(function(el) {
			
			// style
			if (cfg.width) el.style.width = cfg.width;  
			
			if (nik(el).find().getData("groupToggle-init")) {
				// init already
				return;
			}
			nik(el).findAll(cfg.element).addev("mousedown", function(e) {
				if (e.button != 0) return;
				nik(e.target.parentNode).findAll(cfg.element).classDel(cfg.classToggle);
				nik(e.target).classAdd(cfg.classToggle);
			});
			nik(el).findAll(cfg.element).addev("click", function(e) {
				e.preventDefault();
			});
			
			nik(el).find().setData(true, "groupToggle-init");
		});
	}
	
	// disable/enable
	nik().getInstancePrototype().disable = function() {
		this.each(function(el) {
			if (el.className.indexOf('disable') == -1){
				nik(el).classAdd("disable");
			}
			if (el.nodeName == 'INPUT') {
				el.setAttribute("readonly", "readonly");
			}
		});
	};
	nik().getInstancePrototype().enable = function() {
		this.each(function(el) {
			nik(el).classDel("disable");
			if (el.nodeName == 'INPUT') {
				el.removeAttribute("readonly");
			}
		});
	};
	nik().getInstancePrototype().enableIf = function(expr) {
		this.each(function(el) {
			expr ? nik(el).enable() : nik(el).disable(); 
		});
	};
	//
	
	// disable/enable
	nik().getInstancePrototype().hide = function(cfg) {
		cfg = cfg || {};
		this.each(function(el) {
			if (el.className.indexOf('hidden') == -1){
				if (cfg.speed) {
					anime0(el, 0.02, 1, 0, cfg.speed, 'none', cfg.funEnd);
				} else 
					nik(el).classAdd("hidden");
			}
		});
	};
	
	nik().getInstancePrototype().show = function(cfg) {
		cfg = nik().cpyob({
			steep: 0.02,
			start: 0, 
			stop: 1,
			speed: 0
		}, cfg || {});
		
		this.each(function(el) {
			if (cfg.speed) {
				anime0(el, cfg.steep, cfg.start, cfg.stop, cfg.speed, '', cfg.funEnd);
			} else {
				nik(el).classDel("hidden");
			}
		});
	};
	//
	
	// init all after load page
	nik(window).addev("load", function() {
		
		// initGroupTogle link buttons
		nik('.group-toggle').groupToggle({
			element: '.link-button',
			classToggle: 'toggle-down'
		});
		
		// prevent default for all
		nik('.link-button').findAll().addev("click", function(e) {
			e.preventDefault();
		});
		
		//disable input
		nik("input.disable").each(function(el) {
			nik(el).disable();
		});
		
		// sw
		nik(".nik-switcher-set").each(function(el) {
			nik(el).switcher();
		});
		
		// other widgets...
	});
	
})(window.nik);


var ProgressCanvas =  function(_conf) {
	
	var conf = {
			//color and style
			id				: null,
			contIn			: null,
			prog			: null,
			colorFill   	: "rgba(255,22,0,0.9)",
			colorLight  	: "#ffffcc",
			colorStroke 	: "#dcdcdc",
			shC    		  	: "grey",
			shB     		: 2,
			buttonCancel	: null,
			// ajax
			xhr				: null,		
			// size
			gradientWidth	: 20,
			//w				: 20,
			lineW   		: 2,
			// time startegy
			tim				: 10,
			pi    			: 0.01, // light step
			stepi 			: 1, 	//	step
			timsum 			: 0, 
			max    			: 100,
			nLimit			:0, 
			totalTimeout	: 180000,
			//
			// show animate
			stepS 			: 0.03, 	
			stepD 			: 0.02,
			autoShow		: false,
			autoHide		: false,
		};
	
	var prog;
	var canvas;
	var ctx;
	
	var grad;
	var pi;
	var i;
	var w;
    var one3;
    var breakaj;
    var hTim;
    var hTimTotal;
	
	function createWidget() {
		
		//if (prog && prog.nik('canvas').find().get()) return;
		// create prog div and childs
		if (!conf.prog) {
			prog = nik().cr("div");
			prog.id = conf.id ? conf.id : 'prog_1';
			prog.className = "divpanprog";
		} else
			prog = nik(conf.prog).find().get();
		
		prog.style.height = (conf.lineW + conf.shB + 4) + 'px';
		// canvas
		canvas = nik().cr("canvas");
		canvas.style.borderStyle="none";
		canvas.style.verticalAlign = 'top';
		canvas.height = conf.lineW + 4;
		nik(prog).append(canvas);
		ctx = canvas.getContext("2d");
		
		// button cancel
		if(conf.buttonCancel) {
			var b = typeof conf.buttonCancel === 'string' ? nik().cr(conf.buttonCancel) : conf.buttonCancel;
			b.setAttribute('class', 'button-progress-break');
			nik(prog).append(b);
			nik(b).addev("click", function() {
				breakaj = true;
				hide();
				if (conf.xhr) xhr.abort();
				if (funbreak) funbreak();
			});
		}
	}
	
	
	function init() {
		
		// insert
		if (conf.contIn) nik(conf.contIn).append(prog);
		w = ctx.canvas.width = prog.clientWidth;
		
		if (!nik().cr('canvas').getContext) {
			// TODO
			//return false;
			//G_vmlCanvasManager.initElement(canvas);
		}
		//console.log(222, prog.clientWidth);
		
		// params
		if(conf.timsum)	conf.stepi = w / conf.timsum * conf.tim;
		
	}
	
	this.setConf = function(_conf) {
		for (var i in _conf) conf[ i ] = _conf[ i ];
		if(conf.timsum)	conf.stepi = w / conf.timsum * conf.tim;
		return this;
	}
	
	function change_progress (x){
		ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
		ctx.lineWidth = conf.lineW;
		ctx.lineCap = "round";
		ctx.shadowBlur = conf.shB;
		ctx.shadowColor = conf.shC;
		//console.trace(x*pi,0,x*pi+10,conf.gradientWidth);
		grad = ctx.createLinearGradient(x*pi,0,x*pi+10,conf.gradientWidth);
		grad.addColorStop(0, conf.colorFill);
		grad.addColorStop(0.5, conf.colorLight);
		grad.addColorStop(1, conf.colorFill);
		
		//if (IS_IE8)
		//	ctx.strokeStyle = conf.colorFill;
		//		else ctx.strokeStyle=grad;
		ctx.strokeStyle = grad;

		ctx.beginPath();
		ctx.moveTo(0,5);
		ctx.lineTo(x,5);
		ctx.closePath();
		ctx.stroke();

		ctx.strokeStyle = conf.colorStroke;
		ctx.beginPath();
		ctx.moveTo(x,5);
		ctx.lineTo(ctx.canvas.width,5);
		ctx.closePath();
		ctx.stroke();
	}

    
    this.setpos = function (pos) {
    	i = w  / conf.max *  pos;
    	change_progress(i);
    }
    
    this.addpos = function (pos) {
    	i+= w  / conf.max * (pos?pos:1);
    	pi += conf.pi * pos;
    	if (pi >= 1) pi = 0;
    	change_progress(i);
    }
    
    
    function hide (){
    	//TODO
    	if (conf.stepD) anime0 (prog, conf.stepD, 1,0,10,null, function(){ prog.style.visibility = "hidden";   });
    		else prog.style.visibility = "hidden";
    }
    
    
    function show (){
    	//TODO
    	//console.log(444, prog);
    	prog.style.visibility = "visibility"; 
    	if (conf.stepS) {setop(prog, 0);}
    	if (conf.stepS) anime0 (prog, conf.stepS, 0,1,10,null, function(){   });
    }
    
    
    function proc_aj() {	   
    	//console.log(conf.xhr);
    	
    	pi+=conf.pi;
    	if (pi>=1) pi=0;
    	if (!breakaj) {
    		if (i<w*0.3) i+=conf.stepi+1;
    		else if (i<w*0.95) i+=conf.stepi;
    			else if (i<w*0.98) i+=conf.stepi * 0.1;
    		switch (conf.xhr.readyState) {
    			case 1 : if (i<w/2) i+=conf.stepi;
    			break;
    			case 2 : if (i<w*0.7) i+=conf.stepi;
    			break;
    			case 3 : if (i<w*0.8) i+=conf.stepi;
    			break;
    			case 4 : i = w;
    				if (conf.xhr.status != 200) { 
    					error();
    					return;
    				}
    			break;
    			//default : i++;	 	 

    		}
    		change_progress(i);
    	}
    	
    	if (i < w && !breakaj)
    		hTim = setTimeout(proc_aj, conf.tim);
    	else	 
    		stop();
    }
	
    function proc_time() {
    	pi += conf.pi;
    	if (pi >= 1) pi = 0;
    	//console.log(i, w*conf.nLimit);
    	
    	if (!conf.nLimit || i < w*conf.nLimit) i += conf.stepi;	
    	
    	change_progress(i);
    	//console.trace(i);
    	
    	if (i < w && !breakaj) hTim = setTimeout(proc_time, conf.tim);
    			else 
    				stop();
    }
    	
    
    var stop = function() {
    	breakaj = true;
    	clearTimeout(hTim);
    	clearTimeout(hTimTotal);
    	if (conf.autoHide) hide();
    }
    
    
    var error = function () {
    	var normColorFill = conf.colorFill; 
    	conf.colorFill = 'red'; 
    	//conf.colorStroke = '#ffb2b2';
    	change_progress(i); 
    	stop(); 
    	conf.colorFill = normColorFill;
    }
    
    
    var start = function() {
    	//console.log(444, conf);
    	// TODO test, move lib
    	if (!nik().cr('canvas').getContext) return;
    	breakaj = false;
    	pi = 0;
		i = 0;
		w;
	    one3 = 0;
	    clearTimeout(hTim);
	    clearTimeout(hTimTotal);
	    
	    hTimTotal = setTimeout(error, conf.totalTimeout);
    	if (conf.autoShow) show();
    	if (conf.xhr) proc_aj();
    	else
    		if (conf.timsum) proc_time();
    }
    
    var forseEnd = function () {
    	pi=0;
    	i = w;
    	change_progress(i);
    	stop();
    }
    
    
	
	// init
    this.setConf(_conf);
    createWidget();
    init();
    
	this.start = start;
	this.stop = stop;
	this.forseEnd = forseEnd;
};





var LocalStoreProvider =  function(modelClass) {
	
	var filter, sort;
	var single = new modelClass;
	
	this.getData = function(start, ofset, pagination) { 
		var limit = start === undefined && ofset === undefined ? null : [start, ofset];
		return single.findAll({fun: filter, limit: limit, sort: sort}); 
	}
	
	this.getModel = function() {
		return modelClass;
	}
	
	this.getCount = function() {
		return single.count({fun: filter});
	}
	
	this.getById = function(id) {
		return single.findByPk(id);
	}
	
	this.setFilter = function(fun) { 
		filter = fun; 
	}
	
	this.setSort = function(sortParams) { 
		sort = sortParams; 
	}
	
	this.refreshSingle = function() { 
		single = new modelClass;
		return this;
	}
}


var TableModel =  function(_conf) {
	
	_conf = nik().cpyob({
		onclickRow: null,
		onRefresh: null,
		summary: {},
		pagination: {
			itemOnPage: 10,
			pageNumders: 10,
		},
		panel: null,
		sort: {},
	}, _conf);
	
	
	var table, cont, contPager;
	var curPage = 1;
	var curRow;
	var curPageLevel = 0;
	var Model = _conf.dataProvider.getModel();
	var count;
	var objInterface;
	var panel;
	var sortStat = _conf.sort ? {names:{}} : null;
	
	
	
	function evalute(data, params) {
		if (typeof data == 'function')
			return data.apply(this, params);
		return data;
	}
	
	
	function renderHeader() {
		
		//var attr = (new Model).attr;
		
		var thead = document.createElement("thead");
		var tr = document.createElement("tr");
		thead.appendChild(tr);
		table.appendChild(thead);
		for (var i in _conf.columns) {
			var th = document.createElement("th");
			var name = _conf.columns[i].name ? _conf.columns[i].name : _conf.columns[i];
			var header = _conf.columns[i].header ? _conf.columns[i].header : name;
			//name = evalute(name, [name, Model]);
			header = evalute(header, [header, Model])
			
			// sort
			if (_conf.sort) {
				header = nik().cr("<a class='a-sort' href='#'></a>", header);
				nik(th).classAdd('th-sort');
				//sortStat.names[ attr ].fsort = attr;
				
				if (typeof name == 'string') {
					var model = (new Model);
					var type;
					for (var i in model.attrOpts) {
						if (model.attrOpts[ i ].name == name) type = model.attrOpts[ i ].type; 
					}
					
					// TODO user fun sort
					// TODO default fun sort
					(function(){
						var name_ = name;
						if (name == 'id' || type == 'int') {
							nik(header).find().setData(function(a, b){ return a.attr[ name_ ] > b.attr[ name_ ] ? -1 : 1;  }, 'fsort-asc');
							nik(header).find().setData(function(a, b){ return b.attr[ name_ ] > a.attr[ name_ ] ? -1 : 1;  }, 'fsort-desc');
						} else {
							nik(header).find().setData(function(a, b){ return a.attr[ name_ ].toString().localeCompare(b.attr[ name_ ]);  }, 'fsort-asc');
							nik(header).find().setData(function(a, b){ return b.attr[ name_ ].toString().localeCompare(a.attr[ name_ ]);  }, 'fsort-desc');
						}
					})();
				}
				
				nik(header).addev("click", function(e) {
					if (sortStat.elLastSort && e.target !== sortStat.elLastSort) { 
						nik(sortStat.elLastSort).classDel('asc');
						nik(sortStat.elLastSort).classDel('desc');
					}
					sortStat.elLastSort = e.target; 
					//sortStat.names[]
					var orderAsc = !nik(e.target).find().getData('orderAsc');
					nik(e.target).find().setData(orderAsc, 'orderAsc');
					nik(e.target).classToggle('asc', 'desc');
					var fsort = orderAsc ? nik(e.target).find().getData('fsort-asc') : nik(e.target).find().getData('fsort-desc');
					if (fsort) {
						//console.log('fsort:', fsort);
						_conf.dataProvider.setSort(fsort);
						refresh();
					}
					e.preventDefault();
				});
			}
			//
			nik(th).append(header);
			nik(tr).append(th);
		}
		
	}
	
	
	function renderBody() {
		
		count = _conf.dataProvider.getCount();
		var startItem = _conf.pagination ? (curPage - 1) * _conf.pagination.itemOnPage : 0;
		var limit = _conf.pagination ?  _conf.pagination.itemOnPage : count;
		
		var data = _conf.dataProvider.getData(startItem, limit, true);
		var tbody = document.createElement("tbody");
		
		for (var i in data) {
			var tr = document.createElement("tr");
			nik(tr).find().setData(data[i].attr.id, 'id');
			nik(tr).find().setData(startItem + parseInt(i), 'n');
			
			tr.className = 'trow';
			for (var j in _conf.columns) {
				var td = document.createElement("td");
				var name = _conf.columns[j].name ? _conf.columns[j].name : _conf.columns[j]; 
				var value = _conf.columns[j].value ? _conf.columns[j].value : data[i].attr[ name ];
				//_conf.columns[j].name ? _conf.columns[j].name : _conf.columns[j];
				td.innerHTML = evalute(value, [data[i]]);
				nik(tr).append(td);
			}
			nik(tbody).append(tr);
		}
		table.nik('tbody').remove(); //TODO nik.replace
		nik(table).append(tbody);
		
		// click row
		cont.nik('tbody tr').addev("click", function(e) {
			if (curRow) curRow.tr.className = 'trow';		
			var tr = e.currentTarget;
			var model = _conf.dataProvider.getById(nik(tr).find().getData('id'));
			curRow = {
					n: nik(tr).find().getData('n', 0), //TODO fix nik getData
					tr: tr, 
					model: model,
			};	
			curRow.tr.className =  _conf.cssRowExpreshion ?  evalute(_conf.cssRowExpreshion, [curRow]) : 'trow trow-current';
			
			if (_conf.onclickRow) {
				_conf.onclickRow.call(this, curRow.model, curRow.tr, curRow.n);
			}
			
			if (panel) {
				panel.setCurModel(curRow.model);
			}
			
		});
	}
	
	function renderSummary() {
		if (_conf.summary) {
			if (!cont.nik('.summary').find().get()) {
				nik(cont).append("<div class='summary'></div>");
			}
			cont.nik('.summary').find().get().innerHTML =  "Total: " + count; 
		} 
	}
	
	// init
	
	cont = document.createElement("div");
	table = document.createElement("table");
	table.className = 'nik-table';
	nik(cont).append(table);
	
	renderHeader();
	renderBody();
	renderSummary();
	
	if (_conf.pagination) {
		var opts = _conf.pagination;
		opts.count = function(){ return _conf.dataProvider.getCount(); }; 
		opts.onchange = function(n, el){ 
			curPage = n; 
			renderBody();
			//console.log('pager n=', n); 
		}
		var pager = new Pager(opts);
		nik(cont).append(pager.cont);
	}
	
	_conf.renderTo && nik(_conf.renderTo).append(cont);
	
	
	
	function refresh() {
		_conf.dataProvider.refreshSingle();
		renderBody();
		renderSummary();
		_conf.pagination.count = count;
		pager && pager.refresh();
		_conf.onRefresh && _conf.onRefresh.call(this);
	}
	
	function setFilter(fun) {
		_conf.dataProvider.setFilter(fun);
		refresh();
		//_conf.pagination.init_curPage = 1;
	}
	
	objInterface = {
		cont: cont,
		getCurRow: function(){ return curRow; },
		setFilter: setFilter,
		refresh: refresh,
	}
	
	if (_conf.panel) {
		_conf.panel = nik().cpyob({
				modelClass: Model,
				table: objInterface,
		}, _conf.panel === true ? {} : _conf.panel);
		panel = new PanelModel(_conf.panel);
		nik(cont).append(panel.cont);
	}
	
	return objInterface;
}


var Pager =  function(_conf) {
	
	_conf = nik().cpyob({
		itemOnPage: 10, //items on page
		pageNumders: 5, //pages show line
		init_curPage: 1,
		onchange: null,
		onclickstart: null,
		onclickend: null,
	}, _conf);
	
	
	function evalute(data, param1) {
		if (typeof data == 'function')
			return data.call(this, param1);
		return data;
	}
	
	
	var count = evalute(_conf.count);
	var startNPage; //<X,2,3,4>
	var endNPage; //<1,2,3,X>
	//var pageNumders = 0;
	var curPage = 1;
	var maxPageLevel;
	var curPageLevel = 0;
	var curElementPage;
	
	var contPager;
	
	
	function calculateLimit(){
		
		maxPageLevel = Math.ceil(count / (_conf.itemOnPage *_conf.pageNumders) - 1);
		//curPageLevel = curPage;
		//curPage = curElementPage ? nik(curElementPage).getData('n') : _conf.init_curPage;
		startNPage = curPageLevel * _conf.pageNumders + 1; 
		endNPage =	startNPage +_conf.pageNumders;
		
		var countRender = 0;
		for (var i = startNPage; i < endNPage; i++) {
			if (i * _conf.itemOnPage >= count || _conf.pageNumders == countRender) { endNPage = i;  break; } 
			countRender++;
		}
		
		//console.log('curPage=' + curPage, 'curPageLevel='+curPageLevel, 'startNPage='+startNPage, 'endNPage'+endNPage, 'maxPageLevel=' + maxPageLevel, "count=" + count);
	}
	
	
	function onChange() {
		 if (nik(curElementPage).find().length)
			 _conf.onchange && _conf.onchange.call(this, nik(curElementPage).find().getData('n'), curElementPage);
	}
	
	function renderNumeric(){
		
		//curPage = curElementPage ? nik(curElementPage).getData('n') : startNPage;
		
		/*if (endNPage < curPage) {
			//TODO
			//cont.nik(prev).find().get().dispatchEvent(new Event("click"));
			if (curPageLevel == 0) {
				return;
		}
			curPageLevel--;
			calculateLimit();
			curPage = endNPage;
			renderNumeric();
			onChange();
		}*/
		
		//contPager.nik('.t-page').remove(); //TODO nik.replace
		contPager.nik('.t-page').removeAll();
		
		var countRender = 0;
		for (var i = startNPage; i <= endNPage; i++) {
			
			if (!count) break;
			
			//console.log('init page', i, 'cur=', curPage, count, i * _conf.itemOnPage);
			var li = nik().cr("<li>" + i + "</li>");
			li.className = 't-page t-n-page';
			if (i == curPage) {
				li.className = 't-pager-curr t-page t-n-page';
				curElementPage = li;
			} 
			nik(next).before(li);
			nik(li).find().setData(i, 'n');
			if (i * _conf.itemOnPage >= count || _conf.pageNumders == countRender) {  break; } 
			countRender++;
		}
		
		if (curPageLevel >= maxPageLevel) {
			next.className = 't-pager-next t-pager-disable';
			end.className = 't-pager-end t-pager-disable';
		} else {
			next.className = 't-pager-next';
			end.className = 't-pager-end';
		}
		if (curPageLevel == 0) {
			prev.className = 't-pager-prev t-pager-disable';
			start.className = 't-pager-start t-pager-disable';
		} else {
			prev.className = 't-pager-prev';
			start.className = 't-pager-start';
		}
		
		contPager.nik('li.t-n-page').addev("click", function(e) {
			//console.log(222, nik(e.currentTarget).getData('n'));
			//curElementPage.className = 't-n-page';
			if (curElementPage == e.currentTarget) {
				return;
			}
			
			if (curElementPage) {
				curElementPage.className = 't-page t-n-page';
			}
			curElementPage = e.currentTarget;
			curElementPage.className = 't-pager-curr t-page t-n-page';
			
			curPage = nik(curElementPage).find().getData('n');
			
			onChange();
			//renderNumeric();
			e.preventDefault();
		});
		
	}
	
	// init
	
	contPager = document.createElement("ul");
	contPager.setAttribute("class", "t-pager");
	var start = nik().cr("<li class='t-pager-start'><<</li>");
	var prev = nik().cr("<li class='t-pager-prev'><</li>");
	var next = nik().cr("<li class='t-pager-next'>></li>");
	var end = nik().cr("<li class='t-pager-end'>>></li>");
	var cont = _conf.renderTo ? nik(_conf.renderTo).find().get() : document.createElement("div");
	
	nik(contPager).append(start);
	nik(contPager).append(prev);
	nik(contPager).append(next);
	nik(contPager).append(end);
	nik(cont).append(contPager);
	
	
	function goStart() {
		curPageLevel = 0;
		calculateLimit();
		curPage = 1;
		renderNumeric();
		onChange();
	}
	
	cont.nik(start).addev("click", function(e) {
		if (curPage == 0) {
			return;
		}
		//curPage = 0;
		goStart();
		e.preventDefault();
	});
	
	cont.nik(end).addev("click", function(e) {
		if (curPage == endNPage) {
			return;
		}
		//curPage = Math.floor(count / _conf.pagination.pageSize) - 1;
		curPageLevel = maxPageLevel;
		calculateLimit();
		curPage = endNPage; //TODO ?? test 
		renderNumeric();
		onChange();
		e.preventDefault();
	});
	
	
	cont.nik(next).addev("click", function(e) {
		if (curPageLevel == maxPageLevel) {
				return;
		}
		//console.log('next');
		
		curPageLevel++;
		//console.log(444, curPage, curPageLevel);
		calculateLimit();
		curPage = startNPage;
		renderNumeric();
		onChange();
		//console.log('curPage=' + curPage);
		e.preventDefault();
	});
	
	cont.nik(prev).addev("click", function(e) {
		if (curPageLevel == 0) {
				return;
		}
		curPageLevel--;
		//console.log(444, curPage, curPageLevel);
		calculateLimit();
		curPage = endNPage - 1;
		renderNumeric();
		onChange();
		e.preventDefault();
	});
	
	
	var refresh = function() {
		count = evalute(_conf.count);
		//goStart();
		calculateLimit();
		renderNumeric();
		//TODO delete from last page
		if (endNPage < curPage) {
			if (curPageLevel == 0) {
				return;
			}
			curPage = endNPage;
			calculateLimit();
			renderNumeric();
			onChange();
		}
	};
	
	//refresh();
	goStart();

	return {
		cont: cont,
		refresh: refresh, 
	};
}


var PanelModel =  function(_conf) {
	
	_conf = nik().cpyob({
			// for mod model attr
			fieldsConfig: {},
			// if not model
			fields:	{},
			// add field if exists model, copy to fieldsConfig 
			addFields: {},
			table: null,
			modelClass: null,
			renderTo: null,
			disabled: false,
			caseSent: 0,
			onBeforeSave: null,
	}, _conf);
	
	
	 function saveModel() {
		 if (!curModel) curModel = new _conf.modelClass;
		 var formData = nik(form).formToObj();
		 curModel.setAttr(formData, nameModel);
		 _conf.onBeforeSave && _conf.onBeforeSave.call(this, formData, curModel);
		 curModel.save();
		 _conf.table.refresh();
		 refresh();
	 }
	 
	 function deleteModel() {
		 //var id = form.nik("input[name='"+nameModel+"[id]']").find().get().value;
		 //_conf.model.deleteByPk(id);
		 if (curModel) {
			 curModel.deleteModel();
			 _conf.table.refresh();
			 form.reset();
		 }
	 }
	 
	 function copyModel() {
		 	//var id = form.nik("input[name='"+nameModel+"[id]']").find().get().value;   
		    //var model = _conf.model.findByPk(id);
		 if (curModel) {
			 curModel.attr.id = null;
			 curModel.save();
			 _conf.table.refresh();
			 refresh();
		 }
	 }
	 
	 function newModel() {
		 curModel = new _conf.modelClass;
		 curModel.save();
	     _conf.table.refresh();
	     refresh();
	}
	 

	 function setFilter() {
	    var modelSearch = new _conf.modelClass;       
	    var filterFormObj = nik(form).formToObj(nameModel);
	    modelSearch.setAttr(filterFormObj, nameModel);
	    _conf.table.setFilter(modelSearch.getFilterByAttr({caseSent: _conf.caseSent}));
	 }
	 
	 function resetForm() {
		 form.reset();
	 }
	
	 //
	 
	 function setCurModel(model) {
		 curModel = model;
		 refresh();
	 }
	 
	 function refresh() {
		 if (curModel) {
			 nik(form).setForm(curModel.attr, nameModel, _conf.fieldsConfig);
		 }
	 }
	 
	//TODO set order
	var fields = {};
	if (_conf.modelClass && Object.keys(_conf.fields).length == 0) 
		fields = _conf.modelClass().model.attr;
	else
		for (var i in _conf.fields) {
			fields[ i ] = _conf.fields[ i ];
		}
	// add field
	for (var i in _conf.addFields) {
		fields[ i ] = _conf.addFields[ i ];
		_conf.fieldsConfig[i] = _conf.addFields[ i ];
	}
	//fields.concat(_conf.fields);
	
	
	// init
	var cont = _conf.renderTo ? nik(_conf.renderTo).find().get() : nik().cr("div");
	var fieldsSet = nik().cr('fieldset');
	var form = nik().cr('form');
	var nameModel = _conf.modelClass().model.name_model;
	var curModel;
	cont.className = (cont.className ? " " + cont.className: "") + "nik-panelmodel nik-panelmodel-" + nameModel;   
	
	nik(fieldsSet).append("legend").getCreated().append(nameModel);
	nik(fieldsSet).append(form);
	for (var i in fields) {
		var id = nameModel + "_" + i;
		var name = nameModel + "[" + i + "]";
		
		// set type input
		var input;
		var type;
		var wt = _conf.modelClass().model.attrOptsName[ i ].type
				   ||	typeof _conf.modelClass().model.attrOptsName[ i ].def;
		switch (wt) {
			case 'int':
			case 'number':
				input = nik().cr("<input id='"+id+"' name='"+name+"' type='number'>");
				break;	
			case 'bool':
			case 'boolean':
				//type = 'checkbox'
				input = nik().cr("<select id='"+id+"' name='"+name+"'><option value='1'>true</option><option value='0'>false</option></select>");
				break;
			default:
				input = nik().cr("<input id='"+id+"' name='"+name+"'>");
		}
		//input = nik().cr("<input id='"+id+"' name='"+name+"' type='"+type+"'>");
		//
		//type = '';
		// user field
		if ( _conf.fieldsConfig[ i ] && _conf.fieldsConfig[i].element) {
			input = nik().cr(_conf.fieldsConfig[i].element);
			//console.log(222, i, _conf.fieldsConfig[i].element);
			input.setAttribute('id', id);
			input.setAttribute('name', name);
		}
		//
		nik(form).append("<div class=\"row-"+i+"\">" +
				  "<label for='"+id+"'>"+i+"</label>" +
				  input.outerHTML +
		 "</div>");
	}
	nik(fieldsSet).append(form);
	
	var saveButton = nik().cr("button", "save");
	nik(saveButton).addev("click", saveModel);
	
	var deleteButton = nik().cr("button", "delete");
	nik(deleteButton).addev("click", deleteModel);
	
	var copyButton = nik().cr("button", "copy");
	nik(copyButton).addev("click", copyModel);
	
	var newButton = nik().cr("button", "new");
	nik(newButton).addev("click", newModel);
	
	var filterButton = nik().cr("button", "filter");
	nik(filterButton).addev("click", setFilter);
	
	var resetButton = nik().cr("button", "reset");
	nik(resetButton).addev("click", resetForm);
	
	nik(fieldsSet).append(saveButton);
	nik(fieldsSet).append(deleteButton);
	nik(fieldsSet).append(copyButton);
	nik(fieldsSet).append(newButton);
	nik(fieldsSet).append(filterButton);
	nik(fieldsSet).append(resetButton);
	nik(cont).append(fieldsSet);
	_conf.renderTo && nik(_conf.renderTo).append(cont);
	
	
	
	
	return {
		cont: cont,
		setCurModel: setCurModel,
		//getCurModel: function(){ return curModel; },
	};
}


window.lineMessager = {
	
	el: null,
	contCur: null,
	contFix: null,
	contScroll: null,
	anime: null,
	speed: 5,
	bClose: true,
	data: {},
	
	hashChars:  function (message) {
		var hh = 0;
		for (var i=0; i<message.length; i++) {
			hh += message.charCodeAt(i) + i;
		}
		return hh;
	},
	
	showLine:  function (cfg, type, cont) {
		
		cfg = typeof cfg == 'object' ? cfg : {message: cfg};
		
		if (!cfg.message) return;
		if (!this.contCur) this.scroll();
		//if (!cfg.id) cfg.id = 'mes-' + (Object.keys(this.data).length + 1);   
		if (!cfg.id) cfg.id = (type ? type : 'def') + this.hashChars(cfg.message);
		var ctx = this;
		//cfg = nik().cpyob(this, cfg || {});
		//TODO timeout
		cfg = nik().cpyob({
			speed: this.speed,
			bClose: this.bClose,
		}, cfg || {});
		
		//TODO cpy object element error?
		cont = cont || this.contCur;
		
		/*if (!this.cont) {
			this.init(cfg);
		}*/
		//var line = nik(this.contCur).find("#" + cfg.id).get();
		var line;
		if (this.data[ cfg.id ]) {
			nik(this.data[ cfg.id ]).remove();
		}
		
		line = nik().cr('<div id="'+cfg.id+'" class="message-line message-line-'+ (type ? type : 'info') + 
				(!cfg.bClose ? ' no-close' : '') + '">' + 
				'<span class="b-close-img b-close"></span>' +
				cfg.message + 
		'</div>');
		
		nik(cont).append(line);
		nik(line).find('.b-close').addev("click", function(e) {
			ctx.removeLine(line, cfg);
			delete ctx.data[ cfg.id ];
		});
		this.data[ cfg.id ] = line;
		
		/*if (this.data[ cfg.id ]) {
			line = this.data[ cfg.id ];
		} else {
			line = nik().cr('<div id="'+cfg.id+'" class="message-line message-line-'+ (type ? type : 'info') + 
					(!cfg.bClose ? ' no-close' : '') + '">' + 
					'<span class="b-close-img b-close"></span>' +
					cfg.message + 
			'</div>');
			
			nik(cont).append(line);
			nik(line).find('.b-close').addev("click", function(e) {
				ctx.removeLine(line, cfg);
				delete ctx.data[ cfg.id ];
			});
			this.data[ cfg.id ] = line;
		}*/
		
		switch (cfg.anime) {
				case 'no':
					nik(line).show();
					break;
			default:
				setop(line, 0);
				nik(line).show({speed: cfg.speed});
		}
		return this;
	},
	
	removeLine:  function (line, cfg) {
		//cfg = nik().cpyob(this, cfg || {});
		cfg = nik().cpyob({
			speed: this.speed,
		}, cfg || {});
		
		switch (cfg.anime) {
				case 'no':
					nik(line).remove();
					break;
			default:
				//TODO
				nik(line).hide({speed: cfg.speed, funEnd: function(el){ nik(el).remove(); }});
		}
		return this;
	},

	
	getCont: function (type) {
		var cont = nik().cr('<div class="message-lines message-lines-' + type +'"></div>');
		nik('body').insert(cont);
		return cont;
	},
	
	info:  function (cfg) {
		this.showLine(cfg, 'info');
	},
	
	ok:  function (cfg) {
		this.showLine(cfg, 'success');
	},
	
	error:  function (cfg) {
		this.showLine(cfg, 'error');
	},
	
	war:  function (cfg) {
		this.showLine(cfg, 'warning');
	},
	
	fix: function() {
		if (!this.contFix) {
			this.contFix = this.getCont('fix');
		}
		this.contCur = this.contFix;
		return this;
	},
	
	scroll: function() {
		if (!this.contFix) {
			this.contScroll = this.getCont('scroll');
		}
		this.contCur = this.contScroll;  
		return this;
	},
};


//TODO
(function(nik) {
	
	if (!nik) { 
		console.error('nik is not define');
		return;
	}
	nik().getInstancePrototype().slider = function(cfg) {
			cfg = cfg || {};
			
			function getContent(cont) {
				return nik(cont).find().getData("nik-slider");
			}
			
			function setContent(cont, data) {
				//var content = nik().cpyob(getContent(el) || {}, data);
				//return nik(el).find().setData(content, "nik-slider");
				return nik(el).find().setData(data, "nik-slider");
			}
			
			function setActiveIndex(ctx) {
				// ctx.activeIndex
				/*if (nik(el).find('.tab-head label:nth-child('+(n+1)+')').get().className.indexOf("disable") > -1) {
					return false;
				}
				nik(el).findAll(".active").classDel("active");
				//nik(e.target).classAdd('active');
				nik(el).find('.tab-head label:nth-child('+(n+1)+')').classAdd('active');
				nik(el).find('.tab-cont:nth-child('+(n+1)+')').classAdd('active');
				
				var content = getContent(el);
				content && content.changed && content.changed.call(this, n, el);
				*/
			}
			
			function setDisabled(ctx) {
				/*var label = nik(el).find('.tab-head label:nth-child('+(n+1)+')').get();
				if (label.className.indexOf("disable") > -1) {
					return false;
				}
				disable ? nik(label).classAdd("disable") : nik(label).classDel("disable");
				*/
			}
			
			// init for all
			this.each(function(el) {
				
				var ctx = getContent(el); 
				var localCfg = nik().cpyob({}, cfg); 
				
				if (!ctx) {
					// init one
					localCfg = nik().cpyob({
						width: null,
						activeIndex: 0,
					}, cfg || {});
					
					console.log("init, localCfg:", localCfg);
					localCfg.cont = el;
					
					//cfg.el = el;
					//nik(el).findAll('.tab-head label').each(function(label, n) {
					//	nik(label).addev("click", function(e) { setActiveIndex(n, el); });
					//});
				}
				
				// set dynamic cfg
				if (localCfg.width) el.style.width = localCfg.width;  
				if (localCfg.activeIndex !== undefined) {
					setActiveIndex(localCfg);
				}
				
				if (localCfg.disable !== undefined) {
					setDisable(localCfg);
				}
				
				setContent(el, cfg);
			});
			
			return getContent(this.find().get());
	};
	
})(window.nik);

