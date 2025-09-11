class ItemsController < ApplicationController
  def create
    item = Item.create!(params.permit(:title, :board_id, :column_id, :order))

    redirect_to item.board
  end

  def update
    item = Item.find(params.require(:id))

    item.update!(params.permit(:title, :column_id, :order))

    redirect_to item.board
  end

  def destroy
    item = Item.find(params.require(:id))
    board = item.board

    item.destroy!

    redirect_to board
  end
end
