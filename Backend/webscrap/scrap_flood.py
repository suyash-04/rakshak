import requests
from bs4 import BeautifulSoup
import json

url = "https://www.dhm.gov.np/hydrology/realtime-stream"

response = requests.get(url, verify=False)

soup = BeautifulSoup(response.content, 'html.parser')

table = soup.find('table', {'id': 'tablegeneral'})

rows = table.find('tbody').find_all('tr')

data = []
for row in rows:
    cols = row.find_all('td')
    cols = [col.text.strip() for col in cols]
    
    station_name = cols[1]
    print (station_name, cols[5])
    try:
        water_level = float(cols[5])
        data.append({
            "type": "flood",
            "station_name": station_name
        })
    except ValueError:
        continue
    


with open('backend/webscrap/data.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)

print("Data saved to data.json")