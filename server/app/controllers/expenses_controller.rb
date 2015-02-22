class ExpensesController < ApplicationController
  before_filter :cors_set_access_control_headers

  def create
    house_id = permit_params[:house_id]
    venmo_id = permit_params[:venmo_id]
    note = permit_params[:note]
    amount_string = permit_params[:amount_string]
    user = User.find_by(venmo_id: venmo_id)
    access_token = user.access_token
    house = House.find_by_id(house_id)
    roomies = house.users
    expense = Expense.new(note: note, amount_string: amount_string, user_id: user.id, house_id: house_id)

    if user && house && expense.valid?
      expense.save
      charge_amount = expense.amount / roomies.count
      roomies.each do |roomie|
        unless roomie == user
          Venmo::Payments.new(access_token, roomie.venmo_id).charge(charge_amount, note)
        end
      end
      render json: {success: true}
    else
      render json: {errors: ['Expense invalid']}
    end

  end

  private

  def permit_params
    params.permit(:amount_string, :venmo_id, :house_id, :note)
  end
end
