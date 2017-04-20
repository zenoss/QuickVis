ROOT = ../..
BUILD = $(ROOT)/build
SCRIPTS = $(ROOT)/scripts
TMP = $(ROOT)/tmp
BUILD_LIBS = $(BUILD)/libs
NODE_MODULES=$(ROOT)/node_modules

QUICKVIS = $(BUILD)/quickvis.js
QUICKVIS_SRC = $(shell find . -name "*.js")
CSS = $(BUILD)/quickvis.css.js
SASS_SRC = $(shell find . -name "*.scss")

SASS = $(NODE_MODULES)/node-sass/bin/node-sass
CHOKIDAR = $(NODE_MODULES)/chokidar-cli/index.js
ROLLUP = $(NODE_MODULES)/rollup/bin/rollup

default: dev

# build quickvis, but exclude 3rd party libs, and instead
# copy those libs to the build dir
dev: build-js build-css

# TODO - bundled distributable with all deps

build-js: $(QUICKVIS)
build-css: $(CSS)

#d3: $(BUILD_LIBS)/d3.js

$(QUICKVIS): $(QUICKVIS_SRC)
	mkdir -p $(@D)
	ENTRY=quickvis.js DEST=$(QUICKVIS) $(ROLLUP) -c rollup.config.js

css-preprocess: $(SASS_SRC)
	mkdir -p $(@D)
	$(SASS) -o $(TMP) .

$(CSS): css-preprocess
	mkdir -p $(@D)
	$(SCRIPTS)/csstojs.sh $(CSS) $(shell find $(TMP) -name "*.css")

# fontawesome deps
$(BUILD_LIBS)/font-awesome/%:
	mkdir -p $(@D)
	cp -r $(NODE_MODULES)/font-awesome/$* $@

# d3
#$(BUILD_LIBS)/d3.js:
#	mkdir -p $(@D)
#   cp $(NODE_MODULES)/d3/build/d3.js $@

# watch filesystem for changes and rebuild
# various pieces as needed
watch:
	$(MAKE) dev
	$(MAKE) watch-all -j

# NOTE - you dont want this one, you just want watch
watch-all: watch-js watch-css

watch-js:
	$(CHOKIDAR) $(QUICKVIS_SRC) -c "make build-js"

watch-css:
	$(CHOKIDAR) $(SASS_SRC) -c "make build-css"

.PHONY: watch watch-all watch-js watch-css
