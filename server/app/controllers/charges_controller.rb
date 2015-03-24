class ChargesController < ApplicationController
  include
  def verify_webhook
    render json: permit_params[:venmo_challenge]
  end

  def update_status
    venmo_webhook = ActiveSupport::JSON.decode(request.body.string)
    p venmo_webhook
  end

  protected

  def permit_params
    params.permit(:token)
  end
end
