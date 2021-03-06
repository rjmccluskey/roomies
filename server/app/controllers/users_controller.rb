class UsersController < ApplicationController

  def create
    venmo = Venmo::Oauth.new(permit_params[:code])
    venmo_info = venmo.oauth
    user_info = venmo_info["user"]
    error = venmo_info["error"]
    @user = User.find_by(venmo_id: user_info["id"])

    if @user && !error
      @user.update_attributes(access_token: venmo_info["access_token"], refresh_token: venmo_info["refresh_token"])
    elsif !error
      @user = User.new

      # rename "id" to "venmo_id" so that it doesn't conflict with User
      user_info["venmo_id"] = user_info["id"]
      user_info.delete("id")

      add_attributes(@user,venmo_info)
      add_attributes(@user,user_info)
      @user.save
    end

    if error
      render json: {error: error}
    else
      render json: user_json_response
    end
  end

  def show
    @user = User.find_by(venmo_id: permit_params[:id])
    if @user
      render json: user_json_response
    else
      render json: {error: "User not found"}
    end
  end

  def search
    search = permit_params[:search]
    @users = User.where('display_name LIKE ? OR email LIKE ? OR phone LIKE ?', "%#{search}%", "%#{search}%", "%#{search}%")

    if @users.empty?
      render json: {error: 'User not found, try again'}
    else
      render json: users_json_response
    end
  end

  protected

  def permit_params
    params.permit(:code, :id, :search, :token)
  end

end
