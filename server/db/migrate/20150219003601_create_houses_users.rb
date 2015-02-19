class CreateHousesUsers < ActiveRecord::Migration
  def change
    create_table :houses_users do |t|
      t.belongs_to :house
      t.belongs_to :user

      t.timestamps null: false
    end
  end
end
