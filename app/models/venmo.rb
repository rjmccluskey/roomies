module Venmo
  class ClientOauth
    include HTTParty

    base_uri "https://api.venmo.com/v1"

    def initialize(code)
      @client_id = ENV['CLIENT_ID']
      @client_secret = ENV['CLIENT_SECRET']
      @code = code
      @options = {
        body: {"client_id" => @client_id, "client_secret" => @client_secret, "code" => @code}
      }
    end

    def oauth
      response = self.class.post('/oauth/access_token', @options)
    end
  end
end