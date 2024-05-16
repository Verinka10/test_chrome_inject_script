(function(){
   
  // Script on updated tab, start document


  var pathl1 = location.pathname.split("/")[1];
  window.countLoad = window.countLoad ? window.countLoad + 1 : 1;
  //window.countLoadPath = window.countLoadPath || {};
  //window.countLoadPath[ pathl1 ] = window.countLoadPath[ pathl1 ] ? window.countLoadPath[ pathl1 ] + 1 : 1; 


   if (location.host.endsWith('vk.com')) {
      console.log("inject for vk.com");
      
      
     var ModelData = getClassModel(function() {
                     this.name_model = localStorage.getItem('model_type') || 'babs';
                     this.attrOpts = [
                        {name: "id"},
                        {name: "prof_host"},
                        {name: "prof_id"},
                        {name: "hit", def: 0},
                        {name: "user_name"},
                        {name: "count_foto"},
                        {name: "updated"},
                     ];
     });
      
     var VkDom = function (root) {
         
         this.root = root || document;
         //this.path1 = pathl1;
         
         
         this.profHost = function() {
            
            /*var elLink = nik(this.root).find('link[rel="alternate"]').get();
            if (elLink) {
               url = elLink.content.split("/")[3];
               return url && url.replace(/\?.+$/, '');
            }*/
            
            /*var el = nik(this.root).find(".ui_ownblock").get() ||
                     nik(this.root).find("a.ui_crumb").get();
            if (root) {
               el = nik(this.root).find('link[rel="alternate"]').get();
            } 
            var url = el && el.href.split("/")[3];         
            */
            
            /*console.log(
               nik(this.root).find(".ui_ownblock").get(),
               nik(this.root).find("a.ui_crumb").get(),
               nik(this.root).find('link[rel="alternate"]').get(),
               nik(this.root).find('meta[property="og:url"]').get()
            )*/
            
            //var el = nik(this.root).find(".top_back_link").get() || 
            
            /*if (url.startsWith('friends')) {
               var el = nik(this.root).find('meta[property="og:url"]').get();
               if (el) {
                  //console.log(888, el);
                  console.log(666, this.root);
                  url = el.content.split("/")[3];
               }
            }*/
            //console.log(111, this.root.documentElement.innerHTML.match(/user_id.+/m));
            
            var url;
            
            if (root) {
               el = nik(this.root).find('link[rel="alternate"]').get();
               url = el.href;
               url = url.split("/")[3];
            } else {
               url = location.pathname;
            }
            
            if (url && url.indexOf('/friends') > -1) {
               var el = nik(this.root).find(".ui_ownblock").get() ||
                        nik(this.root).find("a.ui_crumb").get();
               url = el.href;
               url = url.split("/")[3];
            }
            
            
            if (!url) {
               throw 'not founded prof host';
            } 
            
            url = url.replace(/^\//, '')
            return url.replace(/\?.+$/, '');
         }
        
        
         
         this.getName = function() {
            var el = nik(this.root).find(".page_name").get() 
               || nik(this.root).find("#photos_albums_block .ui_crumb").get()
               || nik(this.root).find(".ui_ownblock_info .ui_ownblock_label").get();
            if (el) {
               return el.innerHTML;
            }
         }
         
         this.getCountFoto = function() {
            var el = nik(this.root).find("#profile_photos_module .header_count").find().get() || 
                     nik(this.root).find("#photos_all_block .ui_crumb_count").find().get();
            if (el) {
               return parseInt(el.innerHTML);
            }
         }
         
         this.requestInfo = function(url, fsuccess) {
                 nik().ajax({url: url, funok: function(d) {
                     var div = document.createElement('div'); 
                     div.innerHTML = d;
                     fsuccess.call(this, new VkDom(div));
                 }});
         }
         
         
         this.getModel = function() {
            var prof_host = this.profHost();
            if (!prof_host) {
               console.error('prof_host not def');         
               return;
            }
            return ModelData().model.findByAttributes({prof_host: prof_host});
         }
         
         
         this.update = function() {
            var prof_host = this.profHost(); 
            if (!prof_host) {
               console.error('prof_host not def');         
               return;
            }
            var u = this.getModel() || new ModelData;
            
            var profileName = this.getName(); 
            profileName && u.setAttr({user_name: profileName.substr(0,16)}).save();
         
            var countFoto = this.getCountFoto(); 
            countFoto && u.setAttr({count_foto: countFoto}).save();
         
            u.setAttr({
               prof_host: prof_host, 
               updated: (new Date).getTime()
            }).save();
            
            console.log('set model->', this.getModel().attr);
        }
        
        this.updateHit = function() {
             var u = this.getModel() || new ModelData;
             u.setAttr({hit:  u.attr.hit + 1, updated: (new Date).getTime()}).save();
        }
        
        
        // init
        //if (!root) {
        // this.prof_host = 
        //}
        
         
      };
      
       var vkDom = new VkDom();
         
      if (window.countLoad == 1) {
            
      }
      
      setTimeout(function(){
         vkDom.update();
         vkDom.updateHit();
         
      }, 500);
      
      
      
      //root event
      
      /*var prof_host = pathl1;
      if (pathl1 && pathl1.match(/^albums\d+$/)) {
         prof_host = nik("a.ui_crumb").find().get().href.split("/")[3];
      }*/
      
     
      // list users
      
      if (pathl1 == 'search' || pathl1 == 'friends') {
         
         var elHits = {};
         nik(document).addev('DOMNodeInserted, DOMContentLoaded', function (e) {
            
            //console.log(e.target);
            /*if (e.target.className.indexOf('people_row search_row') == -1 &&
                e.target.className.indexOf('friends_user_row') == -1
              ) { return; }
             */  
            
            /*nik(e.target).find('a.search_item_img_link, .friends_photo').each(function(el) {
               console.log(333, el);
               
            });
            return;
            */
            //if (!e.target) return;
            
            nik('a.search_item_img_link, .friends_photo').each(function(el) {
            //nik(e.target).find('a.search_item_img_link, .friends_photo').each(function(el) {
                  var match = el && el.href && el.href.match(/(?<=\.com\/).+/);
                  var prof_host = match && match[0];
                  
                  
                  if (!prof_host) {
                     console.log('not prof_host, return');
                     return;
                  }
                  if (elHits[ prof_host ]) return;
                  elHits[ prof_host ] = 1;
                  
                  // mark 
                  var u = ModelData().model.findByAttributes({prof_host: prof_host});
                  if (u) {
                     if (u.attr.hit) el.style.opacity = "0.2";
                     el.parentNode.parentNode.appendChild(nik().cr(u.attr.count_foto + ' m:' + (new Date(u.attr.updated).getMonth())));
                  } else {
                     // not found model
                  }
                  
                  // set events
                  nik(el).addev('click', function (e) {
                     //elHits[ prof_host ] = 0;
                     
                     if (e.shiftKey || e.altKey) {
                        vkDom.requestInfo(el.href, function(vkDomInfo) {
                           vkDomInfo.update();
                           var attr = vkDomInfo.getModel().attr;
                           el.parentNode.parentNode.appendChild(nik().cr(attr.count_foto ? attr.count_foto : 'block? '));
                        });
                        e.preventDefault();  
                        return;
                     }
                     
                     if (e.shiftKey) {
                        var u = ModelData().model.findByAttributes({prof_host: prof_host}) || new ModelData;
                        el.style.opacity = "0.2";
                        u.setAttr({prof_host: prof_host, hit:  u.attr.hit + 1}).save();
                        e.preventDefault();  
                     }
                  });
                  
               });
            
            });
         
         } // search block
         
         
         // menu
         
        setTimeout(function(){
              nik('header').append(`<div style="opacity: 0.8; position: fixed; left:0; top:0; background-color: #ffffc7; padding: 2px; font-size: 12px;">
                     <a id='babs-dump' href='#'>babs_dump</a>
                     <br>
                     <select id="model-type">
                        <option value="mal">mal</option>
                        <option value="babs">babs</option>
                     </select>
              </div>`);
              nik('#babs-dump').addev('click', function(){ console.log((new ModelData).dump({v2: true})); return false;  });
              nik('#model-type').addev('change', function(e){ localStorage.setItem('model_type', e.target.value);  });
              nik("#model-type").find().get().value = localStorage.getItem('model_type') || 'babs';
        }, 1000);
         
      
      //console.log("run...................", pathl1);
   }



})()
