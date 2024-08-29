import requests
import sys
sys.stdout.reconfigure(encoding='utf-8')

# endpoint = "https://httpbin.org/status/200/"
# endpoint = "https://httpbin.org/anything"
endpoint = "http://localhost:8000/api/"

get_response = requests.post(endpoint, json={"title": "abc123", "content": "hello world", "price": "11.09"}) # API --> Aplication Programming Interface
# print(get_response.text.encode('utf-8', errors='replace').decode('utf-8')) # print raw text response code
# print(get_response.status_code)

# JavaScript Object Nototion --> JSON

print(get_response.json())

# print(get_response.status_code)
