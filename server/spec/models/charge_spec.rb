require 'rails_helper'

RSpec.describe Charge, :type => :model do
  it {should have_db_column :venmo_payment_id}
  it {should have_db_column :amount}
  it {should have_db_column :note}
  it {should have_db_column :status}
  it {should have_db_column :date_completed}
  it {should have_db_column :expense_id}
  it {should have_db_column :user_id}

  it {should validate_presence_of :venmo_payment_id}
  it {should validate_presence_of :amount}
  it {should validate_presence_of :note}
  it {should validate_presence_of :status}
  it {should validate_presence_of :expense_id}
  it {should validate_presence_of :user_id}

  it {should belong_to :expense}
  it {should belong_to :user}
end
