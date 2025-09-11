class BoardsController < ApplicationController
  def show
    @board = Board.find(params.require(:id))
  end

  def create
    board = Board.create!(params.permit(:name, :color).merge(user: Current.user))

    redirect_to board
  end

  def destroy
    Board.find(params.require(:id)).destroy!

    redirect_to home_index_path
  end
end
