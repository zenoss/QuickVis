ROOT = ../..
BUILD = $(ROOT)/build
SCRIPTS = $(ROOT)/scripts
TMP = $(ROOT)/tmp
NODE_MODULES=$(ROOT)/node_modules

QUICKVIS = $(BUILD)/quickvis.js
QUICKVIS_SRC = $(shell find . -name "*.js" ! -name "*.spec.js")
CSS = $(BUILD)/quickvis.css.js
SASS_SRC = $(shell find . -name "*.scss")

SASS = $(NODE_MODULES)/node-sass/bin/node-sass
CHOKIDAR = $(NODE_MODULES)/chokidar-cli/index.js
ROLLUP = $(NODE_MODULES)/rollup/bin/rollup
ZIP = $(NODE_MODULES)/cross-zip-cli/zip.js
ESLINT = $(NODE_MODULES)/.bin/eslint

VERSION = $(shell cat $(ROOT)/VERSION)
QUICKVIS_VERSION_NAME = quickvis-$(VERSION)
DIST = $(ROOT)/dist
QUICKVIS_RELEASED = $(DIST)/$(QUICKVIS_VERSION_NAME).js

# whether or not to transpile js
TRANSPILE=

default: dev

dev: build-js build-css

release: TRANSPILE=true
release: package

$(QUICKVIS_RELEASED): build-js build-css
	mkdir -p $(@D)
	cat $(CSS) $(QUICKVIS) > $@

package: $(QUICKVIS_RELEASED)
	mkdir -p $(DIST)/$(QUICKVIS_VERSION_NAME)
	cp $(QUICKVIS_RELEASED) $(DIST)/$(QUICKVIS_VERSION_NAME)
	$(ZIP) $(DIST)/$(QUICKVIS_VERSION_NAME) $(QUICKVIS_VERSION_NAME).zip
	rm -rf $(DIST)/$(QUICKVIS_VERSION_NAME)

build-js: lint-js $(QUICKVIS)
build-css: $(CSS)

lint-js: $(QUICKVIS_SRC)
	$(ESLINT) $(QUICKVIS_SRC)

$(QUICKVIS): $(QUICKVIS_SRC)
	mkdir -p $(@D)
	ENTRY=quickvis.js DEST=$(QUICKVIS) TRANSPILE=$(TRANSPILE) $(ROLLUP) -c rollup.config.js

css-preprocess: $(SASS_SRC)
	mkdir -p $(@D)
	$(SASS) --output-style compressed -o $(TMP) .

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

print-%  : ; @echo $* = $($*)

.PHONY: watch watch-all watch-js watch-css
