module Venmo
  class Oauth
    include HTTParty

    base_uri "https://api.venmo.com/v1"

    def initialize(code)
      @client_id = ENV['CLIENT_ID']
      @client_secret = ENV['CLIENT_SECRET']
      @code = code
      @options = {
        body: {
          "client_id" => @client_id,
          "client_secret" => @client_secret,
          "code" => @code
        }
      }
    end

    def oauth
      response = self.class.post('/oauth/access_token', @options)
    end
  end

  class Payments
    include HTTParty

    base_uri "https://api.venmo.com/v1"

    def initialize(access_token, venmo_id)
      if venmo_id == "145434160922624933"             # check if test user
        self.class.base_uri "https://sandbox-api.venmo.com/v1"
      end
      @options = {
        body: {
          "access_token" => access_token,
          "user_id" => venmo_id
        }
      }
    end

    def charge(amount, note)
      @options[:body]["amount"] = amount * -1 # charges are negative values
      @options[:body]["note"] = note

      response = self.class.post('/payments', @options)
    end
  end
end