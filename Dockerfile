FROM ubuntu:xenial
MAINTAINER Zenoss, Inc <dev@zenoss.com>

# SETUP
# tools needed for setup
RUN apt update -qqy && \
    apt -qqy install curl wget \
    # needed for nodejs install
    apt-transport-https

# add chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list

# add nodejs and npm
#RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
RUN echo 'deb https://deb.nodesource.com/node_6.x xenial main' > /etc/apt/sources.list.d/nodesource.list


# INSTALL
RUN apt update -qqy && \
    apt install -qqy \
    vim build-essential \
    google-chrome-beta \
    python2.7 \
    xvfb \
    nodejs

# global nodejs deps
RUN npm install -g gulp


# CONFIGURE
ADD userdo.sh /root/userdo.sh
