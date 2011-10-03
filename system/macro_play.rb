#!/usr/bin/ruby

filename = ARGV[0]

if filename == nil
    puts "Provide a filename as first argument"
    exit
end

count = 0
keys=[]
commands=[]
File.read(filename).split("\n").map do |line|
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
script << 'sleep 2'
for k in commands
    # sleep command
    if k =~ /Alt_L\+Shift_L\+\d/
        secs = k.match /\d+/
        script << 'sleep ' + secs[0]
    else
        script << 'sleep .7'
        script << 'xdotool key "' + k + '"'
    end
end

script = script.join("\n")
puts script

File.open(filename + '.sh', 'w') {|f| f.write(script) }