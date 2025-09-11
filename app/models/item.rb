class Item < ApplicationRecord
  belongs_to :board
  belongs_to :column
end
