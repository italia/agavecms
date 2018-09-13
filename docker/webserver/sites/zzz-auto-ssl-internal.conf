# Internal server running on port 8999 for handling certificate tasks.
server {
  listen 127.0.0.1:8999;

  # Increase the body buffer size, to ensure the internal POSTs can always
  # parse the full POST contents into memory.
  client_body_buffer_size 128k;
  client_max_body_size 128k;

  location / {
    content_by_lua_block {
      auto_ssl:hook_server()
    }
  }
}
