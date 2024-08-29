import requests


headers = {'Authorization': 'Bearer 09983ce987545efce7b2c47358a96e5eaf46c543'}
endpoint = "http://localhost:8000/api/products/"

data = {
    "title": "this field is done",
    "price": 32.33
}
get_response = requests.post(endpoint, json=data, headers=headers) # API --> Aplication Programming Interface
print(get_response.json())
