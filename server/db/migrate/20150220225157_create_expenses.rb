class CreateExpenses < ActiveRecord::Migration
  def change
    create_table :expenses do |t|
      t.string :note
      t.float :amount
      t.belongs_to :user
      t.belongs_to :house

      t.timestamps null: false
    end
  end
end
