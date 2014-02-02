module PlayerController
  def game_world
    {
    	players: controller_store[:players]
    }
  end

  def get_cat
    controller_store[:players].find {
    	|p| p[:is_cat]
    }
  end

  def get_player
    controller_store[:players].find {|p| p[:id] == connection_store[:id]}
  end
  def get_player_by_id id
    controller_store[:players].find {|p| p[:id] == id}
  end

  def get_all
    trigger_success game_world

    full_message = {:message => connection_store[:id] + ' JOINED the room.', type: :notify}
    log_all full_message
  end

  def new_pos
    p = get_player
    p[:x] = message[:x] if (message[:x])
    p[:y] = message[:y] if (message[:y])
    # sleep 0.1
    WebsocketRails[:game].trigger(:player_moved, p)
    trigger_success
  end
  
  def set_attacking
    p = get_player
    p[:is_attacking] = message[:is_attacking]
    log "attacking changed"
    WebsocketRails[:game].trigger(:player_attacking_changed, p)
  end

  def set_killed
    p = get_player_by_id message[:id]
    log "killed changed"
    p[:killed] = message[:killed]
    WebsocketRails[:game].trigger(:player_killed_changed, p)
  end

end