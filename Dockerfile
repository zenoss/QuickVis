FROM zenoss/centos-base:latest
MAINTAINER Zenoss, Inc <dev@zenoss.com>

# add chrome
RUN printf '[google-chrome]\n\
name=google-chrome - \$basearch\n\
baseurl=http://dl.google.com/linux/chrome/rpm/stable/\$basearch\n\
enabled=1\n\
gpgcheck=1\n\
gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub\n'\
>> /etc/yum.repos.d/google-chrome.repo

# add nodejs and npm
RUN curl -sL https://rpm.nodesource.com/setup_6.x | bash -


# INSTALL
RUN yum update -y && \
    yum install -y \
    google-chrome-beta \
    xorg-x11-server-Xvfb \
    gcc-c++ \
    nodejs

# global nodejs deps
RUN npm install -g gulp


# CONFIGURE
ADD userdo.sh /root/userdo.sh
