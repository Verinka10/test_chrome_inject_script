(function(){
   
  // Script load start, start document


  var pathl1 = location.pathname.split("/")[1];
  window.countLoad = window.countLoad ? window.countLoad + 1 : 1;


   if (location.host.endsWith('vk.com')) {
      console.log("inject for vk.com");
   
      /*document.addEventListener('DOMContentLoaded', function (){
         console.log(111, 'load...');
      });
      
      window.addEventListener('popstate', function(e) {
         console.log('popstate...');
      });
      */
      
      if (window.countLoad > 1) {
         console.log('skip by countLoad');
         return;
      }
      
      var prof_host = pathl1;
      if (pathl1 && pathl1.match(/^albums\d+$/)) {
         prof_host = nik("a.ui_crumb").find().get().href.split("/")[3];
      }
      
      if (!prof_host) {
         console.log('prof_host not def');         
         return;
      }
      console.log('prof_host', prof_host);
      
      
      var ModelData = getClassModel(function() {
                     this.name_model = 'babs';
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
                
      
      
      var u = ModelData().model.findByAttributes({prof_host: prof_host}) || new ModelData;
      
      u.setAttr({prof_host: prof_host, hit:  u.attr.hit + 1, updated: (new Date).getTime()}).save();
      
      var nameEl = nik(".page_name").find().get() || nik("#photos_albums_block .ui_crumb").find().get();
      if (nameEl) {
         u.setAttr({user_name: nameEl.innerHTML.substr(0,16)}).save();
      }
      
      var countFotoEl = nik("#profile_photos_module .header_count").find().get() || nik("#photos_all_block .ui_crumb_count").find().get();
      if (countFotoEl) {
         u.setAttr({count_foto: countFotoEl.innerHTML}).save();
      }
      
      
      // list
      
      if (pathl1 == 'search' || pathl1 == 'friends') {
         
         var tic = 0;
         var elHits = {};
         var countReq = 0;
         nik(document).addev('DOMNodeInserted', function (e) {
            
            if ((new Date).getTime() - tic > 10) {
               console.log('check...');
               nik('a.search_item_img_link, .friends_photo').each(function(el) {
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
                     el.style.opacity = "0.2";
                     el.parentNode.appendChild(nik().cr(u.attr.count_foto + ' m:' + (new Date(u.attr.updated).getMonth())));
                  } else {
                     // not found model
                     
                     
                     // fotos
                     if (0) {
                        setTimeout(function(){
                           //console.log(el.href);
                           //return;
                           nik().ajax({url: el.href, funok: function(d){
                              //console.log(el.href, d.match(/\<span class=\"header_count fl_l\"\>.+/));
                              var div = document.createElement('div'); 
                              div.innerHTML = d;
                              var span = nik(div).find("#profile_photos_module .header_count").get();
                              if (!span) {
                                 el.parentNode.appendChild(nik().cr("block?"));
                                 return;
                              }
                              el.parentNode.appendChild(nik().cr(span.innerHTML));
                              //console.log(el, span.innerHTML);
                           }});
                        }, ++countReq * 1000);
                     }
                  }
                  
                  
                  // set events
                  nik(el).addev('click', function (e) {
                     elHits[ prof_host ] = 0;
                     if (e.shiftKey) {
                        var u = ModelData().model.findByAttributes({prof_host: prof_host}) || new ModelData;
                        el.style.opacity = "0.2";
                        u.setAttr({prof_host: prof_host, hit:  u.attr.hit + 1}).save();
                        e.preventDefault();  
                     }
                  });
                  
                  
                  //
                  //console.log(el, prof_host);
               });
            }
            
            
             tic = (new Date).getTime();
         });
         
      }
      
      console.log(ModelData().model.findAll({noPopulate: 1}));
   
  }






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
