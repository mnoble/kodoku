require "bundler/setup"
require "sinatra"

set :public_folder, "assets"

get "/" do
  erb :index
end
