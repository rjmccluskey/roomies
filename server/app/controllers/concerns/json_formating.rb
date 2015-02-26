module JSONFormating
  extend ActiveSupport::Concern

  def user_json_response
    {
      user: {
        id: @user.id,
        nickname: @user.nickname,
        first_name: @user.first_name,
        last_name: @user.last_name,
        display_name: @user.display_name,
        email: @user.email,
        phone: @user.phone,
        profile_picture_url: @user.profile_picture_url,
        venmo_id: @user.venmo_id,
        houses: user_houses_to_json
      }
    }
  end

  private

  def user_houses_to_json
    @user.houses.map do |house|
      {
        id: house.id,
        name: house.name
      }
    end
  end
end