(function(){
   
  var pathl1 = location.pathname.split("/")[1];
  //location.host.endsWith('vk.com')

   if (document.oneLoaded) {
      return;
   }
   document.oneLoaded = 1;



   var urlManager = new (function(config) {
   
   
   this.getHostSuffix = function(url, level) {
      if (!url) return;
      
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
   
   this.getDirPath = function(url, level) {
      
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
      return url.replace(/\?.*/,'');
   }
   
   this.getFileName = function(url) {
      
      fileName = url.replace(this.getHost(url, true), '');
      return fileName.replace(/\?.*/,'');
   }
   
   this.getHref = function(url) {
      //?
      return href;
   }
   
   
    this.getSearch = function(url, withHash) {
      url = url.replace(/.*\?|.*/,'');
      if (!withHash)  url = url.replace(/\#.*/,'');
      
      return url;
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
   
   this.isHostEncrypt = function(url) {
      return this.getScheme(url) == 'https'; 
   }
   
   this.isGoogleWebstore = function(url) {
      return url.startsWith('https://chrome.google.com/webstore'); 
   }

})();



/*********************************************************************** */


   var ModelData = getClassModel(function() {
      this.name_model = localStorage.getItem('model_click_type') || 'd';
      this.attrOpts = [
         {name: "id"},
         {name: "host"},
         {name: "path"},
         {name: "search"},
         {name: "hit", def: 0},
         {name: "updated"},
         {name: "created"},
      ];
   });


   var confHosts = {
      'ok.ru': {
         'disabled': 0,
      },
      'love.ru': {},
      'ozon.ru':{},
      'loveplanet.ru': {},
      'vk.com':{},
      'itch.io':{},
   };
   var hostPlace = location.host.replace(/^www\./, '');
   var hostPlaceForConf = hostPlace.match(/\w+\.\w+$/)[0];
   //console.log(333, hostPlaceForConf);
   var conf = confHosts[ hostPlaceForConf ];
   
   if (!conf || conf.disabled) return;
   
         
         
   function markLocation(hostPlace, pathname) {
      
      var m = ModelData().model.findByAttributes({
         host: hostPlace,
         //path: location.pathname.substr(0, 100),
         path: pathname.substr(0, 100),
      });
      if (!m) { 
         m = new ModelData;
         m.setAttr({created: (new Date).getTime()}).save()
      }
       
       m.setAttr({
         //url: url.substr(0, 100),
         host: hostPlace,
         path: pathname.substr(0, 100),
         //TODO
         //search: urlManager.getSearch(location.href).substr(0, 100),
         hit:  m.attr.hit + 1,
         updated: (new Date).getTime(),
       }).save();
         
       console.log('(where im)set model->', m.attr);
   }
   
   
   
   function markAllLinkElement(root) {
      
      //console.log('markAllLinkElement in', root, root.tagName);
      
      if (root && !root.tagName) return;
      if (root && root.tagName == 'SELECT') return;
      
      nik(root || document).findAll('a').each(function(el) {
         if (el.cc) return;
         el.cc = 1;
         
         if (!el.href) return;
         
         var host = urlManager.getHost(el.href);
         var path = urlManager.getDirPath(el.href);
         path = path && path.substr(0, 100);
         //var search = urlManager.getSearch(el.href).substr(0, 100);
         var m;
         
         //TODO conf
         //m = ModelData().model.findByAttributes({host: host, path: path});
         
         //var href = el.href.substr(0, 100);
         //var url = urlManager.getPathAndSearch(el.href).substr(0, 100),
         
         //if (path = '/wiki/BIOS') search = undefined;
         
         //console.log(host, path, search);
         /*if (conf['bySearch']) {
            //console.log('try found href', host, path, search);
            //TODO check if search = ''
            m = ModelData().model.findByAttributes({host: host, path: path, search: search});
          } else { 
            //console.log('try found path', host, path);
            m = ModelData().model.findByAttributes({host: host, path: path});
          }*/
         //console.log('try ', host, path, search, m ? true : false);
       
         //console.log('try find', host, path, el);
         // only path  
         m = ModelData().model.findByAttributes({host: host, path: path});
         
         if (path.endsWith(pathl1)) return;
         
         if (m) {
            console.log('found', m);
            //el.style.opacity = "0.2";
            el.className =  (el.className ? el.className + ' ' : '') + 'mark-was';
         }
         
          // click shift
          nik(el).addev('click', function (e) {
             //console.log(22);e.preventDefault();return;
             var elTo = e.target;
             elTo.style.opacity = "0.4";
             if (e.shiftKey) {
               e.target.style.opacity = "0.2";
               markLocation(host, path);
               e.preventDefault();  
             } else if (e.ctrlKey) {
               e.target.style.opacity = "0.2";
               markLocation(host, path);
            }
          });
         
      });
   }
   
   function eventInsertElement(e) {
      markAllLinkElement(e && e.target);
      //markAllLinkElement();
   }
   
   
   markLocation(hostPlace, location.pathname);
   nik(document).addev('DOMNodeInserted', eventInsertElement);
   
   markAllLinkElement();
   document.addEventListener('DOMContentLoaded', function (){
         markAllLinkElement();
   });
   
   
   setTimeout(function(){
      var head = nik(document).find('head').get();
      var style = document.createElement("style");
      style.appendChild(document.createTextNode(`
         <style>
         .mark-was {
            color : #8000ff !important;  
         }
         
         .mark-was img {
            opacity: 0.3 !important;
         }
         </style>
      `));
       head && head.appendChild(style);
   }, 1000);
   
})()
