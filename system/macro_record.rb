#!/usr/bin/env ruby

# Usage: ruby macro_record.rb [filename]

# Use xmacrorec2 -k 91 > test2.txt to record a file


filename = ARGV[0]
if filename == nil
    puts "Provide a filename as first argument"
    exit
end


# 91 is numeric dot
puts system("xmacrorec2 -k 91 > macros/#{filename}")
