FROM openresty/openresty:xenial

RUN \
  apt-get install apt-transport-https \
  && apt-get update --quiet=2 \
  && apt-get install --assume-yes software-properties-common \
  && add-apt-repository ppa:brightbox/ruby-ng \
  && apt-get update --quiet=2 \
  && apt-get install --assume-yes build-essential \
  && apt-get install --assume-yes ruby2.5

# Set our working directory inside the image
WORKDIR /webserver

# create sites-enabled and conf.d directory
RUN mkdir -p /usr/local/openresty/nginx/conf/conf.d
RUN mkdir -p /usr/local/openresty/nginx/conf/sites-enabled

# create logs
RUN mkdir /var/log/nginx/
RUN touch /var/log/nginx/error.log
RUN touch /var/log/nginx/access.log

# Copy Nginx config template
COPY nginx.conf /usr/local/openresty/nginx/conf
COPY conf.d/* /usr/local/openresty/nginx/conf/conf.d/
COPY sites/* /usr/local/openresty/nginx/conf/sites-enabled/

RUN /usr/local/openresty/luajit/bin/luarocks install lua-resty-auto-ssl

RUN echo "upstream app_upstream { server app:3000; }" \
  > /usr/local/openresty/nginx/conf/sites-enabled/app_upstream.conf

RUN echo "upstream images_upstream { server images:39876; }" \
  > /usr/local/openresty/nginx/conf/sites-enabled/images_upstream.conf

COPY app.conf .
COPY images.conf .
COPY static_servers.conf .
COPY create_static_servers.rb .
COPY setup /setup

ENTRYPOINT ["/setup"]
CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]
