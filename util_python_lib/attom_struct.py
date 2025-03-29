import requests
import json
import os

# Define your configuration as a list of groups.
# Each group can optionally include an attom_id.
groups = [
    # {
    #     "group_name": "property_v1",
    #     "base_url": "https://api.gateway.attomdata.com/propertyapi/v1.0.0",
    #     "attom_id": 53097573,
    #     "params": {
    #         # add any additional params here
    #     },
    #     "endpoints": [
    #         "property/buildingpermits",
    #         "property/detailowner",
    #         "property/expandedprofile",
    #     ]
    # },
    # {
    #     "group_name": "v4",
    #     "base_url": "https://api.gateway.attomdata.com/v4",
    #     # "attom_id": 53097573,
    #     "params": {
    #         "geoIdV4": "6828b00047035292dd47fe020e636bb3",
    #         "interval": "yearly",
    #         "startyear": "2015",
    #         "endyear": "2024"
    #     },
    #     "endpoints": [
    #         "transaction/salestrend"
    #     ]
    # },
    # {
    #     "group_name": "hazard",
    #     "base_url": "https://api.gateway.attomdata.com",
    #     "params": {
    #         "address": "4301 MURRAY ST, FLUSHING, NY 11355",
    #     },
    #     "endpoints": [
    #         "transportationnoise"
    #     ]
    # }
    # {
    #     "group_name": "school",
    #     "base_url": "https://api.gateway.attomdata.com/v4/school",
    #     "params": {
    #          "geoIdV4": "6828b00047035292dd47fe020e636bb3",
    #     },
    #     "endpoints": [
    #         # "profile",
    #         # "district",
    #         "search"
    #     ]
    # }
    # {
    #     "group_name": "school_detail_property",
    #     "base_url": "https://api.gateway.attomdata.com/propertyapi/v4/property",
    #     "attom_id": 184713191,
    #     "endpoints": [
    #         "detailwithschools"
    #     ]
    # },
    # {
    #     "group_name": "property_value_insights_geo",
    #     "base_url": "https://api.gateway.attomdata.com/propertyapi/v1.0.0",
    #     "params": {
    #           "geoIdV4": "6828b00047035292dd47fe020e636bb3",
    #      },
    #     "endpoints": [
    #         "assessment/snapshot",
    #     ]
    # },
    # {
    #     "group_name": "property_value_insights_address",
    #     "base_url": "https://api.gateway.attomdata.com/propertyapi/v1.0.0",
    #     "params": {
    #           "address1": "468 SEQUOIA DR",
    #           "address2": "SMYRNA, DE"
    #      },
    #     "endpoints": [
    #         "assessment/detail",
    #         "attomavm/detail",
    #         "avmhistory/detail",
    #         "valuation/homeequity",
    #         "valuation/rentalavm",
    #     ]
    # },
    # {
    #     "group_name": "property_value_insights_attom",
    #     "base_url": "https://api.gateway.attomdata.com/propertyapi/v1.0.0",
    #     "attom_id": 184713191,
    #     "endpoints": [
    #         "assessmenthistory/detail",
    #     ]
    # }
    {
        "group_name": "property_related_transactions",
        "base_url": "https://api.gateway.attomdata.com/propertyapi/v1.0.0",
        "attom_id": 184713191,
        "endpoints": [
            "allevents/detail",
            "allevents/snapshot",
            "property/detailmortgage",
            "property/detailmortgageowner",
            "saleshistory/snapshot"
        ]
     }
    #     {
    #     "group_name": "property_related_transactions",
    #     "base_url": "https://api.gateway.attomdata.com/propertyapi/v1.0.0",
    #     "params": {
    #            "address1": "468 SEQUOIA DR",
    #            "address2": "SMYRNA, DE"
    #       },
    #     "endpoints": [
    #         "sale/detail",
    #         "salehistory/basichistory",
    #         "salehistory/expandedhistory",
    #         "saleshistory/detail"
    #     ]
    # }

    
]

# API key for all requests
API_KEY = "5aaead26e47fa4793a529c2e71d07ad3"

# Common headers for all requests
headers = {
    "accept": "application/json",
    "apikey": API_KEY
}

def extract_fields(data):
    """
    Recursively extracts the structure of the JSON response.
    Returns a nested dictionary where each key maps to the type of value
    or a nested structure for dictionaries/lists.
    """
    if isinstance(data, dict):
        return {key: extract_fields(value) for key, value in data.items()}
    elif isinstance(data, list):
        if data:
            return [extract_fields(data[0])]
        else:
            return []
    else:
        return type(data).__name__

def call_endpoint(base_url, endpoint_path, attom_id=None, extra_params={}):
    """
    Calls the specified endpoint using the provided base_url, optional attom_id, and extra params.
    Returns the parsed JSON response if successful, else None.
    """
    url = f"{base_url}/{endpoint_path}"
    # Include attom_id in the parameters only if provided.
    params = {
        **( {"attomid": attom_id} if attom_id is not None else {} ),
        **extra_params,
        "debug": "true",
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error calling {url}: {e}")
        return None

def main():
    all_fields = {}

    for group in groups:
        group_name = group["group_name"]
        base_url = group["base_url"]
        attom_id = group.get("attom_id")  # Optional now
        endpoints = group["endpoints"]
        group_params = group.get("params", {})

        print(f"Processing group: {group_name}")
        group_results = {}
        
        for ep in endpoints:
            print(f"  Calling endpoint: {ep}")
            data = call_endpoint(base_url, ep, attom_id, group_params)
            if data is not None:
                fields = extract_fields(data)
                group_results[ep] = fields
            else:
                group_results[ep] = "Error calling endpoint or no data returned."
        all_fields[group_name] = group_results

    const_output = "endpoint_fields.json"
    with open(const_output, "w") as outfile:
        json.dump(all_fields, outfile, indent=4)
    
    print(f"Endpoint field documentation saved to {os.path.abspath(const_output)}")

if __name__ == "__main__":
    main()