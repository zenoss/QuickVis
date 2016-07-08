docker_working_DIR = /mnt

UID = $(shell id -u)
GID = $(shell id -g)
PWD = $(shell pwd)

BUILD_VERSION = "v1"

default: build

# build the quickvis lib
build: build-docker npm-install
	docker run --rm \
		-v $(PWD):$(docker_working_DIR) \
		-e UID_X=$(UID) \
		-e GID_X=$(GID) \
		zenoss/quickvis-build:$(BUILD_VERSION) \
		/bin/bash -c "source /root/userdo.sh \"cd $(docker_working_DIR) && gulp dist\""; \

# test the quickvis lib
test: build-docker npm-install
	docker run --rm \
		-v $(PWD):$(docker_working_DIR) \
		-e UID_X=$(UID) \
		-e GID_X=$(GID) \
		zenoss/quickvis-build:$(BUILD_VERSION) \
		/bin/bash -c "source /root/userdo.sh \"cd $(docker_working_DIR) && gulp test\""; \

# build docker image for doing nodejs/npm/gulp stuff
build-docker:
	docker build -t zenoss/quickvis-build:${BUILD_VERSION} .

# install npm packages
npm-install: build-docker
	docker run --rm \
		-v $(PWD):$(docker_working_DIR) \
		-e UID_X=$(UID) \
		-e GID_X=$(GID) \
		zenoss/quickvis-build:$(BUILD_VERSION) \
		/bin/bash -c "source /root/userdo.sh \"cd $(docker_working_DIR) && npm install\""; \

.PHONY: default build npm-install build-docker
