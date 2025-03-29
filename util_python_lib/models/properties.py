from __future__ import annotations
from typing import List, Optional, Any
from pydantic import BaseModel

# -----------------------------------------------------
# Final Endpoint Models (Top-Level Response Models)
# -----------------------------------------------------

class BuildingPermitsResponse(BaseModel):
    status: Status
    property: List[PropertyBuildingPermits]

class DetailOwnerResponse(BaseModel):
    status: Status
    property: List[PropertyDetailOwner]

class ExpandedProfileResponse(BaseModel):
    status: Status
    echoed_fields: EchoedFields
    property: List[PropertyExpandedProfile]

# -----------------------------------------------------
# Common Models
# -----------------------------------------------------

class Status(BaseModel):
    version: str
    code: int
    msg: str
    total: int
    page: int
    pagesize: int
    responseDateTime: str
    transactionID: str
    attomId: int

class GeoIdV4(BaseModel):
    CO: str
    CS: str
    DB: str
    N1: str
    N2: str
    N4: str
    SB: str
    ZI: str

class Location(BaseModel):
    accuracy: str
    elevation: Optional[Any] = None
    latitude: str
    longitude: str
    distance: float
    geoId: Optional[str] = None
    geoIdV4: Optional[GeoIdV4] = None

class Vintage(BaseModel):
    lastModified: str
    pubDate: str

# -----------------------------------------------------
# Supporting Models for property/buildingpermits Endpoint
# -----------------------------------------------------

class IdentifierBuildingPermits(BaseModel):
    Id: int
    fips: str
    apn: str
    apnOrig: Optional[Any] = None
    attomId: int

class LotBuildingPermits(BaseModel):
    lotSize1: float

class AddressModel(BaseModel):
    bldgName: Optional[Any] = None
    country: str
    countrySubd: str
    line1: str
    line2: str
    locality: str
    matchCode: str
    oneLine: str
    postal1: str
    postal2: str
    postal3: str

class SummaryBuildingPermits(BaseModel):
    propClass: str
    propSubType: str
    propType: str
    propertyType: str
    yearBuilt: int
    propLandUse: str
    propIndicator: int

class BuildingSize(BaseModel):
    universalSize: float

class BuildingRooms(BaseModel):
    bathsTotal: float
    beds: int

class BuildingBuildingPermits(BaseModel):
    size: BuildingSize
    rooms: BuildingRooms

class BuildingPermitItem(BaseModel):
    effectiveDate: str
    permitNumber: str
    status: str
    description: str
    type: str
    projectName: str
    jobValue: int
    fees: float
    businessName: str
    homeOwnerName: str
    classifiers: List[str]

class PropertyBuildingPermits(BaseModel):
    identifier: IdentifierBuildingPermits
    lot: LotBuildingPermits
    address: AddressModel
    location: Location
    summary: SummaryBuildingPermits
    building: BuildingBuildingPermits
    buildingPermits: List[BuildingPermitItem]
    vintage: Vintage

# -----------------------------------------------------
# Supporting Models for property/detailowner Endpoint
# -----------------------------------------------------

class IdentifierDetailOwner(BaseModel):
    Id: int
    fips: str
    apn: str
    apnOrig: Optional[Any] = None
    attomId: int

class LotDetailOwner(BaseModel):
    depth: Optional[Any] = None
    frontage: Optional[Any] = None
    lotnum: str
    lotsize1: float
    lotsize2: int
    lottype: Optional[Any] = None
    poolind: Optional[Any] = None
    pooltype: str

class AreaDetailOwner(BaseModel):
    blockNum: Optional[Any] = None
    loctype: str
    countrysecsubd: str
    countyuse1: str
    muncode: str
    munname: str
    srvyRange: Optional[Any] = None
    srvySection: Optional[Any] = None
    srvyTownship: Optional[Any] = None
    subdname: str
    subdtractnum: Optional[Any] = None
    taxcodearea: str

# Reusing AddressModel for detailowner.
class AddressDetailOwner(AddressModel):
    pass

