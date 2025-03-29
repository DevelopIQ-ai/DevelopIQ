import asyncio
import json
import logging
from playwright.async_api import async_playwright
from browserbase import Browserbase

logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)

# Replace these with your actual Browserbase API key and project ID
BROWSERBASE_API_KEY = "bb_live_D_nrgh5gVblt1jfFCkjKxU0eOcE"
BROWSERBASE_PROJECT_ID = "cf5228a4-4788-4cba-8807-2608282a1cbe"

ZILLOW_URL = "https://www.zillow.com/homedetails/7823-Oak-Ct-Lino-Lakes-MN-55014/61271972_zpid/"

async def prompt_user_to_solve_captcha(page) -> bool:
    """
    If a CAPTCHA is detected, prompt the user to solve it manually.
    """
    log.info("CAPTCHA detected on the page.")
    log.info("Please solve the CAPTCHA manually in the open browser window, then press Enter in the terminal.")
    await asyncio.to_thread(input, "Press Enter once the CAPTCHA is solved: ")
    log.info("CAPTCHA solved, continuing...")
    await page.wait_for_timeout(3000)
    return True

async def scrape_zillow_property(url: str) -> dict:
    """
    Scrape a Zillow property page using Browserbase's managed browser session.
    """
    # Initialize Browserbase and create a session
    bb = Browserbase(api_key=BROWSERBASE_API_KEY)
    session = bb.sessions.create(project_id=BROWSERBASE_PROJECT_ID)
    
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp(session.connect_url)
        context = browser.contexts[0]
        if context.pages:
            page = context.pages[0]
        else:
            page = await context.new_page()
        
        log.info(f"Visiting {url}")
        await page.goto(url)
        await page.wait_for_timeout(20000)  # Wait for the page to load
        
        # Optional: Check for CAPTCHA based on page title (adjust condition as needed)
        page_title = await page.title()
        if "captcha" in page_title.lower():
            await prompt_user_to_solve_captcha(page)
        
        # Extract script contents from the page
        scripts = await page.evaluate(
            """() => {
                return Array.from(document.querySelectorAll("script"))
                    .map(script => script.textContent.trim());
            }"""
        )
        
        data_json = None
        for script in scripts:
            if "zpid" in script or "address" in script:
                try:
                    start_index = script.find('{')
                    end_index = script.rfind('}') + 1
                    if start_index != -1 and end_index != -1:
                        possible_json_string = script[start_index:end_index]
                        data_json = json.loads(possible_json_string)
                        break
                except Exception as e:
                    log.error(f"Error parsing JSON: {e}")
                    continue
        
        page_title = await page.title()
        await browser.close()
        
        return {
            "url": url,
            "title": page_title,
            "json_data_found": data_json is not None,
            "data_json": data_json,
        }
    
