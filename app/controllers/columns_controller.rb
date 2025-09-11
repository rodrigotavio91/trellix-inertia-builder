class ColumnsController < ApplicationController
  def create
    column = Column.create!(params.permit(:name, :board_id))

    redirect_to column.board
  end

  def update
    column = Column.find(params.require(:id))

    column.update!(params.permit(:name))

    redirect_to column.board
  end
end
