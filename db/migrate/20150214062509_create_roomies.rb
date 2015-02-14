class CreateRoomies < ActiveRecord::Migration
  def change
    create_table :roomies do |t|
      t.string :nickname
      t.string :first_name
      t.string :last_name
      t.string :display_name
      t.string :email
      t.string :phone
      t.string :profile_picture_url
      t.string :venmo_id

      t.timestamps null: false
    end
  end
end
