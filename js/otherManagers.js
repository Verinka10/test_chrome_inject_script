
var defaultRuleUrlManager = new (function(config) {
   
   //const MAX_PATH_LEVEL = 255;
   
   this.getHostId = function(pref, urlInitiator, url, opts) {
      opts = opts || {};
      var id = pref || '';
      
      if (opts.noHostId) {
         return '';
      }
      
      if (urlInitiator) {
         
         var isHostSuffix = getIsHostSuffix(configApp.defaultPolicyAddRuleFrom);
         var isUrlFirst = getIsUrlFirst(configApp.defaultPolicyAddRuleFrom);
         var isHostEq = getIsHostEq(configApp.defaultPolicyAddRuleFrom);
         
         if (opts.policyFrom) {
            isHostSuffix = getIsHostSuffix(opts.policyFrom);
            isUrlFirst = getIsUrlFirst(opts.policyFrom);
            isHostEq = getIsHostEq(opts.policyFrom);
         }
         
         if (isHostSuffix) {
            var level = opts.policyFrom ? getHostSuffixLevel(opts.policyFrom) : getHostSuffixLevel(configApp.defaultPolicyAddRuleFrom);
            var hostInitiator = defaultRuleUrlManager.getHostSuffix(urlInitiator, level);
            id += '-s-' + hostInitiator;
         }
         if (isUrlFirst) {
            var hostInitiator = defaultRuleUrlManager.getHost(urlInitiator, true);
            id += '-f-' + hostInitiator;
         }
         //TODO write test
         if (isHostEq) {
            var hostInitiator = defaultRuleUrlManager.getHost(urlInitiator, false);
            id += '-e-' + hostInitiator;
         }
      }
      
      // to url
      if (url) {
         var isHostSuffix = getIsHostSuffix(configApp.defaultPolicyAddRuleTo);
         var isUrlFirst = getIsUrlFirst(configApp.defaultPolicyAddRuleTo);
         var isHostEq = getIsHostEq(configApp.defaultPolicyAddRuleTo);
         
         if (opts.policyTo) {
            isHostSuffix = getIsHostSuffix(opts.policyTo);
            isUrlFirst = getIsUrlFirst(opts.policyTo);
            isHostEq = getIsHostEq(opts.policyTo);
         }
         
         if (isHostSuffix) {
            var level = opts.policyTo ? getHostSuffixLevel(opts.policyTo) : getHostSuffixLevel(configApp.defaultPolicyAddRuleTo);
            var urlDest = defaultRuleUrlManager.getHostSuffix(url, level);
            id += '-st-' + urlDest;
         }
         if (isUrlFirst) {
            var urlDest = defaultRuleUrlManager.getHost(url, true);
            id += '-ft-' + urlDest;
         }
         if (isHostEq) {
            var urlDest = defaultRuleUrlManager.getHost(url, false);
            id += '-et-' + urlDest;
         }
      }
      
      id += (opts.temp ? '-temp' : '');
      
      return id;
   }
   
   // for pop up labels and others
   this.getHostToByPolicy = function(url, opts) {
      opts = opts || {};
      /*if (getIsHostSuffix(configApp.defaultPolicyAddRuleTo)) {
         var level = getHostSuffixLevel(configApp.defaultPolicyAddRuleTo); 
         host = this.getHostSuffix(url, level);
      } else
      if (getIsUrlFirst(configApp.defaultPolicyAddRuleTo)) {
         host = this.getHost(url, true);  
      }*/
      var host = '';
      
      if (url) {
         var isHostSuffix = getIsHostSuffix(configApp.defaultPolicyAddRuleTo);
         var isUrlFirst = getIsUrlFirst(configApp.defaultPolicyAddRuleTo);
         var isHostEq = getIsHostEq(configApp.defaultPolicyAddRuleTo);
         
         if (opts.policyTo) {
            isHostSuffix = getIsHostSuffix(opts.policyTo);
            isUrlFirst = getIsUrlFirst(opts.policyTo);
            isHostEq = getIsHostEq(opts.policyTo);
         }
         
         if (isHostSuffix) {
            var level = opts.policyTo ? getHostSuffixLevel(opts.policyTo) : getHostSuffixLevel(configApp.defaultPolicyAddRuleTo);
            host = defaultRuleUrlManager.getHostSuffix(url, level);
         }
         if (isUrlFirst) {
            host = defaultRuleUrlManager.getHost(url, true);
         }
         if (isHostEq) {
            host = defaultRuleUrlManager.getHost(url, false);
         }
      }
      return host;
   }
   
   
   this.getHostSuffix = function(url, level) {
      if (!url) return;
      if (this.isContainVar(url)) return url;
      
      // TODO test: strip www
      var url = url.replace(/([\w-]+:\/\/\/?)www\./, '$1');
      
      var hostSuffix = url.match(/[\w-]+:\/\/\/?([^\/\?]+)/);
      if (!hostSuffix || !hostSuffix[1]) {
         //throw 'hostSuffix not extract from url: ' + url;
         console.error('hostSuffix not extract from url: ' + url);
         return '';
      }
      // return all subdomain
      if (!level) return hostSuffix[1]; 
      
      var hh = hostSuffix[1].split('.');
      return hh.slice(hh.length-Math.min(level, hh.length), hh.length).join('.');
   }
   
   this.getHost = function(url, withScheme) {
      if (!url) return;
      //TODO ? !!!
      if (this.isContainVar(url)) return url;
      
      // TODO test: strip www
      var url = url.replace(/([\w-]+:\/\/\/?)www\./, '$1');
      
      var host = url.match(/([\w-]+:\/\/\/?)?([^\/\?]+)/);
      if (!host || !host[0]) {
         console.error('host not match');
         //throw 'host not extract from url: ' + url;
      }
      return withScheme ? host[0] : host[2];
   }
   
   
   this.getSuffixPath = function(url) {
      if (!url) return;
      if (this.isContainVar(url)) return url;
      
      // create default suffix path extract filename 
      url = url.replace(/\?.*/,'');
      var path = url.match(/[^\/](\/[\w\.-]+\.[\w-]+)$/);
      path = path && path[1];
      
      if (!path) {
         path = url.match(/[^\/](\/[^\/]+?)\/?$/);
         path = path && path[1] || '';
      }
      /*if (!path) {
         throw 'path not extract from url: ' + url;
      }*/
      return path;
   }
   
   this.isSuffixPathFile = function(url) {
      return !!this.getSuffixPath(url).match(/\.[\w-]+$/);
   }
   
   this.getScheme = function(url) {
      var scheme = url.match(/^[\w-]+(?=\:)/);
      return scheme && scheme[0];
   }
   
   this.getHostToByPolicyAndDir = function(url, level, opts) {
      return this.getHostToByPolicy(url, opts) + this.getDirPath(url, level);
   }
   
   this.getDirPath = function(url, level) {
      if (this.isContainVar(url)) return url;
      
      //var path = url.match(/(?<![\/:])\/[^?]+/);
      // for old chrome
      var path = url.match(/\/[^?]+/);
      
      //return path;
      if (path && path[0]) {
         // for old chrome
         path[0] = path[0].replace(/\/\/\/?[^\/]+/,'');
      //return path[0].split(/(?<!^)\/(?!$)/);
         
         //var comps = path[0].split(/(?<!^)\//);
         // for old chrome
         var comps = path[0].split('/');
         comps.shift();
         
         result = level ? comps.slice(0, level).join('/') : comps.join('/');
         if (result) {
            result = '/' + result; 
         }
         // remove if contain file
         result = result.replace(/\/[\w\.-]+\.[\w-]+$/,'');
         return result + (comps.length > level ? '/' : '');
      }
      return '';
   }
   
   this.getHostFile = function(url) {
      if (this.isContainVar(url)) return url;
      return url.replace(/\?.*/,'');
   }
   
   this.getFileName = function(url) {
      if (this.isContainVar(url)) return url;
      
      fileName = url.replace(this.getHost(url, true), '');
      return fileName.replace(/\?.*/,'');
   }
      
   this.isUrlFromUrlHost = function(url, urlHost) {
      var host = this.getHost(urlHost, true);
      
      return url.indexOf(host) == 0;
   }
   
   this.isUrlFromUrlHostAndPath = function(url, urlHost) {
      var host = this.getHost(urlHost, true);
      var path = this.getDirPath(urlHost);
      
      return url.indexOf(host + path) == 0;
   }
   
   this.isExtension = function(url) {
      return url.indexOf('chrome-extension') == 0;
   }
   
   this.isChromeSpec = function(url) {
      return url.indexOf('chrome') == 0;
   }
   
   this.isUrlSelfExtension = function(url) {
      return this.getHost(chrome.extension.getURL('')) == this.getHost(url);
   }
   
   this.isExistSuffixLevel = function(url, level) {
      var suff = this.getHostSuffix(url, level);
      //console.log(111, suff.split('.'));
      return suff && suff.split('.').length >= level;
   }
   
   this.isExistDirLevel = function(url, level) {
      var dir = this.getDirPath(url, level);
      if (dir) {
         dir = dir.replace(/\/$/, '').replace(/^\//, '');
         //console.log(dir, dir.split('/'));
         return dir.split('/').length >= level;
      }
      return false;
   }
   
   /**
    * Check /vvv/xxx/ (absolute) or vvv/xxx/ (rel) in  http://dev.admin.mshop.local:8013/vvv/xxx/zzz
    * Usage: isDirExists("http://dev.admin.mshop.local:8013/vvv/xxx/zzz", 'xxx/zzz');
    */
   this.isDirExists = function(url, dir) {
      
      var s = '';
      if (dir.endsWith('/')) dir = dir.substr(0, dir.length - 1);
      if (dir.charAt(0) == '/') { s = this.getHostSuffix(url);  }
      s += dir;
      return url.match(new RegExp(s + '(\/|\$|\\?)'));
   }
   
   this.isContainVar = function(url) {
      return (/\{TAB_URL|DEST_URL|TAB_SCHEME|DEST_SCHEME|TAB_HOST|DEST_HOST|TAB_HOST_SCHEME|DEST_HOST_SCHEME|TAB_PATH|DEST_PATH|TAB_HOST_PATH|DEST_HOST_PATH|TAB_HOST_SCHEME_PATH|DEST_HOST_SCHEME_PATH\}/)
         .test(url);
   }
   
   this.isHostEncrypt = function(url) {
      return this.getScheme(url) == 'https'; 
   }
   
   
   this.isGoogleWebstore = function(url) {
      return url.startsWith('https://chrome.google.com/webstore'); 
   }

})();
