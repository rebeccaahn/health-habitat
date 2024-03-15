'''

import requests
import json

fitness_url = "https://wger.de/api/v2/exercisebaseinfo/"

result = dict()
categoryNums = set()


while True:
    if fitness_url == None:
        break
    fitness_response = requests.get(url = fitness_url, params = {"limit" : 500})
    fitness_result = fitness_response.json()
    for exercise_set in fitness_result["results"]:
        tmp1 = exercise_set["category"]["id"]
        tmp2 = []
        for eq_item in exercise_set["equipment"]:
            tmp2.append(eq_item["id"])
        #categoryNums.add(tmp1)
        for exercise in exercise_set["exercises"]:
            if exercise["language"] == 2 and exercise["description"] != "":
                result[exercise["id"]] = (tmp1, exercise["name"], exercise["description"], tmp2)

    fitness_url = fitness_result["next"]

#print(categoryNums)

with open("fitness_results.json", "w") as f:
    json.dump(result, f)

'''
