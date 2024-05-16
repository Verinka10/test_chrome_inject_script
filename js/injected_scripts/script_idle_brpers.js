(function(){
      // Script load start, start document




  var pathl1 = location.pathname.split("/")[1];



  if (location.host.endsWith('mamba.ru')) {
      
      console.log("inject for mamba");



      /*var ModelData = getClassModel(function() {
                     this.name_model = 'babs';
                     this.attrOpts = [
                        {name: "id"},
                        {name: "prof_id"},
                        {name: "hit", def: 0},
                        {name: "user_name"},
                     ];
                });
                
      
      var prof_id = location.pathname.match(/(?<=profile\/)\w+/)[0];
      
      var u = ModelData().model.findByAttributes({prof_id: prof_id}) || new ModelData;
      
      u.setAttr({
              prof_id: prof_id,
              hit:  u.attr.hit + 1,
              user_name: nik("[data-name=profile-info-2] span[data-name=item-title-name]").find().get().innerHTML,
      }).save();
      
      
      console.log(ModelData().model.findAll({noPopulate: 1}));
      */
      
      document.addEventListener('DOMContentLoaded', function (){
         setTimeout(function(){ 
               document.querySelector('[data-name=install-pwa-banner]') && document.querySelector('[data-name=install-pwa-banner]').remove();
               document.querySelector('[data-name=photoline-uniweb]') && document.querySelector('[data-name=photoline-uniweb]').parentNode.parentNode.remove(); 
            }, 2000);
      });
      
      setTimeout(function(){ 
               document.querySelector('[data-name=install-pwa-banner]') && document.querySelector('[data-name=install-pwa-banner]').remove();
      }, 2000);
      
      /*nik(document).addev('DOMNodeInserted', function (e) {
         //console.log(e.target);
      });
      */
      
      // set profile
      var match = location.pathname.match(/(?<=profile\/)\w+/);
      var prof_id = match && match[0];
      if (prof_id) {
         var hit = localStorage.getItem("bab_" + prof_id) || 0;
         localStorage.setItem('bab_' + prof_id, ++hit);
         
         console.log(localStorage);
      }
      
      // list
      var tic = 0;
      var touchEv2 = {};
      //var touchCheck = {}; var countCheck = 0;
      
      nik(document).addev('DOMNodeInserted', function (e) {
         var a = e.target.firstChild;
         var match = a && a.href && a.href.match(/(?<=profile\/)\w+/);
         var prof_id = match && match[0];
         
         //console.log(a && a.href, prof_id, localStorage.getItem("bab_" + prof_id));
         if (prof_id && localStorage.getItem("bab_" + prof_id)) {
            e.target.style.opacity = "0.2";
         }
         
           // event shiftKey + click
               if (prof_id && ! localStorage.getItem("bab_" + prof_id)) {
                  nik(e.target).addev('click', function (e) {
                     //console.log(22);e.preventDefault();return;
                     
                     var elTo = e.target;
                     elTo.style.opacity = "0.4";
                     
                     if (e.shiftKey) {
                        e.target.style.opacity = "0.2";
                        localStorage.setItem("bab_" + prof_id, 's');
                        e.preventDefault();  
                     }
                  });
               }         
               
         //e.target.style.opacity = "0.2";
         //console.log(e.target.firstChild.href);
         
         if ((new Date).getTime() - tic > 1000) {
            
            //if (touchCheck[ countCheck ]) return;
            
            // mark opened profiles
            console.log('check...');
            
            // list
            /*nik('[data-name=search-list-item] a').each(function(el) {
               
               
               
               var match = el && el.href && el.href.match(/(?<=profile\/)\w+/);
               var prof_id = match && match[0];
               
               if (prof_id && localStorage.getItem("bab_" + prof_id)) {
                  //console.log('ok 1', localStorage.getItem("bab_" + prof_id));
                  el.style.opacity = "0.2";
                  //el.target.style.opacity = "0.2";
                  //el.target.parentChild.removeChild(e.target);
               }
               
               // event shiftKey + click
               if (prof_id && ! localStorage.getItem("bab_" + prof_id)) {
                  nik(el).addev('click', function (e) {
                     //console.log(22);e.preventDefault();return;
                     
                     if (e.shiftKey) {
                        el.style.opacity = "0.2";
                        localStorage.setItem("bab_" + prof_id, 's');
                        e.preventDefault();  
                     }
                  });
               }
            }); // nik('[data-name=search-list-item] a').each
            */
            
            // rating
            if (pathl1 =='rating') {
                nik('[data-name=voting-photo] > img').each(function(el) {
                  var prof_id = el && el.src && el.src.split('/')[6];
                  
                  if (touchEv2[ prof_id ]) return;
                  touchEv2[ prof_id ] = 1;
                  
                  if (prof_id && localStorage.getItem("bab_" + prof_id)) {
                     //console.log('ok', prof_id, localStorage.getItem("bab_" + prof_id));
                     //el.style.opacity = "0.2";
                     el.style.opacity = "0.8";
                  } else {
                     el.style.opacity = "1";                     
                  }
                  
                  if (prof_id && ! localStorage.getItem("bab_" + prof_id)) {
                     // TODO ? Need skip ?
                     //localStorage.setItem("bab_" + prof_id, 's');
                  }
                  
                  nik(el.parentNode).addev('click', function (e) {
                     //console.log(e);
                     if (e.shiftKey) {
                        el.style.opacity = "0.2";
                        localStorage.setItem("bab_" + prof_id, 's');
                        e.preventDefault();  
                     }
                     if (e.ctrlKey) {
                        openNewBackgroundTab('/profile/' + prof_id);
                        e.preventDefault();  
                     }
                  });
                  
                 nik(document).addev('keydown', function (e) {
                     // left
                     if (e.keyCode == 37) {
                        nik('[data-name="dislike-action"]').find().get().click();
                        //e.preventDefault();  
                     }
                     // right
                     if (e.keyCode == 39) {
                        nik('[data-name="like-action"]').find().get().click();
                     }
                     // spase
                     if (e.keyCode == 32) {
                     }
                     if (e.shiftKey) {}
                 });
                        
               });
            }
            
            
          // remove load block
         if (pathl1 == 'profile') {
            /*nik(document).addev('DOMContentLoaded', function (e) {
               setTimeout(function() { nik(document).find('.grid-container').remove(); }, 2000);
            });*/
            nik(document).find('.grid-container').remove();
          }
          // all
          if (document.querySelector('#contact_top')){
             document.querySelector('#contact_top').parentNode && document.querySelector('#contact_top').parentNode.parentNode.remove();
          }
          //nik(document).find('[data-name=search-banner]').remove();
          //document.querySelector('#top_banner_ad_fox').parentNode.remove();
          document.querySelector('[data-name=photoline-uniweb]') && document.querySelector('[data-name=photoline-uniweb]').parentNode.parentNode.remove();
          
          document.querySelector('[data-name=install-pwa-banner]') && document.querySelector('[data-name=install-pwa-banner]').remove();
          
          
          /*document.querySelector('#slot_contacts_list_1').parentNode.parentNode.remove();
          document.querySelector('#slot_contacts_list_2').parentNode.parentNode.remove();
          document.querySelector('#slot_contacts_list_3').parentNode.parentNode.remove();
          document.querySelector('#slot_contacts_list_4').parentNode.parentNode.remove();
          document.querySelector('#slot_contacts_list_5').parentNode.parentNode.remove();
          */
          
         } // DOMNodeInserted tic
         tic = (new Date).getTime();
         
         //touchCheck[ countCheck ] = 1;
         //countCheck++;
      }); 
       
      // rating set event
      if (pathl1 =='ratingXXX') {
            nik(document).addev('keyup', function (e) {
               var el = nik('div > div > [data-name=voting-photo] > img').find().get();
               //console.log(el);
               var prof_id = el && el.src && el.src.split('/')[6];
               el.style.opacity = "0.2";
               localStorage.setItem("bab_" + prof_id, 'i');
               e.preventDefault();  
            });
            
   
      }
            
       
       
       
       
      // utils
      
      var babs_dump = function() {
         var data = {};
         for (var i in localStorage) {
            if (! i.toString().startsWith('bab_')) continue;
            data[ i ] = localStorage[ i ]; 
         }
         return data;
      }
      
      //TODO create global, not work set window.babs_import
      var babs_import = function(data) {
         for (var i in data) {
            localStorage[ i ] = data[ i ]; 
         }
      }
      
      
      // add menu
      nik(document).addev('DOMContentLoaded', function (e) {
         
         var countBabs = Object.keys(localStorage).length;
         
         setTimeout(function(){
               nik('header').append(`<div style="opacity: 0.8; position: fixed; left:0; top:0; background-color: #ffffc7; padding: 2px; font-size: 12px;">
                  <a id='babs-dump' href='#'>babs_dump (`+ countBabs +`)</a>
                  <br>
                  <a id='babs-import' href='#'>babs_import(show log)</a>
              </div>`);
               nik('#babs-dump').addev('click', function(){ console.log(JSON.stringify(babs_dump())); return false;  });
               nik('#babs-import').addev('click', function(){ console.log(babs_import); return false;  });
            }, 10000);
      });
      
   }
 
 
 
 
 
 
 
 
  if (location.host.endsWith('musify.club')) {

      console.log("inject for musify.club");
      
 

     var downloadMM = function () {

      var imgtit = document.querySelector('img.artist-img') && document.querySelector('img.artist-img').getAttribute('src');
          imgtit = imgtit || document.querySelector('img.album-img') && document.querySelector('img.album-img').getAttribute('src');
          
      if (imgtit && !localStorage[ imgtit ]) { 
              location = imgtit;
              localStorage[ imgtit ] = 1;
         }
          
      document.querySelectorAll('.playlist__actions a').forEach(function(el, n){  setTimeout(function(){
              var line = el.parentNode.parentNode;
              
              if (el.title && localStorage[el.title]) { 
                  console.log(n, '---- exists, skip', el.title);
                  //el.append(nik().cr("<b style='color:orange'>exists</b>"));
                  line.style.backgroundColor = 'orange';
                  return; 
               }
              localStorage[el.title] = 1;
              if (el.title && el.href.endsWith('.mp3')) {
                  console.log(n, el.title, decodeURI(el.href));
                 location = el.href;
                 //el.append(nik().cr("<b style='color:#21e521;'>ok</b>"));
                 line.style.backgroundColor = '#70fd70';
               }
      }, n * 4000); });

      }


      function insertMenu() {
          if (nik('#nik-menu').find().get()) return;
          nik('header').append(`<div id="nik-menu"  style="opacity: 0.8; position: fixed; left:0; top:0; background-color: #ffffc7; padding: 2px; font-size: 12px;">
                  <a id='gera-get' href='#'>download</a>
         </div>`);
         nik('#gera-get').addev('click', function(){ downloadMM(); return false;  });
      }

      nik(document).addev('DOMContentLoaded', insertMenu);
      insertMenu();
  }
  
  

  if (location.host.endsWith('muzofond.fm')) {

      console.log("inject for muzofond.fm");
      
       var downloadMM = function () {
         (function(){
         document.querySelectorAll('.mainSongs li.play').forEach(function(el, n){  setTimeout(function(){
                 var url = el.getAttribute('data-url');
                 var line = el.parentNode.parentNode.parentNode;
                 
                 if (url && localStorage[ url ]) {  
                     console.log(n, '---- exists, skip', url);
                     //el.append(nik().cr("<b style='color:orange'>exists</b>"));
                     line.style.backgroundColor = 'orange';
                     
                     
                     return; 
                 }
                 localStorage[ url ] = 1;
                 if (url) {
                     console.log(n, decodeURI(url));
                     location = url; 
                     //el.append(nik().cr("<b style='color:#21e521;'>ok</b>"));
                     line.style.backgroundColor = '#70fd70';
                  }
         }, n * 1000); });
         })();
        }

        
       function insertMenu() {
          if (nik('#nik-menu').find().get()) return;
          nik('.header').append(`<div id="nik-menu" style="position: fixed; top:0; background-color: #ffffc7; padding: 2px; font-size: 12px;">
                  <a id='gera-get' href='#'>download</a>
         </div>`);
         nik('#gera-get').addev('click', function(){ downloadMM(); return false;  });
      }

      nik(document).addev('DOMContentLoaded', insertMenu);
      insertMenu();
      
  }




 if (location.host.endsWith('ritm.mobi')) {

      console.log("inject for ritm.mobi");
      
       var downloadMM = function () {
 
            var count = 0;    
            document.querySelectorAll('li a.mmc').forEach(function(el, n){  setTimeout(function(){
                   var line = el.parentNode;
               
                    if (el.title && localStorage[el.title]) { 
                        console.log(n, '---- exists, skip', el.title);
                        return; 
                    }
                    localStorage[el.title] = 1;
                    if (el.href) {
                        console.log(++count, el.title, decodeURI(el.href));
                        //location = el.href; 
                    }
                    line.style.backgroundColor = '#70fd70';
            }, n * 1000); });
         
        }

    
       function insertMenu() {
          if (nik('#nik-menu').find().get()) return;
            nik('body').append(`<div id="nik-menu" style="position: fixed; top:0; background-color: #ffffc7; padding: 2px; font-size: 12px;">
                  <a id='gera-get' href='#'>download</a>
         </div>`);
         nik('#gera-get').addev('click', function(){ downloadMM(); return false;  });
      }
      
      nik(document).addev('DOMContentLoaded', insertMenu);
      insertMenu();
      
  }




  if (location.host.endsWith('loveplanet.ru')) {
   
      console.log("inject for loveplanet");
      
      
   //var countInsert = 0;
   
   var qqGetInfo = [];
   setInterval(function(){
      
      if (qqGetInfo.length) {
         var el = qqGetInfo.shift();
         //console.log(555, el.href.match(/page\/([^\/]+)/));
         //return;
         
         console.log('Get info', el);
         var m = el.href.match(/page\/([^\/]+)/);
         var login = m && m[1];
         if (!login) return;
         
         //'{ "more": 0, "has_more": 0, "user": [ { "foto": "https:\\/\\/pics.loveplanet.ru\\/15\\/foto\\/ee\\/7a\\/ee7a82e6\\/eQ+4d3w==_.jpg?p=@", "uid": 4001006310, "login": "04cc5e09492e", "name": "Наташа", "sex": 2, "age": 39, "blocks": { "meet": { "m_pol": 1 } }, "elite": 0, "nick": "Дельфин", "zodiac": 6, "zodiac_n": "Дева", "client": 2, "city": 4962, "city_n": "Санкт-Петербург", "country": 3159, "country_n": "Россия", "region": 4925, "region_n": "Ленинградская область", "przwheel": 1, "lang": "ru", "live": 1, "proof": 0, "phone": 0, "photo": 1, "intim": 1, "dbllike": 0, "own_like": 0, "usr_like": 0, "newmess": 0, "inmess": 0, "outmess": 0, "contact_ts": 0, "fid": 0, "is_call_offer": 0, "is_allow_video_call": 0, "is_disable_income_call": 0, "is_video_call": 1 } ], "errno": 0 }'
         nik().ajax({url: '/api/a-mapinl?gui=' + login, funok: function(d) {
            var data = JSON.parse(d);
            //console.log(777, data.user[0].elite);
            var user = data.user[0];
            if (user.fid) {
               //nik(el).append("<b>OK</b>");
               nik(el).append("<b style='color:green'>---------------------------OK</b>");
               localStorage['bm_' + login] = 1;
               console.log('!!!!!!!!!!!!!!!OK', el);
            } else {
               nik(el).append("<b style='color:red'>---------------------------NO</b>");
               localStorage['bm_' + login] = 0;
               //console.log('NO', el);
            }
         }});
      }
   }, 500);
   
   function eventInsertElement(e) {
      
      var root = e && e.target;
      if (root && !root.tagName) return;
      if (root && root.tagName == 'SELECT') return;
      
      
      nik(root || document).findAll('.buser_photo-v2 a').each(function(el) {
         
         if (!el.href) return;
         if (el.bb) return;
         el.bb = 1;
         
         
         var m = el.href.match(/page\/([^\/]+)/);
         var login = m && m[1];
         if (!login) return;
         
         var cache = localStorage['bm_' + login];
         if (cache !== undefined) {
            cache == 1 ? nik(el).append("<b style='color:green'>---------------------------OK</b>") 
                       : nik(el).append("<b style='color:red'>---------------------------NO</b>");
            return;
         }
         qqGetInfo.push(el);
         //var host = urlManager.getHost(el.href);
         //var path = urlManager.getDirPath(el.href);
         
         
         
      });
      
    }
      
      // controller
    nik(document).addev('DOMNodeInserted', eventInsertElement);
      
  }
      




  if (location.host.endsWith('love.ru')) {
   
      console.log("inject for love.ru");
      
      if (pathl1 =='encounters') {
         
         nik('#sympathy_super_form').find().get().style.display = "none";
         
         nik(document).addev('keydown', function (e) {
               // left
               if (e.keyCode == 37) {
                  nik("#sympathy_btn_reject").find().get().click();
                  //e.preventDefault();  
               }
               // right
               if (e.keyCode == 39) {
                  nik("#sympathy_btn_send").find().get().click();
               }
               // spase
               if (e.keyCode == 32) {
                  nik("#sympathy_photo > div").find().get().click();
               }
               if (e.shiftKey) {}
           });
      }
      
      // remove all
      document.querySelector('#gallery_wrapper') && document.querySelector('#gallery_wrapper').remove();
      document.querySelector('#cash_window') && document.querySelector('#cash_window').remove();
      // or ?
      //setTimeout(function(){ document.querySelector('#cash_window') && document.querySelector('#cash_window').remove();  }, 5000);
      
  }








//

function openNewBackgroundTab(url){
    var a = document.createElement("a");
    a.href = url;
    var evt = document.createEvent("MouseEvents");
    //the tenth parameter of initMouseEvent sets ctrl key
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
                                true, false, false, false, 0, null);
    a.dispatchEvent(evt);
}


})()
