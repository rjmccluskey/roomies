class ChargesController < ApplicationController
  def verify_webhook
    render json: permit_params[:venmo_challenge]
  end

  def update_status

  end

  protected

  def permit_params
    params.permit(:token, :venmo_challenge)
  end
end
