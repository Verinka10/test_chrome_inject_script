


#all:	builds/debug/$(JSS)
#	cp $(JSS)  builds/debug


#background.js:	builds/debug/background.js


#dest_dir=builds/debug

find=c:\env\msys\bin\find.exe
#find=find
dir_guard = @mkdir -p $(@D)

#JS_TARGETS = $(shell $(find) $(root_dir) -type f -name '*.js' ! \( -path '*local*' -or -path '*builds*'  -or -path '*test*' \))
#JS_TARGETS = js/common.js js/managerRule.js js/models/DeclarativeRuleModel.js js/lib/dom/nik.js js/lib/faces/face.js js/lib/ModelStore/Model.js js/lib/vendors/sjcl.js\
#		js/lib/Test/Test.js js/otherManagers.js  background.js test.js config.js content_idle.js content_start.js options.js popup.js common_ui.js
JS_TARGETS =  $(shell $(find) js -type f) background.js test.js config.js content_idle.js content_start.js options.js popup.js common_ui.js
#OTHER_TARGETS = manifest.json js/lib/faces/face.css options.html popup.html $(shell $(find) css/images -type f -name '*.png') $(shell $(find) _locales -type f) $(shell $(find) update -type f)
OTHER_TARGETS = manifest.json js/lib/faces/face.css options.html popup.html $(shell $(find) css -type f) $(shell $(find) _locales -type f) $(shell $(find) update -type f)
	
JS_TO_DEBUG = $(addprefix builds/debug/, $(JS_TARGETS))
OTHER_TO_DEBUG = $(addprefix builds/debug/, $(OTHER_TARGETS))

JS_TO_RELEASE = $(addprefix builds/release/, $(JS_TARGETS))
OTHER_TO_RELEASE = $(addprefix builds/release/, $(OTHER_TARGETS))

#JS_COMP = java -jar ./local/utils/compiler-latest/compiler.jar --charset UTF-8 --jscomp_off internetExplorerChecks
JS_COMP = java -jar /media/nik/L_media/books/sdk/js/google/closure-compiler/build_old/compiler-latest/compiler.jar --charset UTF-8 --jscomp_off internetExplorerChecks

all:	debug release $(OTHER_TO_DEBUG)

debug:  $(JS_TO_DEBUG)

release: $(JS_TO_RELEASE) $(OTHER_TO_RELEASE)

# if all js in file
#core.js:	$(JS_TO_RELEASE)
#	cat $+ > $@
	
builds/debug/%.js:	./%.js
	$(dir_guard)
	cp $< $@ 

builds/debug/%:	./%
	$(dir_guard)
	cp $< $@ 

### release

#builds/release/%.js:	./%.js
#	$(dir_guard)
#	$(JS_COMP) --js_output_file $@ $<

#builds/release/%:	./%
#	$(dir_guard)
#	cp $< $@

builds/release/%:	./%
	$(dir_guard)
	cp $< $@


pack:
	#c:/actions/internet/Chromium/chrome.exe  --pack-extension=$(shell echo `pwd`)/builds/release --pack-extension-key=$(shell echo `pwd`)/scriptout.pem
	c:/actions/internet/Chromium/chrome.exe  --pack-extension=$(shell echo `pwd`)/builds/release
	mv builds/release.* builds/release_pack




lib:	libjs_dest libcss_dest

libjs_dest:	js/lib/faces/face.js js/lib/dom/nik.js js/lib/ModelStore/Model.js js/lib/Test/Test.js
libcss_dest:	js/lib/faces/face.css js/lib/faces/sea/style.css js/lib/faces/images/icon_close-black.png


js/lib/dom/nik.js:	../mlibjs/dom/nik.js
	cp $< $@

js/lib/faces/face.js:	../mlibjs/faces/face.js
	cp $< $@

js/lib/ModelStore/Model.js:	../mlibjs/ModelStore/Model.js
	cp $< $@

js/lib/Test/Test.js:	../mlibjs/Test/Test.js
	cp $< $@

js/lib/faces/face.css:	../mlibjs/faces/face.css
	cp $< $@

js/lib/faces/sea/style.css:	../mlibjs/faces/sea/style.css
	cp $< $@

js/lib/faces/images/icon_close-black.png:	../mlibjs/faces/images/icon_close-black.png
	cp $< $@
#$(shell $(find) css/images -type f -name '*.png')

