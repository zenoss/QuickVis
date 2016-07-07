docker_working_DIR = /mnt

UID = $(shell id -u)
GID = $(shell id -g)
PWD = $(shell pwd)

BUILD_VERSION = "v1"

default: build-js

build-docker:
	docker build -t zenoss/quickvis-build:${BUILD_VERSION} .

npm-install: build-docker
	docker run --rm \
		-v $(PWD):$(docker_working_DIR) \
		-e UID_X=$(UID) \
		-e GID_X=$(GID) \
		zenoss/quickvis-build:$(BUILD_VERSION) \
		/bin/bash -c "source /root/userdo.sh \"cd $(docker_working_DIR) && npm install\""; \

build-js: build-docker npm-install
	docker run --rm \
		-v $(PWD):$(docker_working_DIR) \
		-e UID_X=$(UID) \
		-e GID_X=$(GID) \
		zenoss/quickvis-build:$(BUILD_VERSION) \
		/bin/bash -c "source /root/userdo.sh \"cd $(docker_working_DIR) && gulp release\""; \

test: build-docker npm-install
	docker run --rm \
		-v $(PWD):$(docker_working_DIR) \
		-e UID_X=$(UID) \
		-e GID_X=$(GID) \
		zenoss/quickvis-build:$(BUILD_VERSION) \
		/bin/bash -c "source /root/userdo.sh \"cd $(docker_working_DIR) && gulp test\""; \

.PHONY: default build npm-install build-docker
