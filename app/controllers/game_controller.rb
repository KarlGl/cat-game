require './lib/chat_controller'
require './lib/session_controller'
require './lib/player_controller'

class GameController < WebsocketRails::BaseController
  include ChatController
  include SessionController
  include PlayerController
  
  def log msg
    logger.debug "\n<Logger>:"
    logger.debug msg
  end
  
end