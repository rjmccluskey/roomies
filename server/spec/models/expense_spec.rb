require 'rails_helper'

RSpec.describe Expense, :type => :model do
  it {should have_db_column :note}
  it {should have_db_column :amount}
  it {should have_db_column :user_id}
  it {should have_db_column :house_id}

  it {should validate_presence_of :note}
  it {should validate_presence_of :amount_string}
  it {should validate_presence_of :user_id}
  it {should validate_presence_of :house_id}

  it {should ensure_length_of(:note).is_at_least(1).is_at_most(140)}

  it {should belong_to :user}
  it {should belong_to :house}
  it {should have_many :charges}
end
