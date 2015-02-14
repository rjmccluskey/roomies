FactoryGirl.define do
  factory :roomie do
    nickname {Faker::Name.first_name}
    first_name {Faker::Name.first_name}
    last_name {Faker::Name.last_name}
    display_name {Faker::Name.name}
    email {Faker::Internet.email}
    phone {Faker::PhoneNumber.cell_phone}
    profile_picture_url {Faker::Avatar.image}
    venmo_id {Faker::Number.number(19)}
  end

end
