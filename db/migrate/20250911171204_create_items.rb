class CreateItems < ActiveRecord::Migration[8.0]
  def change
    create_table :items do |t|
      t.references :board, null: false, foreign_key: true
      t.references :column, null: false, foreign_key: true
      t.string :title, null: false
      t.string :content
      t.float :order, null: false, default: 0.0

      t.timestamps
    end
  end
end
