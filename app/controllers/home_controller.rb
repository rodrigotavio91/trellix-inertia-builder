class HomeController < ApplicationController
  def index
    @boards = Board.where(user: Current.user)
  end
end
