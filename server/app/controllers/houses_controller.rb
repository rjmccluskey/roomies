class HousesController < ApplicationController
  before_filter :cors_set_access_control_headers

  def create
    house = House.create name: permit_params[:name],
                         password: permit_params[:password],
                         password_confirmation: permit_params[:password_confirmation]

    user = User.find_by(venmo_id: permit_params[:venmo_id])

    if house.valid?
      render json: {success: true}
    else
      render json: {errors: house.errors}
    end
  end

  private

  def permit_params
    params.permit(:venmo_id, :name, :password, :password_confirmation)
  end
end
