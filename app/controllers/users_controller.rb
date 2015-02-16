class UsersController < ApplicationController
  before_filter :cors_set_access_control_headers

  def venmo_oauth
    venmo = Venmo::Oauth.new(permit_params[:code])
    venmo_info = venmo.oauth
    user_info = venmo_info["user"]
    user = User.find_by(venmo_id: user_info["id"])

    unless user
      user = User.new

      # rename "id" to "venmo_id" so that it doesn't conflict with User
      user_info["venmo_id"] = user_info["id"]
      user_info.delete("id")

      add_attributes(user,venmo_info)
      add_attributes(user,user_info)
      user.save
    end

    session[:user_id] = user.venmo_id
    session[:access_token] = user.access_token

    render html: "venmo_id: #{session[:user_id]}   access_token: #{session[:access_token]}"
  end

  private

  def add_attributes(object, args)
    object.attributes = args.reject {|k,v| !object.attributes.keys.member?(k.to_s)}
  end

end
