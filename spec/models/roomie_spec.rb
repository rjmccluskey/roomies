require 'rails_helper'

RSpec.describe Roomie, :type => :model do
  it {should have_db_column(:nickname)}
  it {should have_db_column(:first_name)}
  it {should have_db_column(:last_name)}
  it {should have_db_column(:display_name)}
  it {should have_db_column(:email)}
  it {should have_db_column(:phone)}
  it {should have_db_column(:profile_picture_url)}
  it {should have_db_column(:venmo_id)}
end
