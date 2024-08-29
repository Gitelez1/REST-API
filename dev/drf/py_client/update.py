import requests

endpoint = "http://localhost:8000/api/products/1/update/"

data = {
    "title": "hello world my old friend",
    "price": 100.00
}

get_response = requests.put(endpoint, json=data) # API --> Aplication Programming Interface
print(get_response.json())