def extract_data(json_file_path: str) -> list[dict]:
    """
    Extract property data from the JSON file saved by the scraper.
    """
    with open(json_file_path, 'r') as file:
        data = json.load(file)

    properties_str = data['props']['pageProps']['componentProps']['gdpClientCache']
    if isinstance(properties_str, str):
        properties = json.loads(properties_str)
    else:
        properties = properties_str

    properties_data = []

    for key, value in properties.items():
        if 'property' in value:
            property_info = value['property']
            property_data = {}

            # Main property details
            property_data.update({
                'city': property_info.get('city'),
                'state': property_info.get('state'),
                'homeStatus': property_info.get('homeStatus'),
                'zipcode': property_info['address'].get('zipcode'),
                'neighborhood': property_info['address'].get('neighborhood'),
                'community': property_info['address'].get('community'),
                'subdivision': property_info['address'].get('subdivision'),
                'price': property_info.get('price'),
                'currency': property_info.get('currency'),
                'bedrooms': property_info.get('bedrooms'),
                'bathrooms': property_info.get('bathrooms'),
                'lotSize': property_info.get('lotSize'),
                'lotAreaValue': property_info.get('lotAreaValue'),
                'lotAreaUnits': property_info.get('lotAreaUnits'),
                'latitude': property_info.get('latitude'),
                'longitude': property_info.get('longitude'),
                'streetAddress': property_info['address'].get('streetAddress'),
            })

            # Listing subtypes
            listing_sub_type = property_info.get('listing_sub_type', {})
            property_data.update({
                'is_newHome': listing_sub_type.get('is_newHome'),
                'is_forAuction': listing_sub_type.get('is_forAuction'),
                'is_bankOwned': listing_sub_type.get('is_bankOwned'),
                'is_foreclosure': listing_sub_type.get('is_foreclosure'),
                'is_FSBO': listing_sub_type.get('is_FSBO'),
                'is_comingSoon': listing_sub_type.get('is_comingSoon'),
                'is_FSBA': listing_sub_type.get('is_FSBA'),
            })

            # Attribution info
            attribution_info = property_info.get('attributionInfo', {})
            property_data.update({
                'mlsId': attribution_info.get('mlsId'),
                'agentName': attribution_info.get('agentName'),
                'agentPhoneNumber': attribution_info.get('agentPhoneNumber'),
                'brokerName': attribution_info.get('brokerName'),
                'brokerPhoneNumber': attribution_info.get('brokerPhoneNumber'),
            })

            # Reso facts
            reso_facts = property_info.get('resoFacts', {})
            property_data.update({
                'aboveGradeFinishedArea': reso_facts.get('aboveGradeFinishedArea'),
                'accessibilityFeatures': reso_facts.get('accessibilityFeatures'),
                'additionalFeeInfo': reso_facts.get('additionalFeeInfo'),
                'additionalParcelsDescription': reso_facts.get('additionalParcelsDescription'),
                'architecturalStyle': reso_facts.get('architecturalStyle'),
                'associations': reso_facts.get('associations'),
                'associationFee': reso_facts.get('associationFee'),
                'associationAmenities': reso_facts.get('associationAmenities'),
                'associationFee2': reso_facts.get('associationFee2'),
                'associationFeeIncludes': reso_facts.get('associationFeeIncludes'),
                'associationName': reso_facts.get('associationName'),
                'associationName2': reso_facts.get('associationName2'),
                'associationPhone': reso_facts.get('associationPhone'),
                'associationPhone2': reso_facts.get('associationPhone2'),
                'basementYN': reso_facts.get('basementYN'),
                'buildingFeatures': reso_facts.get('buildingFeatures'),
                'buildingName': reso_facts.get('buildingName'),
                'appliances': reso_facts.get('appliances'),
                'atAGlanceFacts': reso_facts.get('atAGlanceFacts'),
                'attic': reso_facts.get('attic'),
                'availabilityDate': reso_facts.get('availabilityDate'),
                'basement': reso_facts.get('basement'),
                'bathrooms': reso_facts.get('bathrooms'),
                'bathroomsFull': reso_facts.get('bathroomsFull'),
                'bathroomsHalf': reso_facts.get('bathroomsHalf'),
                'bathroomsOneQuarter': reso_facts.get('bathroomsOneQuarter'),
                'bathroomsPartial': reso_facts.get('bathroomsPartial'),
                'bathroomsFloat': reso_facts.get('bathroomsFloat'),
                'bathroomsThreeQuarter': reso_facts.get('bathroomsThreeQuarter'),
                'bedrooms': reso_facts.get('bedrooms'),
                'belowGradeFinishedArea': reso_facts.get('belowGradeFinishedArea'),
                'bodyType': reso_facts.get('bodyType'),
                'builderModel': reso_facts.get('builderModel'),
                'builderName': reso_facts.get('builderName'),
                'buildingArea': reso_facts.get('buildingArea'),
                'buildingAreaSource': reso_facts.get('buildingAreaSource'),
                'canRaiseHorses': reso_facts.get('canRaiseHorses'),
                'carportParkingCapacity': reso_facts.get('carportParkingCapacity'),
                'cityRegion': reso_facts.get('cityRegion'),
                'commonWalls': reso_facts.get('commonWalls'),
                'communityFeatures': reso_facts.get('communityFeatures'),
                'compensationBasedOn': reso_facts.get('compensationBasedOn'),
                'constructionMaterials': reso_facts.get('constructionMaterials'),
                'contingency': reso_facts.get('contingency'),
                'cooling': reso_facts.get('cooling'),
                'coveredParkingCapacity': reso_facts.get('coveredParkingCapacity'),
                'cropsIncludedYN': reso_facts.get('cropsIncludedYN'),
                'cumulativeDaysOnMarket': reso_facts.get('cumulativeDaysOnMarket'),
                'developmentStatus': reso_facts.get('developmentStatus'),
                'doorFeatures': reso_facts.get('doorFeatures'),
                'electric': reso_facts.get('electric'),
                'elevation': reso_facts.get('elevation'),
                'elevationUnits': reso_facts.get('elevationUnits'),
                'entryLevel': reso_facts.get('entryLevel'),
                'entryLocation': reso_facts.get('entryLocation'),
                'exclusions': reso_facts.get('exclusions'),
                'exteriorFeatures': reso_facts.get('exteriorFeatures'),
                'feesAndDues': reso_facts.get('feesAndDues'),
                'fencing': reso_facts.get('fencing'),
                'fireplaceFeatures': reso_facts.get('fireplaceFeatures'),
                'fireplaces': reso_facts.get('fireplaces'),
                'flooring': reso_facts.get('flooring'),
                'foundationArea': reso_facts.get('foundationArea'),
                'foundationDetails': reso_facts.get('foundationDetails'),
                'frontageLength': reso_facts.get('frontageLength'),
                'frontageType': reso_facts.get('frontageType'),
                'furnished': reso_facts.get('furnished'),
                'garageParkingCapacity': reso_facts.get('garageParkingCapacity'),
                'gas': reso_facts.get('gas'),
                'greenBuildingVerificationType': reso_facts.get('greenBuildingVerificationType'),
                'greenEnergyEfficient': reso_facts.get('greenEnergyEfficient'),
                'greenEnergyGeneration': reso_facts.get('greenEnergyGeneration'),
                'greenIndoorAirQuality': reso_facts.get('greenIndoorAirQuality'),
                'greenSustainability': reso_facts.get('greenSustainability'),
                'greenWaterConservation': reso_facts.get('greenWaterConservation'),
                'hasAdditionalParcels': reso_facts.get('hasAdditionalParcels'),
                'hasAssociation': reso_facts.get('hasAssociation'),
                'hasAttachedGarage': reso_facts.get('hasAttachedGarage'),
                'hasAttachedProperty': reso_facts.get('hasAttachedProperty'),
                'hasCooling': reso_facts.get('hasCooling'),
                'hasCarport': reso_facts.get('hasCarport'),
                'hasElectricOnProperty': reso_facts.get('hasElectricOnProperty'),
                'hasFireplace': reso_facts.get('hasFireplace'),
                'hasGarage': reso_facts.get('hasGarage'),
                'hasHeating': reso_facts.get('hasHeating'),
                'hasHomeWarranty': reso_facts.get('hasHomeWarranty'),
                'hasLandLease': reso_facts.get('hasLandLease'),
                'hasOpenParking': reso_facts.get('hasOpenParking'),
                'hasRentControl': reso_facts.get('hasRentControl'),
                'hasSpa': reso_facts.get('hasSpa'),
                'hasPetsAllowed': reso_facts.get('hasPetsAllowed'),
                'hasPrivatePool': reso_facts.get('hasPrivatePool'),
                'hasView': reso_facts.get('hasView'),
                'hasWaterfrontView': reso_facts.get('hasWaterfrontView'),
                'heating': reso_facts.get('heating'),
                'highSchool': reso_facts.get('highSchool'),
                'highSchoolDistrict': reso_facts.get('highSchoolDistrict'),
                'hoaFee': reso_facts.get('hoaFee'),
                'hoaFeeTotal': reso_facts.get('hoaFeeTotal'),
                'homeType': reso_facts.get('homeType'),
                'horseAmenities': reso_facts.get('horseAmenities'),
                'horseYN': reso_facts.get('horseYN'),
                'inclusions': reso_facts.get('inclusions'),
                'incomeIncludes': reso_facts.get('incomeIncludes'),
                'interiorFeatures': reso_facts.get('interiorFeatures'),
                'irrigationWaterRightsAcres': reso_facts.get('irrigationWaterRightsAcres'),
                'irrigationWaterRightsYN': reso_facts.get('irrigationWaterRightsYN'),
                'isNewConstruction': reso_facts.get('isNewConstruction'),
                'isSeniorCommunity': reso_facts.get('isSeniorCommunity'),
                'landLeaseAmount': reso_facts.get('landLeaseAmount'),
                'landLeaseExpirationDate': reso_facts.get('landLeaseExpirationDate'),
                'laundryFeatures': reso_facts.get('laundryFeatures'),
                'leaseTerm': reso_facts.get('leaseTerm'),
                'levels': reso_facts.get('levels'),
                'listingId': reso_facts.get('listingId'),
                'listingTerms': reso_facts.get('listingTerms'),
                'lotFeatures': reso_facts.get('lotFeatures'),
                'lotSize': reso_facts.get('lotSize'),
                'lotSizeDimensions': reso_facts.get('lotSizeDimensions'),
                'livingArea': reso_facts.get('livingArea'),
                'livingAreaRange': reso_facts.get('livingAreaRange'),
                'livingAreaRangeUnits': reso_facts.get('livingAreaRangeUnits'),
                'livingQuarters': reso_facts.get('livingQuarters'),
                'mainLevelBathrooms': reso_facts.get('mainLevelBathrooms'),
                'mainLevelBedrooms': reso_facts.get('mainLevelBedrooms'),
                'marketingType': reso_facts.get('marketingType'),
                'media': reso_facts.get('media'),
                'middleOrJuniorSchool': reso_facts.get('middleOrJuniorSchool'),
                'middleOrJuniorSchoolDistrict': reso_facts.get('middleOrJuniorSchoolDistrict'),
                'municipality': reso_facts.get('municipality'),
                'numberOfUnitsInCommunity': reso_facts.get('numberOfUnitsInCommunity'),
                'numberOfUnitsVacant': reso_facts.get('numberOfUnitsVacant'),
                'offerReviewDate': reso_facts.get('offerReviewDate'),
                'onMarketDate': reso_facts.get('onMarketDate'),
                'openParkingCapacity': reso_facts.get('openParkingCapacity'),
                'otherEquipment': reso_facts.get('otherEquipment'),
                'otherFacts': reso_facts.get('otherFacts'),
                'otherParking': reso_facts.get('otherParking'),
                'otherStructures': reso_facts.get('otherStructures'),
                'ownership': reso_facts.get('ownership'),
                'ownershipType': reso_facts.get('ownershipType'),
                'parcelNumber': reso_facts.get('parcelNumber'),
                'parkingCapacity': reso_facts.get('parkingCapacity'),
                'parkingFeatures': reso_facts.get('parkingFeatures'),
                'parkName': reso_facts.get('parkName'),
                'patioAndPorchFeatures': reso_facts.get('patioAndPorchFeatures'),
                'petsMaxWeight': reso_facts.get('petsMaxWeight'),
                'poolFeatures': reso_facts.get('poolFeatures'),
                'pricePerSquareFoot': reso_facts.get('pricePerSquareFoot'),
                'propertyCondition': reso_facts.get('propertyCondition'),
                'propertySubType': reso_facts.get('propertySubType'),
                'roadSurfaceType': reso_facts.get('roadSurfaceType'),
                'roofType': reso_facts.get('roofType'),
                'rooms': reso_facts.get('rooms'),
                'roomTypes': reso_facts.get('roomTypes'),
                'securityFeatures': reso_facts.get('securityFeatures'),
                'sewer': reso_facts.get('sewer'),
                'spaFeatures': reso_facts.get('spaFeatures'),
                'specialListingConditions': reso_facts.get('specialListingConditions'),
                'stories': reso_facts.get('stories'),
                'storiesDecimal': reso_facts.get('storiesDecimal'),
                'storiesTotal': reso_facts.get('storiesTotal'),
                'structureType': reso_facts.get('structureType'),
                'subdivisionName': reso_facts.get('subdivisionName'),
                'taxAnnualAmount': reso_facts.get('taxAnnualAmount'),
                'taxAssessedValue': reso_facts.get('taxAssessedValue'),
                'tenantPays': reso_facts.get('tenantPays'),
                'topography': reso_facts.get('topography'),
                'totalActualRent': reso_facts.get('totalActualRent'),
                'utilities': reso_facts.get('utilities'),
                'vegetation': reso_facts.get('vegetation'),
                'view': reso_facts.get('view'),
                'virtualTour': reso_facts.get('virtualTour'),
                'waterSource': reso_facts.get('waterSource'),
                'waterBodyName': reso_facts.get('waterBodyName'),
                'waterfrontFeatures': reso_facts.get('waterfrontFeatures'),
                'waterView': reso_facts.get('waterView'),
                'waterViewYN': reso_facts.get('waterViewYN'),
                'windowFeatures': reso_facts.get('windowFeatures'),
                'woodedArea': reso_facts.get('woodedArea'),
                'yearBuilt': reso_facts.get('yearBuilt'),
                'yearBuiltEffective': reso_facts.get('yearBuiltEffective'),
                'zoning': reso_facts.get('zoning'),
                'zoningDescription': reso_facts.get('zoningDescription'),
                'elementarySchool': reso_facts.get('elementarySchool'),
                'elementarySchoolDistrict': reso_facts.get('elementarySchoolDistrict'),
                'listAOR': reso_facts.get('listAOR'),
            })

            # Schools
            schools = property_info.get('schools', [])
            school_data = []
            for school in schools:
                school_info = {
                    'distance': school.get('distance'),
                    'name': school.get('name'),
                    'rating': school.get('rating'),
                    'level': school.get('level'),
                    'studentsPerTeacher': school.get('studentsPerTeacher'),
                    'assigned': school.get('assigned'),
                    'grades': school.get('grades'),
                    'link': school.get('link'),
                    'type': school.get('type'),
                    'size': school.get('size'),
                    'totalCount': school.get('totalCount'),
                    'isAssigned': school.get('isAssigned'),
                }
                school_data.append(school_info)
            
            property_data['schools'] = school_data

            # Similar homes
            similar_homes = []
            collections = property_info.get('collections', {}).get('modules', [])
            for module in collections:
                if module.get('name') == 'Similar homes':
                    for detail in module.get('propertyDetails', []):
                        similar_home = {
                            'city': detail['address'].get('city'),
                            'state': detail['address'].get('state'),
                            'homeStatus': detail.get('homeStatus'),
                            'zipcode': detail['address'].get('zipcode'),
                            'price': detail.get('price'),
                            'currency': detail.get('currency'),
                            'bedrooms': detail.get('bedrooms'),
                            'bathrooms': detail.get('bathrooms'),
                            'lotSize': detail.get('lotSize'),
                            'lotAreaValue': detail.get('lotAreaValue'),
                            'lotAreaUnits': detail.get('lotAreaUnits'),
                            'latitude': detail.get('latitude'),
                            'longitude': detail.get('longitude'),
                        }
                        similar_homes.append(similar_home)
            property_data['similarHomes'] = similar_homes

            # Nearby homes
            nearby_homes = []
            for home in property_info.get('nearbyHomes', []):
                nearby_home = {
                    'url': home.get('url'),
                    'price': home.get('price'),
                    'currency': home.get('currency'),
                    'bedrooms': home.get('bedrooms'),
                    'bathrooms': home.get('bathrooms'),
                    'livingArea': home.get('livingArea'),
                    'livingAreaValue': home.get('livingAreaValue'),
                    'livingAreaUnits': home.get('livingAreaUnits'),
                    'lotSize': home.get('lotSize'),
                    'lotAreaValue': home.get('lotAreaValue'),
                    'lotAreaUnits': home.get('lotAreaUnits'),
                    'streetAddress': home.get('streetAddress'),
                    'city': home.get('city'),
                    'state': home.get('state'),
                    'zipcode': home.get('zipcode'),
                    'latitude': home.get('latitude'),
                    'longitude': home.get('longitude'),
                    'homeStatus': home.get('homeStatus'),
                    'homeType': home.get('homeType'),
                }
                nearby_homes.append(nearby_home)
            property_data['nearbyHomes'] = nearby_homes

            properties_data.append(property_data)
    return properties_data


async def main():
    scraped_data = await scrape_zillow_property(ZILLOW_URL)
    
    print("Scraped data summary:")
    print("Page title:", scraped_data["title"])
    print("JSON data found:", scraped_data["json_data_found"])
    
    if scraped_data["json_data_found"]:
        with open("scraped_data.json", "w") as json_file:
            json.dump(scraped_data["data_json"], json_file, indent=2)

if __name__ == "__main__":
    asyncio.run(main())