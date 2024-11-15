GEMINI_API = "AIzaSyBV_7pw611g6J19JzJCwWevKXGIfnVuEjg"

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import requests

chrome_options = Options()
chrome_options.add_argument("--headless")  
service = Service('/path/to/chromedriver') 
driver = webdriver.Chrome(service=service, options=chrome_options)

websites = [
    "https://english.onlinekhabar.com/",
    "https://nepalnews.com/",
    "https://thehimalayantimes.com/",
    "https://kathmandupost.com/",
    "https://risingnepaldaily.com/",
    "https://english.nepalpress.com/"
]

def scrape_website(url):
    driver.get(url)
    articles = driver.find_elements(By.TAG_NAME, 'article')  
    data = []
    for article in articles:
        title = article.find_element(By.TAG_NAME, 'h2').text  
        link = article.find_element(By.TAG_NAME, 'a').get_attribute('href')
        data.append({'title': title, 'link': link})
    return data

scraped_data = []
for website in websites:
    scraped_data.extend(scrape_website(website))

def get_gemini_response(data):
    url = "https://gemini-api-url.com/endpoint"
    headers = {
        "Authorization": f"Bearer {GEMINI_API}",
        "Content-Type": "application/json"
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

gemini_responses = []
for data in scraped_data:
    response = get_gemini_response(data)
    gemini_responses.append(response)

extracted_info = []
for response in gemini_responses:
    for item in response:
        if item['type'] in ["accident", "flood", "landslide", "fire", "road_damage"]:
            extracted_info.append({
                "type": item['type'],
                "place": item['place']
            })

for info in extracted_info:
    print(f"type: {info['type']}, place: {info['place']}")

driver.quit()