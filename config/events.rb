WebsocketRails::EventMap.describe do
  # You can use this file to map incoming events to controller actions.
  # One event can be mapped to any number of controller actions. The
  # actions will be executed in the order they were subscribed.
  #
  # Uncomment and edit the next line to handle the client connected event:
  subscribe :client_connected, to: GameController, with_method: :client_connected
  subscribe :client_disconnected, to: GameController, with_method: :client_disconnected
  namespace :session do
    subscribe :ping, :to => GameController, with_method: :ping
    subscribe :get_id, :to => GameController, with_method: :get_id
  end

  namespace :chat do
    subscribe :msg, :to => GameController, with_method: :msg
    subscribe :set_name, :to => GameController, with_method: :set_name
  end
  
  namespace :player do
    subscribe :new_pos, :to => GameController, with_method: :new_pos
    subscribe :get_all, :to => GameController, with_method: :get_all
    subscribe :set_attacking, :to => GameController, with_method: :set_attacking
  end
end
