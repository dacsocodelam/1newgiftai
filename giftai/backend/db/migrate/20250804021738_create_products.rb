class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string :name
      t.text :description
      t.integer :price
      t.string :url
      t.string :category

      t.timestamps
    end
  end
end