class SummaryDetailOwner(BaseModel):
    absenteeInd: str
    propclass: str
    propsubtype: str
    proptype: str
    propertyType: str
    yearbuilt: int
    propLandUse: str
    propIndicator: str
    legal1: str
    legal2: Optional[Any] = None
    legal3: Optional[Any] = None

class UtilitiesDetailOwner(BaseModel):
    coolingtype: str
    energyType: Optional[Any] = None
    heatingfuel: str
    heatingtype: str
    sewertype: Optional[Any] = None
    watertype: Optional[Any] = None

class BuildingSizeDetailOwner(BaseModel):
    bldgsize: int
    grosssize: int
    grosssizeadjusted: int
    groundfloorsize: Optional[Any] = None
    livingsize: int
    sizeInd: str
    universalsize: int

class BuildingRoomsDetailOwner(BaseModel):
    bathfixtures: Optional[Any] = None
    baths1qtr: Optional[Any] = None
    baths3qtr: Optional[Any] = None
    bathscalc: Optional[Any] = None
    bathsfull: int
    bathshalf: Optional[Any] = None
    bathspartial: int
    bathstotal: float
    beds: int
    roomsTotal: Optional[Any] = None

class BuildingInteriorDetailOwner(BaseModel):
    bsmtsize: Optional[Any] = None
    bsmttype: Optional[Any] = None
    floors: Optional[Any] = None
    fplccount: int
    fplcind: str
    fplctype: str

class BuildingConstructionDetailOwner(BaseModel):
    condition: str
    constructiontype: Optional[Any] = None
    foundationtype: str
    frameType: Optional[Any] = None
    roofcover: Optional[Any] = None
    roofShape: Optional[Any] = None
    wallType: str

class BuildingParkingDetailOwner(BaseModel):
    garagetype: Optional[Any] = None
    prkgSize: Optional[Any] = None
    prkgSpaces: Optional[Any] = None
    prkgType: Optional[Any] = None

class BuildingSummaryDetailOwner(BaseModel):
    archStyle: Optional[Any] = None
    bldgsNum: int
    bldgType: str
    imprType: str
    levels: int
    mobileHomeInd: Optional[Any] = None
    quality: str
    storyDesc: str
    unitsCount: Optional[Any] = None
    view: str
    yearbuilteffective: Optional[Any] = None

class BuildingDetailOwner(BaseModel):
    size: BuildingSizeDetailOwner
    rooms: BuildingRoomsDetailOwner
    interior: BuildingInteriorDetailOwner
    construction: BuildingConstructionDetailOwner
    parking: BuildingParkingDetailOwner
    summary: BuildingSummaryDetailOwner

# For owner, using dicts for now.
class OwnerDetailOwner(BaseModel):
    corporateindicator: str
    owner1: dict
    owner2: dict
    owner3: dict
    owner4: dict
    owneretalindicator: Optional[Any] = None
    careofname: Optional[Any] = None
    ownerrelationshiprightscode: str
    ownerrelationshiptype: Optional[Any] = None
    partialinterestindicator: Optional[Any] = None
    absenteeownerstatus: str
    mailingaddressoneline: str

class PropertyDetailOwner(BaseModel):
    identifier: IdentifierDetailOwner
    lot: LotDetailOwner
    area: AreaDetailOwner
    address: AddressDetailOwner
    location: Location
    summary: SummaryDetailOwner
    utilities: UtilitiesDetailOwner
    building: BuildingDetailOwner
    owner: OwnerDetailOwner
    vintage: Vintage

# -----------------------------------------------------
# Supporting Models for property/expandedprofile Endpoint
# -----------------------------------------------------

class IdentifierExpandedProfile(BaseModel):
    Id: int
    fips: str
    apn: str
    multiApn: Optional[Any] = None
    attomId: int

class LotExpandedProfile(BaseModel):
    depth: Optional[Any] = None
    frontage: Optional[Any] = None
    lotNum: str
    lotSize1: float
    lotSize2: float
    zoningType: str
    siteZoningIdent: str
    poolType: str

