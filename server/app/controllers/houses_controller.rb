class HousesController < ApplicationController
  before_filter :cors_set_access_control_headers

  def create
    house = House.create name: permit_params[:name],
                         password: permit_params[:password],
                         password_confirmation: permit_params[:password_confirmation]

    user = User.find_by(venmo_id: permit_params[:venmo_id])

    if house.valid?
      house.users << user
      render json: {success: true}
    else
      render json: {errors: house.errors}
    end
  end

  def show
    house = House.find_by_id(permit_params[:id])

    if house
      users = house.users
      render json: {house: house, users: users}
    else
      render json: {errors: "House does not exist"}
    end
  end

  def join
    house = House.find_by_id(permit_params[:id])
    user = User.find_by(venmo_id: permit_params[:venmo_id])

    if house.authenticate(permit_params[:password])
      house.users << user
      render json: {success: true}
    else
      render json: {errors: 'Invalid password'}
    end
  end

  private

  def permit_params
    params.permit(:id, :venmo_id, :name, :password, :password_confirmation)
  end
end
