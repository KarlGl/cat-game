class ChatController < WebsocketRails::BaseController
  def initialize_session
    # connection_store is state that lasts the duration of the web socket connection.
    # controller_store is state that lasts duration of the server.
    log "Session init"
    controller_store[:players] = []
  end

  def game_world
    {players: controller_store[:players]}
  end

  def get_cat
    controller_store[:players].find {|p| p[:is_cat]}
  end

  def get_name
    (get_player && get_player[:name]) || connection_store[:id]
  end

  def log msg
    logger.debug "\n<Logger>:"
    logger.debug msg
  end

  def log_all msg
    log msg
    WebsocketRails[:game].trigger(:logging, msg)
  end

  def get_player
    controller_store[:players].find {|p| p[:id] == connection_store[:id]}
  end

  def client_connected
    connection_store[:id] = client_id
    player = {
      id: client_id,
      is_cat: get_cat ? false : true
    }
    controller_store[:players].push(player)
    WebsocketRails[:game].trigger(:player_joined, player)
  end

  def get_id
    trigger_success connection_store[:id]
  end

  def get_all
    trigger_success game_world

    full_message = {:message => connection_store[:id] + ' JOINED the room.', type: :notify}
    log_all full_message
  end

  def client_disconnected
    player = get_player
    controller_store[:players].delete player
    log controller_store[:players]
    full_message = {:message => connection_store[:id] + ' LEFT the room.', type: :notify}
    log_all full_message
    WebsocketRails[:game].trigger(:player_left, player[:id])
  end

  def msg
  	name = get_name
    log message.inspect
  	text = (message && message[:msg]) || "something"
    new_message = {:message => name + ' said: ' + text, type: :chat}
		log_all new_message
  end

  def new_pos
    p = get_player
    p[:x] = message[:x] if (message[:x])
    p[:y] = message[:y] if (message[:y])
    WebsocketRails[:game].trigger(:player_moved, p)
    trigger_success
  end
  def set_name
    p = get_player
    old = get_name
    p[:name] = message[:name] if (message[:name])
    WebsocketRails[:game].trigger(:player_name_changed, p)
    new_message = {:message => old + " is now called " + get_name, type: :notify}
    log_all new_message
  end
  def set_attacking
    p = get_player
    p[:is_attacking] = message[:is_attacking]
    log "attacking changed"
    WebsocketRails[:game].trigger(:player_attacking_changed, p)
  end
end