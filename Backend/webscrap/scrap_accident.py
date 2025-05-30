GEMINI_API = "xxx"

import requests
from bs4 import BeautifulSoup
import os
import time
import json

websites = [
    "https://english.onlinekhabar.com/",
    "https://nepalnews.com/",
    "https://thehimalayantimes.com/",
    "https://kathmandupost.com/",
    "https://risingnepaldaily.com/",
    "https://english.nepalpress.com/"
]

def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    articles = soup.find_all('article')
    data = []
    for article in articles:
        title_tag = article.find('h2')
        link_tag = article.find('a')
        if title_tag and link_tag:
            title = title_tag.text.strip()
            link = link_tag['href']
            data.append({'title': title, 'link': link})
    return data

def get_gemini_response(data):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/MODEL_ID:generateContent?key={GEMINI_API}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "messages": [{"role": "user", "content": data['title']}]
    }
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}, {response.json()}")
        return None

scraped_data = []
for website in websites:
    scraped_data.extend(scrape_website(website))

gemini_responses = []
for data in scraped_data:
    response = get_gemini_response(data)
    if response:
        gemini_responses.append(response)
    time.sleep(1)

extracted_info = []
for response in gemini_responses:
    if "type" in response and response["type"] in ["accident", "flood", "landslide", "fire", "road_damage"]:
        extracted_info.append({
            "type": response["type"],
            "place": response["place"]
        })

with open('backend/webscrap/data.json', 'w') as json_file:
    json.dump(extracted_info, json_file, indent=4)