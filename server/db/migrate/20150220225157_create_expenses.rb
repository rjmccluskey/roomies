class CreateExpenses < ActiveRecord::Migration
  def change
    create_table :expenses do |t|
      t.string :venmo_id
      t.string :note
      t.float :amount
      t.datetime :date_completed
      t.belongs_to :user

      t.timestamps null: false
    end
  end
end