class AreaExpandedProfile(BaseModel):
    blockNum: Optional[Any] = None
    locType: str
    countrySecSubd: str
    countyUse1: str
    munCode: str
    munName: str
    srvyRange: Optional[Any] = None
    srvySection: Optional[Any] = None
    srvyTownship: Optional[Any] = None
    subdName: str
    subdTractNum: Optional[Any] = None
    taxCodeArea: str
    censusTractIdent: str
    censusBlockGroup: str

class AddressExpandedProfile(BaseModel):
    bldgName: Optional[Any] = None
    country: str
    countrySubd: str
    line1: str
    line2: str
    locality: str
    matchCode: str
    oneLine: str
    postal1: str
    postal2: str
    postal3: str
    stateFips: str
    unitNumberIdent: Optional[Any] = None
    situsHouseNumber: str
    situsDirection: Optional[Any] = None
    situsStreetName: str
    situsAddressSuffix: str
    situsPostDirection: Optional[Any] = None
    situsUnitPrefix: Optional[Any] = None
    situsUnitValue: Optional[Any] = None

class SummaryExpandedProfile(BaseModel):
    archStyle: Optional[Any] = None
    absenteeInd: str
    propClass: str
    propSubType: str
    propType: str
    propertyType: str
    yearBuilt: int
    propLandUse: str
    propIndicator: int
    legal1: str
    descriptionExt: Optional[Any] = None
    codeExt: Optional[Any] = None
    quitClaimFlag: str
    REOflag: str
    dateOfLastQuitClaim: Optional[Any] = None

class UtilitiesExpandedProfile(BaseModel):
    coolingType: str
    energyType: Optional[Any] = None
    heatingFuel: str
    heatingType: str
    sewerType: Optional[Any] = None

class SaleAmount(BaseModel):
    saleAmt: float
    saleCode: Optional[Any] = None
    saleRecDate: str
    saleDisclosureType: int
    saleDocType: Optional[Any] = None
    saleDocNum: str
    saleTransType: str

class SaleCalculation(BaseModel):
    pricePerBed: float
    pricePerSizeUnit: float

class SaleExpandedProfile(BaseModel):
    sequenceSaleHistory: int
    sellerName: str
    saleSearchDate: str
    saleTransDate: str
    transactionIdent: str
    amount: SaleAmount
    calculation: SaleCalculation

class BuildingSizeExpandedProfile(BaseModel):
    bldgSize: float
    grossSize: float
    grossSizeAdjusted: float
    groundFloorSize: Optional[Any] = None
    livingSize: float
    sizeInd: str
    universalSize: float
    atticSize: Optional[Any] = None

class BuildingRoomsExpandedProfile(BaseModel):
    bathFixtures: Optional[Any] = None
    baths1qtr: Optional[Any] = None
    baths3qtr: Optional[Any] = None
    bathsCalc: Optional[Any] = None
    bathsFull: int
    bathsHalf: Optional[Any] = None
    bathsPartial: int
    bathsTotal: float
    beds: int
    roomsTotal: Optional[Any] = None

class BuildingInteriorExpandedProfile(BaseModel):
    bsmtSize: Optional[Any] = None
    bsmtType: Optional[Any] = None
    bsmtFinishedPercent: Optional[Any] = None
    floors: Optional[Any] = None
    fplcCount: int
    fplcInd: str
    fplcType: str

class BuildingConstructionExpandedProfile(BaseModel):
    condition: str
    constructionType: Optional[Any] = None
    foundationType: str
    frameType: Optional[Any] = None
    roofCover: Optional[Any] = None
    roofShape: Optional[Any] = None
    wallType: str
    propertyStructureMajorImprovementsYear: Optional[Any] = None
    buildingShapeType: Optional[Any] = None
    buildingShapeDescription: Optional[Any] = None

class BuildingParkingExpandedProfile(BaseModel):
    garageType: Optional[Any] = None
    prkgSize: Optional[Any] = None
    prkgSpaces: Optional[Any] = None
    prkgType: Optional[Any] = None

