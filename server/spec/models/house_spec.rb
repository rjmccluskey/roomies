require 'rails_helper'

RSpec.describe House, :type => :model do
  it {should have_db_column :name}
  it {should have_db_column :password_digest}

  it {should validate_presence_of :name}
  it {should validate_presence_of :password_digest}

  it {should validate_uniqueness_of :name}

  it {should ensure_length_of(:name).is_at_least(3).is_at_most(20)}
  it {should ensure_length_of(:password).is_at_least(8).is_at_most(20)}

  it {should have_secure_password }

  it {should have_and_belong_to_many :users}
  it {should have_many :expenses}
end
