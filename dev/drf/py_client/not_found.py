import requests

endpoint = "http://localhost:8000/api/products/38098498139/"

get_response = requests.get(endpoint) # API --> Aplication Programming Interface
print(get_response.json())
