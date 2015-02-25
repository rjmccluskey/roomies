class CreateCharges < ActiveRecord::Migration
  def change
    create_table :charges do |t|
      t.string :venmo_payment_id
      t.float :amount
      t.string :note
      t.string :status
      t.datetime :date_completed
      t.belongs_to :expense
      t.belongs_to :user

      t.timestamps null: false
    end
  end
end
