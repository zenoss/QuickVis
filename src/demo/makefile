ROOT = ../..
BUILD = $(ROOT)/build
GRACKLE = $(BUILD)/quickvis.js
APP_JS = $(BUILD)/app.js
APP_CSS = $(BUILD)/app.css
APP_SRC = $(shell find -name "*.js")

NODE_MODULES = $(ROOT)/node_modules
CHOKIDAR = $(NODE_MODULES)/chokidar-cli/index.js
ROLLUP = $(NODE_MODULES)/rollup/bin/rollup

default: $(GRACKLE) html $(APP_JS) $(APP_CSS)

html: $(BUILD)/index.html

# expect quickvis to already be build and in build dir
$(GRACKLE):
	$(error quickvis.js is not built)

# copy html files over
$(BUILD)/index.html: index.html
	mkdir -p $(@D)
	cp index.html $@

$(APP_JS): $(APP_SRC)
	mkdir -p $(@D)
	ENTRY=app.js DEST=$(APP_JS) $(ROLLUP) -c rollup.config.js

$(APP_CSS): app.css
	mkdir -p $(@D)
	cp app.css $(BUILD)/app.css

# watch filesystem for changes and rebuild
# various pieces as needed
watch:
	$(MAKE) default
	$(MAKE) watch-all -j

# NOTE - you dont want this one, you just want watch
watch-all: watch-js watch-css watch-html

watch-html:
	$(CHOKIDAR) **/*.html -c "make $(INDEX)"

watch-js:
	$(CHOKIDAR) **/*.js -c "make $(APP_JS)"

watch-css:
	$(CHOKIDAR) **/*.css -c "make $(APP_CSS)"

.PHONY: watch watch-all watch-html watch-js watch-css
