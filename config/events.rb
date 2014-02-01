WebsocketRails::EventMap.describe do
  # You can use this file to map incoming events to controller actions.
  # One event can be mapped to any number of controller actions. The
  # actions will be executed in the order they were subscribed.
  #
  # Uncomment and edit the next line to handle the client connected event:
  subscribe :client_connected, to: ChatController, with_method: :client_connected
  subscribe :client_disconnected, to: ChatController, with_method: :client_disconnected
  namespace :chat do
    subscribe :connect, :to => ChatController, :with_method => :connect
    subscribe :msg, :to => ChatController, :with_method => :msg
    subscribe :new_pos, :to => ChatController, :with_method => :new_pos
    subscribe :get_id, :to => ChatController, :with_method => :get_id
    subscribe :get_all, :to => ChatController, :with_method => :get_all
    subscribe :set_name, :to => ChatController, :with_method => :set_name
    subscribe :set_attacking, :to => ChatController, :with_method => :set_attacking
  end
  #
  # Here is an example of mapping namespaced events:
  #   namespace :product do
  #     subscribe :new, :to => ProductController, :with_method => :new_product
  #   end
  # The above will handle an event triggered on the client like `product.new`.
end
