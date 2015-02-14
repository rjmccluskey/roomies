class UsersController < ApplicationController
  before_filter :cors_set_access_control_headers

  def venmo_oauth
    venmo = Venmo::ClientOauth.new(permit_params[:code])
    user_info = venmo.oauth
    render json: user_info
  end

end
