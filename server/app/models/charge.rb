class Charge < ActiveRecord::Base
  belongs_to :expense
  belongs_to :user

  validates_presence_of :venmo_payment_id, :amount, :note, :status, :expense_id, :user_id
end
