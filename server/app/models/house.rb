class House < ActiveRecord::Base
  has_secure_password

  validates_presence_of :name, :password_digest
  validates_uniqueness_of :name
  validates_length_of :name, in: 3..20
  validates_length_of :password, in: 8..20
end
