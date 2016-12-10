
import csv
import json

def name_converter(number_city):
    if int(number_city) == 269:
        return "Lelystad"
    elif int(number_city) == 270:
        return "Leeuwarden"

def check_fill(number_value, month_variable):
    if not number_value.isspace():
        return number_value
    else:
        return (month_variable/counter)


# converts the KNMI_data.csv file to  the KNMI_info.json file

with open('KNMI_data.csv', 'r') as csvfile:
    barchart_csv = csv.reader(csvfile)
    types = barchart_csv.next()
    print types
    value_type = types[1]
    data_type = types[2]
    month_name = "start"
    counter = 1
    first = True
    month_NG = 0
    date_json = 0
    with open('KNMI_info.json', 'w') as outfile:
        outfile.write('[')
        for first_line in barchart_csv:
            print first_line
            if first_line[1][4:6] != month_name:
                if month_name != "start":
                    if first:
                        json.dump({"City": name_city, "Year": year, "Month": month_name, "FXX": (month_FXX/counter),
                         "TX" : (month_TX/counter), "NG" : (month_NG/counter), "Date_js": date_json}, outfile)
                        first = False
                    else:
                        outfile.write(',\n')
                        json.dump({"City": name_city, "Year": year, "Month": month_name, types[2].strip(): (month_FXX / counter),
                                   types[3].strip() : (month_TX / counter), types[4].strip() : (month_NG / counter), "Date_js": date_json}, outfile)
                month_name = first_line[1][4:6]
                month_FXX = int(first_line[2])
                month_TX = int(first_line[3])
                month_NG = int(check_fill(first_line[4], month_NG))
                date_json = first_line[1]
                print date_json
                name_city = name_converter(first_line[0])
                year = first_line[1][:4]
                counter = 1
                print month_FXX
            else:
                month_FXX += int(first_line[2])
                month_TX += int(first_line[3])
                month_NG += int(check_fill(first_line[4], month_NG))
                print month_FXX
                counter += 1
        outfile.write(',\n')
        json.dump({"City": name_city, "Year": year, "Month": month_name, "FXX": (month_FXX / counter),
                   "TX": (month_TX / counter), "NG": (month_NG / counter), "Date_js": date_json}, outfile)
        outfile.write(']')
        print "JSON file created"
    outfile.close()



