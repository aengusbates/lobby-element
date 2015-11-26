import csv
import json

csvfile = open('reps.csv', 'r')
jsonfile = open('reps.json', 'w')

fieldnames = ("FirstName","LastName","IDNumber","Message")
reader = csv.DictReader( csvfile, fieldnames)

jsonfile.write('[')

first = True

for row in reader:
    jsonfile.write('\n\t')
    if first:
        first = False
    else:
        jsonfile.write(',')
    json.dump(row, jsonfile)

jsonfile.write('\n]')