'''

import requests
import json
import time

songs_url = "https://ws.audioscrobbler.com/2.0/"

tags_list = ["piano", "dark ambient", "easy listening", "lo-fi", "classic", "blues", "chill"]

result = dict()

for curTag in tags_list:
    for page in range(1,11):
        songs_response = requests.get(
            url = songs_url,
            params = {"tag" : curTag,
                      "page" : page,
                      "method" : "tag.gettoptracks",
                      "format" : "json",
                      "api_key" : ""})
        songs_result = songs_response.json()
            
        song_set = songs_result["tracks"]
        for song in song_set["track"]:
            result[song["url"]] = [song["name"], song["artist"]["name"], song["duration"]]

        # debugging purposes only
        print(f"\npage : {song_set['@attr']['page']} | total : {len(result)}\n")

        time.sleep(10)


    with open(f"{curTag}_songs_results.json", "w") as f:
        json.dump(result, f)

'''
