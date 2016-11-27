
import csv
import json


#barchart_data = raw_input('Data input file: ')

with open('barchart_data.csv', 'r') as csvfile:
    barchart_csv = csv.reader(csvfile)
    types = barchart_csv.next()
    value_type = types[1]
    data_type = types[2]
    with open('barchart_info.json', 'w') as outfile:
        outfile.write('[')
        first_line = barchart_csv.next()
        json.dump({value_type: first_line[1], data_type.lower(): first_line[2]}, outfile)
        for line in barchart_csv:
            outfile.write(',\n')
            json.dump({value_type : line[1], data_type.lower() : line[2]}, outfile)
        outfile.write(']')
        print "JSON file created"
    outfile.close()
