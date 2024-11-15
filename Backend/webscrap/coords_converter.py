import requests
import time
import logging

logging.basicConfig(level=logging.INFO)

accidents_data = {
    "Satdobato": 31,
    "Maitighar": 26,
    "Thankot": 24,
    "Kalanki": 22,
    "Babarmahal": 20,
    "Maharajgunj": 19,
    "Min Bhawan": 18,
    "Bhaktapur": 17,
    "Sitapaila": 16,
    "Jawalakhel": 15,
    "Gatthhaghar": 15,
    "Gangabu": 14,
    "Chabahil/Bouddha": 14,
    "Airport Road": 13,
    "Sukedhara": 13,
}

api_url = "http://127.0.0.1:8000/api/report-accident/"

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

def record_accident(street, lat, lon):
    if lat is None or lon is None:
        logging.error(f"Invalid coordinates for {street}")
        return

    payload = {
        "type": "accident",
        "latitude": lat,
        "longitude": lon,
    }
    response = requests.post(api_url, json=payload)
    print(payload)
    if response.status_code == 200:
        logging.info(f"Reported accident at {street}")
    else:
        logging.error(f"Failed to record accident at {street}: {response.status_code}")

for street, accidents in accidents_data.items():
    lat, lon = get_lat_long(street)
    if lat and lon:
        for _ in range(accidents):
            record_accident(street, lat, lon)
            time.sleep(2)