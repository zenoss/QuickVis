ROOT = ../..
BUILD = $(ROOT)/build
SCRIPTS = $(ROOT)/scripts
TMP = $(ROOT)/tmp
NODE_MODULES=$(ROOT)/node_modules

QUICKVIS = $(BUILD)/quickvis.js
QUICKVIS_SRC = $(shell find . -name "*.js")
CSS = $(BUILD)/quickvis.css.js
SASS_SRC = $(shell find . -name "*.scss")

SASS = $(NODE_MODULES)/node-sass/bin/node-sass
CHOKIDAR = $(NODE_MODULES)/chokidar-cli/index.js
ROLLUP = $(NODE_MODULES)/rollup/bin/rollup

VERSION = $(shell cat $(ROOT)/VERSION)
DIST = $(ROOT)/dist
QUICKVIS_RELEASED = $(DIST)/quickvis-$(VERSION).js

default: dev

dev: build-js build-css

release: build-js build-css $(QUICKVIS_RELEASED)

$(QUICKVIS_RELEASED):
	mkdir -p $(@D)
	# NOTE - combines js and css
	cat $(CSS) $(QUICKVIS) > $@

build-js: $(QUICKVIS)
build-css: $(CSS)

$(QUICKVIS): $(QUICKVIS_SRC)
	mkdir -p $(@D)
	ENTRY=quickvis.js DEST=$(QUICKVIS) $(ROLLUP) -c rollup.config.js

css-preprocess: $(SASS_SRC)
	mkdir -p $(@D)
	$(SASS) -o $(TMP) .

$(CSS): css-preprocess
	mkdir -p $(@D)
	$(SCRIPTS)/csstojs.sh $(CSS) $(shell find $(TMP) -name "*.css")

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
