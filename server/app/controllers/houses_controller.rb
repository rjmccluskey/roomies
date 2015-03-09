class HousesController < ApplicationController
  include JSONFormatting

  before_filter :cors_set_access_control_headers

  def create
    @house = House.create name: permit_params[:name],
                          password: permit_params[:password],
                          password_confirmation: permit_params[:password_confirmation]

    user = User.find_by(venmo_id: permit_params[:venmo_id])

    if @house.valid?
      @house.users << user
      render json: house_json_response
    else
      render json: {errors: @house.errors}
    end
  end

  def show
    @house = House.find_by_id(permit_params[:id])

    if @house
      render json: house_json_response
    else
      render json: {error: "House does not exist"}
    end
  end

  def join
    @house = House.find_by_id(permit_params[:id])
    user = User.find_by(venmo_id: permit_params[:venmo_id])

    if @house.authenticate(permit_params[:password])
      @house.users << user
      render json: house_json_response
    else
      render json: {error: 'Invalid password'}
    end
  end

  def show_expenses
    house = House.find_by_id(permit_params[:house_id])
    @expenses = house.expenses

    if house
      render json: house_expenses_json_response
    else
      render json: {error: "House does not exist"}
    end
  end

  private

  def permit_params
    params.permit(:id, :house_id, :venmo_id, :name, :password, :password_confirmation)
  end
end
