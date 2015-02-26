module JSONFormatting
  extend ActiveSupport::Concern

  def user_json_response
    {
      user: {
        id: @user.id,
        nickname: @user.nickname,
        first_name: @user.first_name,
        last_name: @user.last_name,
        display_name: @user.display_name,
        email: @user.email,
        phone: @user.phone,
        profile_picture_url: @user.profile_picture_url,
        venmo_id: @user.venmo_id,
        houses: user_houses_to_json
      }
    }
  end

  def users_json_response
    @users.map do |user|
      @user = user
      user_json_response[:user]
    end
  end

  def house_json_response
    {
      house: {
        id: @house.id,
        name: @house.name,
        users: house_users_to_json
      }
    }
  end

  def expense_json_response
    {
      expense: {
        id: @expense.id,
        note: @expense.note,
        amount: @expense.amount,
        user: expense_user_to_json,
        house: expense_house_to_json,
        charges: expense_charges_to_json
      }
    }
  end


  private

  def user_houses_to_json
    @user.houses.map do |house|
      {
        id: house.id,
        name: house.name
      }
    end
  end

  def house_users_to_json
    @house.users.map do |user|
      @user = user
      user_json_without_houses
    end
  end

  def expense_user_to_json
    @user = @expense.user
    user_json_without_houses
  end

  def expense_house_to_json
    @house = @expense.house
    house_json_response[:house].reject {|k,_| k == :users}
  end

  def expense_charges_to_json
    @expense.charges.map do |charge|
      @charge = charge
      {
        id: @charge.id,
        venmo_payment_id: @charge.venmo_payment_id,
        amount: @charge.amount,
        note: @charge.note,
        status: @charge.status,
        date_completed: @charge.date_completed,
        user: charge_user_to_json
      }
    end
  end

  def charge_user_to_json
    @charge.user.map do |user|
      @user = user
      user_json_without_houses
    end
  end

  def user_json_without_houses
    user_json_response[:user].reject {|k,_| k == :houses}
  end

end