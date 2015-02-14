class User < ActiveRecord::Base
  validates_presence_of :nickname, :first_name, :last_name, :display_name, :email, :phone, :profile_picture_url, :venmo_id
  validates_uniqueness_of :email, :venmo_id, case_sensitive: false
  validates_length_of :nickname, in: 2..20
end
