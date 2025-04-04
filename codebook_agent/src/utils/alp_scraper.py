import requests
import time

BASE_URL = "https://codelibrary.amlegal.com/api"
EMAIL = "evanbrooks0629@gmail.com"
PASSWORD = "Zillow2Sucks$"

def get_auth_token():
    url = f"{BASE_URL}/login/"
    payload = {
        "email": EMAIL,
        "password": PASSWORD
    }
    response = requests.post(url, json=payload)
    response.raise_for_status()
    return response.json()["key"]

def get_municipalities_from_state(token, lowercase_state_code):
    url = f"{BASE_URL}/client-regions/{lowercase_state_code}/"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def get_municipality_codebook_versions(token, municipality_slug):
    url = f"{BASE_URL}/clients/{municipality_slug}/"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def request_html_codebook_version(token, lowercase_municipality, lowercase_state_code, latest_codebook_uuid):
    url = f"{BASE_URL}/export-requests/"
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "version": latest_codebook_uuid,
        "scope": f'[{{"code_slug":"{lowercase_municipality}_{lowercase_state_code}"}}]',
        "output_format": "html",
        "for_print": False
    }
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()

def check_if_export_is_ready(token, latest_codebook_uuid, export_id):
    url = f"{BASE_URL}/export-requests/"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()

    for export_request in response.json():
        if (export_request["uuid"] == export_id 
            and export_request["version"] == latest_codebook_uuid
            and export_request["task"]["post_state"] == "SUCCESS"):
            return True
    return False

def scrape_html_from_alp(municipality, state):
    lowercase_municipality = municipality.lower()
    lowercase_state_code = state.lower()

    try:
        token = get_auth_token()

        state_municipalities = get_municipalities_from_state(token, lowercase_state_code)

        municipality_object = next(
            client for client in state_municipalities["clients"] if client["name"] == municipality
        )

        municipality_codebook_versions = get_municipality_codebook_versions(token, municipality_object["slug"])

        latest_codebook_uuid = municipality_codebook_versions["versions"][0]["uuid"]

        export_response = request_html_codebook_version(
            token, lowercase_municipality, lowercase_state_code, latest_codebook_uuid
        )

        export_id = export_response["uuid"]

        is_export_ready = False

        while not is_export_ready:
            is_export_ready = check_if_export_is_ready(token, latest_codebook_uuid, export_id)
            time.sleep(2)

        download_link = f"https://export.amlegal.com/api/export-requests/{export_id}/download/"

        return download_link
    
    except requests.RequestException as e:
        print("Error:", e)