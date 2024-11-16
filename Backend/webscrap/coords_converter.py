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

def record_accident(place, lat, lon, hazards_type):
    if lat is None or lon is None:
        logging.error(f"{place} not found")
        return

    payload = {
        "type": hazards_type,
        "latitude": lat,
        "longitude": lon,
    }
    response = requests.post(api_url, json=payload)
    print(payload)
    if response.status_code == 200:
        logging.info(f"Reported {hazards_type} at {place}")
    else:
        logging.error(f"Failed to record {hazards_type} at {place}: {response.status_code}")

with open('backend/webscrap/data.json', 'r') as file:
    hazards_data = json.load(file)

for hazards in hazards_data:
    hazards_type = hazards.get("type")
    place = hazards.get("place")
    if hazards_type and place:
        lat, lon = get_lat_long(place)
        if lat and lon:
            record_accident(place, lat, lon, hazards_type)