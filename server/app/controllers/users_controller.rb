class UsersController < ApplicationController
  before_filter :cors_set_access_control_headers

  def create
    venmo = Venmo::Oauth.new(permit_params[:code])
    venmo_info = venmo.oauth
    user_info = venmo_info["user"]
    user = User.find_by(venmo_id: user_info["id"])

    if user
      user.update_attributes(access_token: venmo_info["access_token"], refresh_token: venmo_info["refresh_token"])
    else
      user = User.new

      # rename "id" to "venmo_id" so that it doesn't conflict with User
      user_info["venmo_id"] = user_info["id"]
      user_info.delete("id")

      add_attributes(user,venmo_info)
      add_attributes(user,user_info)
      user.save
    end

    render json: {venmo_id: user.venmo_id, access_token: user.access_token}
  end

  def show
    user = User.find_by(venmo_id: permit_params[:id])
    if user
      render json: {user: user, houses: user.houses}
    else
      render json: {error: "User not found"}
    end
  end

  def search
    search = permit_params[:search]
    users = User.where('display_name LIKE ? OR email LIKE ? OR phone LIKE ?', "%#{search}%", "%#{search}%", "%#{search}%")

    if users.empty?
      render json: {error: 'User not found, try again'}
    else
      render json: {users: users}
    end
  end

  private

  def add_attributes(object, args)
    object.attributes = args.reject {|k,v| !object.attributes.keys.member?(k.to_s)}
  end

  def permit_params
    params.permit(:code, :id, :search)
  end

end