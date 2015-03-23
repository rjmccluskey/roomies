class ApplicationController < ActionController::API
  include JSONFormatting

  before_filter :cors_set_access_control_headers

  before_action :authenticate

  protected

  def cors_set_access_control_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, PATCH, DELETE, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token'
  end

  def add_attributes(object, args)
    object.attributes = args.reject {|k,v| !object.attributes.keys.member?(k.to_s)}
  end

  def authenticate
    authenticate_token || render_unauthorized
  end

  def authenticate_token
    permit_params[:token] == ENV['ROOMIES_SECRET']
  end

  def render_unauthorized
    self.headers['WWW-Authenticate'] = 'Token realm="Application"'
    render json: 'Bad credentials', status: 401
  end
end
