class ExpensesController < ApplicationController
  def create
    house_id      = permit_params[:house_id]
    venmo_id      = permit_params[:venmo_id]
    note          = permit_params[:note]
    amount_string = permit_params[:amount_string]

    user = User.find_by(venmo_id: venmo_id)
    access_token = user.access_token
    house = House.find_by_id(house_id)
    roomies = house.users
    @expense = Expense.new(note: note, amount_string: amount_string, user_id: user.id, house_id: house_id)

    if user && house && @expense.valid?
      @expense.save
      charge_amount = @expense.amount / roomies.count
      roomies.each do |roomie|
        unless roomie == user
          venmo_api = Venmo::Payments.new(access_token, roomie.venmo_id)
          p venmo_response = venmo_api.charge(charge_amount, note)
          venmo_payment_info = {}
          unless venmo_response["error"]
            venmo_payment_info = venmo_response["data"]["payment"]
            p Charge.create(venmo_payment_id: venmo_payment_info["id"],
                          amount: venmo_payment_info["amount"],
                          note: note,
                          status: venmo_payment_info["status"],
                          expense_id: @expense.id,
                          user_id: roomie.id,
                          date_completed: venmo_payment_info["date_completed"])
          end
        end
      end
      if @expense.charges.count > 0
        render json: expense_json_response
      else
        @expense.destroy
        render json: {errors: ["There was a problem creating the charges!"]}
      end
    else
      render json: {errors: ['Expense invalid']}
    end

  end

  protected

  def permit_params
    params.permit(:amount_string, :venmo_id, :house_id, :note, :token)
  end
end
