require 'rails_helper'

RSpec.describe User, :type => :model do
  it {should have_db_column :nickname}
  it {should have_db_column :first_name}
  it {should have_db_column :last_name}
  it {should have_db_column :display_name}
  it {should have_db_column :email}
  it {should have_db_column :phone}
  it {should have_db_column :profile_picture_url}
  it {should have_db_column :venmo_id}
  it {should have_db_column :access_token}
  it {should have_db_column :refresh_token}

  it {should validate_presence_of :first_name}
  it {should validate_presence_of :last_name}
  it {should validate_presence_of :display_name}
  it {should validate_presence_of :email}
  it {should validate_presence_of :phone}
  it {should validate_presence_of :profile_picture_url}
  it {should validate_presence_of :venmo_id}
  it {should validate_presence_of :access_token}
  it {should validate_presence_of :refresh_token}

  it {should validate_uniqueness_of(:email).case_insensitive}
  it {should validate_uniqueness_of(:venmo_id).case_insensitive}

  it {should ensure_length_of(:nickname).is_at_most(20)}
end
