module SessionController
  def initialize_session
    # connection_store is state that lasts the duration of the web socket connection.
    # controller_store is state that lasts duration of the server.
    log "new session init"
    controller_store[:players] = []
  end

  def client_disconnected
    player = get_player
    controller_store[:players].delete player
    log controller_store[:players]
    full_message = {:message => connection_store[:id] + ' LEFT the room.', type: :notify}
    log_all full_message
    WebsocketRails[:game].trigger(:player_left, player[:id])
  end

  def ping
    trigger_success
  end

  def get_id
    trigger_success connection_store[:id]
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

end