docker_working_DIR = /mnt

UID = $(shell id -u)
GID = $(shell id -g)
PWD = $(shell pwd)

IMAGENAME = build-tools
VERSION = 0.0.2
TAG = zenoss/$(IMAGENAME):$(VERSION)

default: build

# build the quickvis lib
build: npm-install
	docker run --rm \
		-v $(PWD):$(docker_working_DIR) \
		-e UID_X=$(UID) \
		-e GID_X=$(GID) \
		$(TAG) \
		/bin/bash -c "source /root/userdo.sh \"cd $(docker_working_DIR) && gulp build\"";

# test the quickvis lib
test: npm-install
	docker run --rm \
		-v $(PWD):$(docker_working_DIR) \
		-e UID_X=$(UID) \
		-e GID_X=$(GID) \
		$(TAG) \
		/bin/bash -c "source /root/userdo.sh \"cd $(docker_working_DIR) && gulp test\"";

# build, zip, test quickvis lib
release: npm-install
	docker run --rm \
		-v $(PWD):$(docker_working_DIR) \
		-e UID_X=$(UID) \
		-e GID_X=$(GID) \
		$(TAG) \
		/bin/bash -c "source /root/userdo.sh \"cd $(docker_working_DIR) && gulp release\"";

# install npm packages
npm-install:
	docker run --rm \
		-v $(PWD):$(docker_working_DIR) \
		-e UID_X=$(UID) \
		-e GID_X=$(GID) \
		$(TAG) \
		/bin/bash -c "source /root/userdo.sh \"cd $(docker_working_DIR) && npm install\"";

# verify distributable js lib is up to date
verify: npm-install
	docker run --rm \
		-v $(PWD):$(docker_working_DIR) \
		-e UID_X=$(UID) \
		-e GID_X=$(GID) \
		$(TAG) \
		/bin/bash -c "source /root/userdo.sh \"cd $(docker_working_DIR) && gulp verify\"";

.PHONY: default build test release npm-install verify
