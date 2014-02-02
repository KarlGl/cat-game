module ChatController
  # msg to all chatboxes for players
  def log_all msg
    log msg
    WebsocketRails[:game].trigger(:logging, msg)
  end
  def get_name
    (get_player && get_player[:name]) || connection_store[:id]
  end
  def set_name
    p = get_player
    old = get_name
    p[:name] = message[:name] if (message[:name])
    WebsocketRails[:game].trigger(:player_name_changed, p)
    new_message = {:message => old + " is now called " + get_name, type: :notify}
    log_all new_message
  end
   def msg
    name = get_name
    log message.inspect
    text = (message && message[:msg]) || "something"
    new_message = {:message => name + ' said: ' + text, type: :chat}
    log_all new_message
  end
end