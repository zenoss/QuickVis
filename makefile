BUILD = build
TMP = tmp
SRC = src

NODE_MODULES = node_modules
LIVERELOAD = $(NODE_MODULES)/livereload/bin/livereload.js
HTTP = $(NODE_MODULES)/http-server/bin/http-server

SRC_FILES = $(find $(SRC)/quickvis)
DEMO_SRC_FILES = $(find $(SRC)/demo)

default: all

# make all the things
all: quickvis demo

ifeq ($(USE_DOCKER),true)
release:
	$(MAKE) docker-release
else
release:
	cd $(SRC)/quickvis && make release
endif

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
	rm -rf dist/*

######################################################
# DOCKER BUILD STUFF
# for yall crusty folks dont want nodejs on your system
######################################################
docker_working_DIR = /mnt

UID = $(shell id -u)
GID = $(shell id -g)
PWD = $(shell pwd)

IMAGENAME = build-tools
# NOTE - this is not the quickvis lib version!
BUILD_TOOLS_VERSION = 0.0.9-dev
TAG = zenoss/$(IMAGENAME):$(BUILD_TOOLS_VERSION)

docker-release: yarn-install
	docker run --rm \
		-v $(PWD):$(docker_working_DIR) \
		-e UID_X=$(UID) \
		-e GID_X=$(GID) \
		$(TAG) \
		/bin/bash -c "source /root/userdo.sh \"cd $(docker_working_DIR) && cd $(SRC)/quickvis && make release\"";

# install npm packages
yarn-install:
	docker run --rm \
		-v $(PWD):$(docker_working_DIR) \
		-e UID_X=$(UID) \
		-e GID_X=$(GID) \
		$(TAG) \
		/bin/bash -c "source /root/userdo.sh \"cd $(docker_working_DIR) && yarn install\"";

.PHONY: serve livereload watch watch-all watch-demo watch-quickvis watch-src clean
