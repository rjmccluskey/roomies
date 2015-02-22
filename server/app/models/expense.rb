class Expense < ActiveRecord::Base
  attr_accessor :amount_string

  before_save :set_amount

  belongs_to :user
  belongs_to :house

  validates_presence_of :note, :amount_string, :user_id
  validates_format_of :amount_string, with: /\A[$]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{1,2})?\z/, message: "is not a valid amount"
  validates_length_of :note, in: 1..140

  private

  def set_amount
    remove_unnecessary_chars_from_amount_string

    self.amount = amount_string.to_f.abs
  end

  def remove_unnecessary_chars_from_amount_string
    self.amount_string = amount_string.gsub(/[,]?[$]?/,"")
  end

end
