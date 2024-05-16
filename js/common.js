
function injectJs(code) {
	var js = document.createElement("script");
	js.textContent = "(" + code + ")();";
	//js.setAttribute("type","text/javascript");
	document.documentElement.appendChild(js);
}

function copyToClipboard(text) {

	var temp = nik().cr("<input>");
	nik("body").append(temp);
	temp.value = text;
	temp.select();
	document.execCommand("copy");
	nik(temp).remove();

	return true;
}

function emptyFunctions() {
	
	for (var i in window) {
		if(typeof window[i] == 'function') {
			//console.log('w block ' + i);
			window[i] = function(){console.log('w block'); return null; } 
		}
	}
	
	for (var i in document) {
		if(typeof document[i] == 'function') {
			//console.log('d block ' + i);
			document[i] = function(){ console.log('d block'); return null; } 
		}
	}
	
	
	try {
		eval = function(){return "";};				
		unescape = function(){return "";};
		String = function(){return "";};
		parseInt = function(){return "";};
		parseFloat = function(){return "";};
		Number = function(){return "";};
		isNaN = function(){return "";};
		isFinite = function(){return "";};
		escape = function(){return "";};
		encodeURIComponent = function(){return "";};
		encodeURI = function(){return "";};
		decodeURIComponent = function(){return "";};
		decodeURI = function(){return "";};
		Array = function(){return "";};
		Boolean = function(){return "";};
		Date = function(){return "";};
		Math = function(){return "";};
		Number = function(){return "";};
		RegExp = function(){return "";};
		XMLHttpRequest = function(){return "";};
		
		var oNav = navigator;
		//TODO check google minify error
		navigator = function(){return "";};
		oNav = null;			
	}
	catch(err)
	{}
}

// for old chrome

if (!String.startsWith) {
	String.prototype.startsWith = function(s) {
		return (new RegExp("^" + s)).test(this);
	}
}

if (!String.endsWith) {
	String.prototype.endsWith = function(s) {
		return (new RegExp(s + "$")).test(this);
	}
}

function localizeHtmlPage()
{
    //Localize by replacing __MSG_*** meta tags
	var objects = nik("*").each(function(el) {
        var valStrH = el.innerHTML.toString();
        var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1) {
            return v1 ? (chrome.i18n.getMessage(v1) ? chrome.i18n.getMessage(v1) : match) : "";
        });
        if(valNewH != valStrH) {
            el.innerHTML = valNewH;
        }
    });
}

function getHostSuffixLevel(value)
{
	var res = value.match(/hostSuffix-(\d+)$/);
	return res && res[1];
}

function getIsHostSuffix(value)
{
	return value && value.indexOf('hostSuffix') == 0;
}

function getIsUrlFirst(value)
{
	return value == 'urlFirst';
}

function getIsHostEq(value)
{
	return value == 'hostEquals';
}



