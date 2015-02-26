class ApplicationController < ActionController::API
  private

  def cors_set_access_control_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, PATCH, DELETE, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token'
  end

  def add_attributes(object, args)
    object.attributes = args.reject {|k,v| !object.attributes.keys.member?(k.to_s)}
  end
end
