class WakeupController < ApplicationController
  def wake
    render json: "I'm awake!"
  end

  protected

  def permit_params
    params.permit(:token)
  end
end
