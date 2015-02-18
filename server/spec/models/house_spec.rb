require 'rails_helper'

RSpec.describe House, :type => :model do
  it {should have_db_column :name}
  it {should have_db_column :password_digest}
  it {should have_secure_password }
end
