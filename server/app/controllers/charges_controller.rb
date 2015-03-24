class ChargesController < ApplicationController
  include
  def verify_webhook
    render json: permit_params[:venmo_challenge]
  end

  def update_status
    venmo_webhook = ActiveSupport::JSON.decode(request.body.string)
    payment_data = venmo_webhook["data"]
    status = payment_data["status"]
    unless status == "pending"
      charge = Charge.find_by(venmo_payment_id: payment_data["id"])
      charge.update_attributes(status: status, date_completed: payment_data["date_completed"])
    end
  end

  protected

  def permit_params
    params.permit(:token)
  end
end
