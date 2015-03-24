class ChargesController < ApplicationController
  def verify_webhook
    render json: permit_params[:venmo_challenge]
  end

  def update_status
    p "============================"
    p JSON.parse(permit_params[:data])
    p "============================"
    p permit_params[:type]
    p "============================"
  end

  protected

  def permit_params
    params.permit(:token, :venmo_challenge, :date_created, :type, :data)
  end
end
