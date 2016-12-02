
import csv
import json


# converts the KNMI_data.csv file to  the KNMI_info.json file

with open('USA_map_data', 'r') as csvfile:
    barchart_csv = csv.reader(csvfile)
    types = barchart_csv.next()
    value_type = types[1]
    data_type = types[5]
    with open('USA_data.json', 'w') as outfile:
        outfile.write('[')
        first_line = barchart_csv.next()
        json.dump({"State": first_line[1], "brief" : first_line[2] , "Population": int(first_line[8].replace(".",""))}, outfile)
        for line in barchart_csv:
            outfile.write(',\n')
            json.dump({"State": line[1], "brief": line[2] , "Population": int(line[8].replace(".",""))}, outfile)
        outfile.write(']')
        print "JSON file created"
    outfile.close()


