class User < ActiveRecord::Base
  has_and_belongs_to_many :houses
  has_many :expenses
  has_many :charges

  validates_presence_of :first_name, :last_name, :display_name, :email, :phone, :profile_picture_url, :venmo_id, :access_token, :refresh_token

  validates_uniqueness_of :email, :venmo_id, case_sensitive: false
  validates_length_of :nickname, maximum: 20
end
