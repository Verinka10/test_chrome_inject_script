/**
 * 
 */

var bg = chrome.extension.getBackgroundPage();


function htmlGetTruncLinkField(url, width) {
	width = width || 300;
	return "<a style='max-width: "+ width +"px;' class='text-overflow inline' target='_blank' href='"+ url +"'>"+url+"</a>";
}

function htmlGetTruncTextField(text, width) {
	width = width || 300;
	//return "<span style='max-width: "+ width +"px;' class='text-overflow inline'>"+text+"</span>";
	return "<input readonly='readonly' title='"+(text.length > 10 ? text : '')+"' style='width:"+width+"px;' class='url-field' value='"+text+"'>";
}

window.filterTableCommon =  function(table, host, valueAllFields, findHostByAllFields) {
			var filterOpts;
			
			if (findHostByAllFields) {
				filterOpts = {noPopulate: 1, 'field' : 'id',  fun: function(json) { 
					if (!host) return true;
					return JSON.stringify(json).toLowerCase().indexOf(host.toLowerCase()) > -1 
						&& (valueAllFields === '' || JSON.stringify(attr).toLowerCase().indexOf(valueAllFields.toLowerCase()) > -1);  
				}}; 
			} else {
				filterOpts = {'field' : 'id',  fun: function(attr) { 
					if (!host) return true;
					var hostInitiator = attr.condition.initiator && 
					(attr.condition.initiator.hostSuffix || 
						attr.condition.initiator.urlFirst || 
						attr.condition.initiator.hostEquals)
					;
					if (!hostInitiator) return;
					return hostInitiator.toLowerCase().indexOf(host.toLowerCase()) > -1
						&& (valueAllFields === '' || JSON.stringify(attr).toLowerCase().indexOf(valueAllFields.toLowerCase()) > -1);  
				}};
			}
			
			var res = bg.managerRule.getSingle().findAll(filterOpts);
			table.setFilter(function(attr) { 
				return res.indexOf(attr.id) > -1;
			});
			bindEventTableActions(table);
}

//TODO make in face table column action
function bindEventTableActions(table) {
	
	nik(".table-button-del").addev("click", function(e) {
		var id = e.target.getAttribute('data-id');
		bg.managerRule.getRuleById(id).deleteModel();
		table.refresh();
		nik('#cont-table-form').hide();
		//TODO
		if (!nik("#cont-table .table-button-del").exists()) {
			//TODO not work t-pager-prev
			nik('#cont-table .t-pager-start').find().get().dispatchEvent(new Event("click"));
		}
		//bindEventDelete(table);
		//nik(".t-pager li").addev("click", function(e) {nik(".table-ch-action").switcher({theme: 'visual'}); console.log('on .t-pager li'); });
		bindEventTableActions(table);
		e.stopPropagation();
		e.preventDefault();
	});
	
	nik(".table-ch-action").addev("change", function(e) {
		var id = e.target.getAttribute('data-id');
		//e.target.checked ? bg.managerRule.getRuleById(id).up() : bg.managerRule.getRuleById(id).down();
		bg.managerRule.getRuleById(id).enable(e.target.checked);
	});
	
	nik(".t-pager li").addev("click", function(e) {
		//nik(".table-ch-action").switcher({theme: 'visual'}); console.log('on .t-pager li'); 
		bindEventTableActions(table);
		nik('#cont-table-form').hide();
	});
	
	nik(".table-ch-action").switcher({theme: 'visual'});
}


function templateClass() {
	
	// user levels
	var levels = bg.configApp.userLevelClasses;
	var i = levels.length - 1;
	for (var i in levels) {
		nik("." + levels[ i ]).hide();
	}
	do {
		//nik(".temp-userLevel").classToggle("temp-userLevel", bg.configApp.userLevel);
		//console.log(111, levels[ i ], bg.configApp.userLevelClass);
		//nik('head').append("<style>."+levels[ i ]+"{ display: }</style>");
		
		//nik("." + levels[ i ]).classDel("user-level");
		nik("." + levels[ i ]).show();
		if (levels[ i ] == bg.configApp.userLevelClass) break;
	} while (i--);
}


function commonInitUi() {
	// level3RuleManage-popup_autoReload
	nik("#level3RuleManage-popup_autoReload").addev("change", function(e) {
		bg.configApp.level3RuleManage_popup_autoReload = e.target.checked;
		bg.configFun.save();
	});
	nik("#level3RuleManage-popup_autoReload").find().get().checked = bg.configApp.level3RuleManage_popup_autoReload;
}


document.addEventListener('DOMContentLoaded', function() {
	
	//TODO popup not work
	// visual checkboxes
	//nik("input[type=checkbox]").switcher({theme: 'visual'});
	//
	
});