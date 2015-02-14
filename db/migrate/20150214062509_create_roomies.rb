class CreateRoomies < ActiveRecord::Migration
  def change
    create_table :roomies do |t|

      t.timestamps null: false
    end
  end
end
