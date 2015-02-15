class UsersController < ApplicationController
  before_filter :cors_set_access_control_headers

  def venmo_oauth
    venmo = Venmo::Oauth.new(permit_params[:code])
    user_info = venmo.oauth
    user = User.new

    # rename "id" to "venmo_id" so that it doesn't conflict with User
    user_info["user"]["venmo_id"] = user_info["user"]["id"]
    user_info["user"].delete("id")

    add_attributes(user,user_info)
    add_attributes(user,user_info["user"])
    user.save
    p user
    render json: user_info
  end

  private

  def add_attributes(object, args)
    object.attributes = args.reject {|k,v| !object.attributes.keys.member?(k.to_s)}
  end

end
