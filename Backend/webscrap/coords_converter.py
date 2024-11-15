import requests
import time
import logging
import json

logging.basicConfig(level=logging.INFO)

api_url = "http://127.0.0.1:8000/api/report-hazard/"

def get_lat_long(address):
    base_url = "https://nominatim.openstreetmap.org/search"
    params = {"q": address, "format": "json"}
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(base_url, params=params, headers=headers)
    if response.status_code == 200:
        data = response.json()
        if data:
            location = data[0]
            return float(location["lat"]), float(location["lon"])
        else:
            logging.warning(f"No results found for {address}")
    else:
        logging.error(f"HTTP Error: {response.status_code}")
    return None, None

def record_accident(street, lat, lon, accident_type):
    if lat is None or lon is None:
        logging.error(f"{street} not found")
        return

    payload = {
        "type": accident_type,
        "latitude": lat,
        "longitude": lon,
    }
    response = requests.post(api_url, json=payload)
    print(payload)
    if response.status_code == 200:
        logging.info(f"Reported {accident_type} at {street}")
    else:
        logging.error(f"Failed to record {accident_type} at {street}: {response.status_code}")

with open('backend/webscrap/data.json', 'r') as file:
    accidents_data = json.load(file)

for accident in accidents_data:
    accident_type = accident.get("type")
    street = accident.get("place")
    if accident_type and street:
        lat, lon = get_lat_long(street)
        if lat and lon:
            record_accident(street, lat, lon, accident_type)