
import csv
import json

# def name_converter(number_city):
#     if int(number_city) == 269:
#         return "Lelystad"
#     elif int(number_city) == 270:
#         return "Leeuwarden"

def check_fill(number_value, month_variable):
    if not number_value.isspace():
        return number_value
    else:
        return (month_variable/counter)

# converts the KNMI_data.csv file to  the KNMI_info.json file

with open('vegetables_import.csv', 'r') as csvfile:
    barchart_csv = csv.reader(csvfile)
    types = barchart_csv.next()
    print types
    types = barchart_csv.next()
    first = barchart_csv.next()
    print first
    print first[9] #country
    print first[10] # abreviation
    print first[31] # USD
    print first[1] # year
    print first[22] # sector

    first = True

    country_list = []
    country_data = {}
    setted_country_list = set(country_list)

    with open('import_vegetables.json', 'w') as outfile:
        outfile.write('[')
        for first_line in barchart_csv:
            setted_country_list = set(country_list)
            if first_line[10] not in setted_country_list and first_line[1] == "2011":
                country_list.append(first_line[10])
                with open('vegetables_import.csv', 'r') as csv_file:
                    import_file = csv.reader(csv_file)
                    for second_line in import_file:
                        if first_line[10] == second_line[10] and first_line[1] != second_line[1]:
                            country_data[second_line[1]] = second_line[31]
                            print "secondline:  ", second_line
                    if first == True:
                        json.dump({str(first_line[10]):{"country": first_line[9], "2011" : str(first_line[31]), "2012" : str(country_data["2012"]), "2013" : str(country_data["2013"]), "2014" : str(country_data["2014"]), "2015" : str(country_data["2015"])}}, outfile)
                        first = False
                    else:
                        outfile.write(',\n')
                        json.dump({str(first_line[10]):{"country": first_line[9], "2011" : str(first_line[31]), "2012" : str(country_data["2012"]), "2013" : str(country_data["2013"]), "2014" : str(country_data["2014"]), "2015" : str(country_data["2015"])}}, outfile)
        outfile.write(']')
        print "JSON file created"
    outfile.close()