class BuildingSummaryExpandedProfile(BaseModel):
    levels: int
    storyDesc: str
    unitsCount: Optional[Any] = None
    view: str
    viewCode: str

class BuildingExpandedProfile(BaseModel):
    size: BuildingSizeExpandedProfile
    rooms: BuildingRoomsExpandedProfile
    interior: BuildingInteriorExpandedProfile
    construction: BuildingConstructionExpandedProfile
    parking: BuildingParkingExpandedProfile
    summary: BuildingSummaryExpandedProfile

class AssessmentAppraised(BaseModel):
    apprImprValue: Optional[Any] = None
    apprLandValue: Optional[Any] = None
    apprTtlValue: Optional[Any] = None

class AssessmentAssessed(BaseModel):
    assdImprValue: float
    assdLandValue: float
    assdTtlValue: float

class AssessmentMarket(BaseModel):
    mktImprValue: float
    mktLandValue: float
    mktTtlValue: float

class AssessmentTaxExemption(BaseModel):
    ExemptionAmount1: Optional[Any] = None
    ExemptionAmount2: Optional[Any] = None
    ExemptionAmount3: Optional[Any] = None
    ExemptionAmount4: Optional[Any] = None
    ExemptionAmount5: Optional[Any] = None

class AssessmentTaxExemptionType(BaseModel):
    Additional: Optional[Any] = None
    Homeowner: Optional[Any] = None
    Disabled: Optional[Any] = None
    Senior: Optional[Any] = None
    Veteran: Optional[Any] = None
    Widow: Optional[Any] = None

class AssessmentTax(BaseModel):
    taxAmt: Optional[Any] = None
    taxPerSizeUnit: Optional[Any] = None
    taxYear: float
    exemption: AssessmentTaxExemption
    exemptiontype: AssessmentTaxExemptionType

class AssessmentExpandedProfile(BaseModel):
    appraised: AssessmentAppraised
    assessed: AssessmentAssessed
    market: AssessmentMarket
    tax: AssessmentTax
    improvementPercent: int

# For owner, using dicts here – refine later if needed.
class OwnerExpandedProfile(BaseModel):
    corporateIndicator: str
    type: str
    description: str
    ownerAfterSpouse: Optional[Any] = None
    owner1: dict
    owner2: dict
    owner3: dict
    owner4: dict
    absenteeOwnerStatus: str
    mailingAddressOneLine: str

class MortgageFirstConcurrent(BaseModel):
    trustDeedDocumentNumber: str
    ident: str
    amount: float
    lenderLastName: str
    companyCode: str
    date: str
    loanTypeCode: str
    deedType: str
    interestRateType: str
    equityFlag: str

class MortgageSecondConcurrent(BaseModel):
    trustDeedDocumentNumber: str
    ident: str
    amount: float
    lenderLastName: str
    companyCode: str
    date: str
    loanTypeCode: str
    term: str
    dueDate: str

class MortgageTitle(BaseModel):
    companyName: str
    companyCode: Optional[Any] = None

class MortgageExpandedProfile(BaseModel):
    FirstConcurrent: MortgageFirstConcurrent
    SecondConcurrent: MortgageSecondConcurrent
    Title: MortgageTitle

class PropertyExpandedProfile(BaseModel):
    identifier: IdentifierExpandedProfile
    lot: LotExpandedProfile
    area: AreaExpandedProfile
    address: AddressExpandedProfile
    location: Location
    summary: SummaryExpandedProfile
    utilities: UtilitiesExpandedProfile
    sale: SaleExpandedProfile
    building: BuildingExpandedProfile
    assessment: AssessmentExpandedProfile
    owner: OwnerExpandedProfile
    mortgage: MortgageExpandedProfile
    vintage: Vintage

class EchoedFields(BaseModel):
    jobID: str
    loanNumber: str
    preparedBy: str
    resellerID: str
    preparedFor: str

# -----------------------------------------------------
# End of Pydantic Models File
# -----------------------------------------------------

if __name__ == "__main__":
    print("Pydantic models loaded successfully.")