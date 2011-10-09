#!/usr/bin/ruby1.8

# Usage: ruby macro_play.rb [filename] [times]

# Use xmacrorec2 -k 91 > test2.txt to record a file

filename = ARGV[0]
times = ARGV[1]

if filename == nil
    puts "Provide a filename as first argument"
    exit
end

if times == nil
    times = 1
else
    times = times.to_i
end

count = 0
keys=[]
commands=[]
File.read("macros/" + filename).split("\n").map do |line|
    tokens = line.split(/ /)

    if !line.start_with?('KeyStr')
        next
    end

    case line
    when /^KeyStrPress/
        count+=1
        keys << tokens[1]
    when /^KeyStrRelease/
        count-=1
    end

    if count == 0
        # check combinations
        # case of a+b
        if keys.length > 1 and keys.grep(/\S(_)/) != []
            commands << keys.join("+")
        else
            for k in keys
                commands << k
            end
        end

        keys = []
    end
end

script = []
script << 'sleep 1'
for k in commands
    # sleep command
    if k =~ /Alt_L\+Shift_L\+\d/
        secs = k.match /\d+/
        script << 'sleep ' + secs[0] + ";"
    else
        script << 'sleep .5;'
        script << 'xdotool key "' + k + '";'
    end
end

script = script.join("\n")
#puts script

for i in 0...times do
    puts system(script)
end