FROM ruby:2.5.1

MAINTAINER Joe Yates "j.yates@cantierecreativo.net"

ARG NODE_ENV
ARG RAILS_ENV

RUN \
  # Allow https repos
  apt-get update -qq \
  && apt-get install apt-transport-https \
  # Set up Node.js repo
  && curl -sS https://deb.nodesource.com/gpgkey/nodesource.gpg.key \
  | apt-key add - 1>/dev/null 2>&1 \
  && echo "deb https://deb.nodesource.com/node_8.x stretch main" \
  > /etc/apt/sources.list.d/nodesource.list \
  # Set up Yarn repo
  && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg \
  | apt-key add - 1>/dev/null 2>&1 \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" \
  > /etc/apt/sources.list.d/yarn.list \
  && apt-get update -qq \
  && apt-get install \
    --assume-yes \
    apt-utils \
    build-essential \
    git \
    graphviz \
    libpq-dev \
    libgraphviz-dev \
    locales \
    nodejs \
    postgresql-client-9.6 \
    yarn \
    sshpass \
    rsync \
    lftp \
    2>/dev/null \
  && apt-get clean --assume-yes \
  && apt-get autoremove --assume-yes \
  && rm -rf /var/lib/apt/lists/* \
  && rm -rf /usr/share/doc \
  && rm -rf /usr/share/man \
  && rm -rf /var/cache \
  && rm -rf /usr/doc \
  && rm -rf /usr/local/share/doc \
  && rm -rf /usr/local/share/man \
  && rm -rf /tmp/* \
  && rm -rf /var/tmp/*

RUN \
  echo "en_US.UTF-8 UTF-8" > /etc/locale.gen \
  && locale-gen

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN mkdir /app
WORKDIR /app

RUN gem install bundler --version="1.16.4"

# Before copying the whole app, first we copy just the gems -
# this way we avoid re-bundling every time other files change in the project.
COPY Gemfile Gemfile.lock ./
RUN bundle install --jobs 4

COPY package.json yarn.lock ./
RUN \
  NODE_ENV=development yarn install \
  && rm -rf /usr/local/share/.cache

COPY . .
COPY docker/app/start .

# Mark the image with the latest Git commit SHA
RUN cat .git/`cat .git/HEAD | cut -f 2 -d ' '` > APP_VERSION

RUN yarn build:webfonts

EXPOSE 3000
EXPOSE 3001
