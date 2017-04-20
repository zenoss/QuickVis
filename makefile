BUILD = build
TMP = tmp
SRC = src

NODE_MODULES = node_modules
LIVERELOAD = $(NODE_MODULES)/livereload/bin/livereload.js
HTTP = $(NODE_MODULES)/http-server/bin/http-server

SRC_FILES = $(find $(SRC)/quickvis)
DEMO_SRC_FILES = $(find $(SRC)/demo)

# the make tasks you care about are:
# default, watch, serve, clean, live-serve

default: all

# make all the things
all: quickvis demo

quickvis: $(SRC_FILES)
	cd $(SRC)/quickvis && make

demo: $(DEMO_SRC_FILES)
	cd $(SRC)/demo && make

# watch filesystem for changes and rebuild
# various pieces as needed
watch:
	$(MAKE) all
	$(MAKE) watch-all -j

# NOTE - you dont want this one, you just want watch
watch-all: watch-quickvis watch-demo livereload serve

watch-demo:
	cd $(SRC)/demo && make watch

watch-quickvis:
	cd $(SRC)/quickvis && make watch

serve:
	$(HTTP) $(BUILD)

livereload:
	$(LIVERELOAD) $(BUILD) -w 500 -d

live-serve:
	$(MAKE) -j serve livereload

clean:
	rm -rf build/*
	rm -rf tmp/*

.PHONY: serve livereload watch watch-all watch-demo watch-quickvis watch-src clean
