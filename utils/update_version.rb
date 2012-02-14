#!/usr/bin/env ruby

filename = File.dirname(File.expand_path(__FILE__)) + "/version.txt"
version = eval(File.read(filename))
version += 1

tmpfile = File.new filename, "w"
tmpfile.write version
tmpfile.flush

puts version