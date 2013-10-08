require 'rubygems'
require 'sinatra'
require 'mongo'
require 'json'

DB = Mongo::Connection.new.db("reply", :pool_size => 5, :timeout => 5)
HI = DB["homeimprovement"]

get '/' do
  haml :index, :attr_wrapper => '"', :locals => {:title => 'haii'}
end

get '/homeimprovement' do
  @listing = HI.find({}, {:fields => {"_id" => 0, "CategoryName" => 1}})
  haml :homeimprovement, :attr_wrapper => '"', :locals => {:title => 'h. i.  with monnie bennett'}
end

get '/homeimprovement/:category' do
  @category = params[:category]
  @listing = HI.find({"CategoryName" => @category}, {:fields => {"_id" => 0, "SubCategories.SubCategoryName" => 1}}).next
  haml :category_listing, :attr_wrapper => '"', :locals => {:title => "category_listing mongo page"}
end

get '/api/:thing' do
  DB.collection(params[:thing]).find.to_a.map{|t| from_bson_id(t)}.to_json
end

get '/api/:thing/:id' do
  from_bson_id(DB.collection(params[:thing]).find_one(to_bson_id(params[:id]))).to_json
end

post '/api/:thing' do
  oid = DB.collection(params[:thing]).insert(JSON.parse(request.body.read.to_s))
  "{\"_id\": \"#{oid.to_s}\"}"
end

delete '/api/:thing/:id' do
  DB.collection(params[:thing]).remove('_id' => to_bson_id(params[:id]))
end

put '/api/:thing/:id' do
  DB.collection(params[:thing]).update({'_id' => to_bson_id(params[:id])}, {'$set' => JSON.parse(request.body.read.to_s).reject{|k,v| k == '_id'}})
end

def to_bson_id(id) BSON::ObjectId.from_string(id) end
def from_bson_id(obj) obj.merge({'_id' => obj['_id'].to_s}) end
