$LOAD_PATH.unshift(File.expand_path(File.dirname(__FILE__)))
$LOAD_PATH.unshift(File.expand_path(File.dirname(__FILE__) + '/views'))
require 'rubygems'
require 'homeimprovement'
run Sinatra::Application
