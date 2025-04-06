import { z } from "zod";

// ---------------- Status ----------------
const StatusSchema = z.object({
  version: z.string().optional().nullable().default(null),
  code: z.number().optional().nullable().default(null),
  msg: z.string().optional().nullable().default(null),
  total: z.number().optional().nullable().default(null),
  page: z.number().optional().nullable().default(null),
  pagesize: z.number().optional().nullable().default(null),
  responseDateTime: z.string().optional().nullable().default(null),
  transactionID: z.string().optional().nullable().default(null),
  attomId: z.number().optional().nullable().default(null),
});

// ---------------- EchoedFields ----------------
const EchoedFieldsSchema = z.object({
  jobID: z.string().optional().nullable().default(null),
  loanNumber: z.string().optional().nullable().default(null),
  preparedBy: z.string().optional().nullable().default(null),
  resellerID: z.string().optional().nullable().default(null),
  preparedFor: z.string().optional().nullable().default(null),
});

// ---------------- Identifier ----------------
const IdentifierSchema = z.object({
  Id: z.number().optional().nullable().default(null),
  fips: z.string().optional().nullable().default(null),
  apn: z.string().optional().nullable().default(null),
  attomId: z.number().optional().nullable().default(null),
});

// ---------------- Lot ----------------
const LotSchema = z.object({
  depth: z.number().optional().nullable().default(null),
  frontage: z.number().optional().nullable().default(null),
  lotNum: z.string().optional().nullable().default(null),
  lotSize1: z.number().optional().nullable().default(null),
  lotSize2: z.number().optional().nullable().default(null),
  zoningType: z.string().optional().nullable().default(null),
});

// ---------------- Area ----------------
const AreaSchema = z.object({
  countrySecSubd: z.string().optional().nullable().default(null),
  censusTractIdent: z.string().optional().nullable().default(null),
  censusBlockGroup: z.string().optional().nullable().default(null),
});

// ---------------- Location ----------------
const GeoIdV4Schema = z.object({}).catchall(z.string().or(z.array(z.string())));

const LocationSchema = z.object({
  accuracy: z.string().optional().nullable().default(null),
  latitude: z.string().optional().nullable().default(null),
  longitude: z.string().optional().nullable().default(null),
  distance: z.number().optional().nullable().default(null),
  geoid: z.string().optional().nullable().default(null),
  geoIdV4: GeoIdV4Schema.optional().nullable().default(null),
});

// ---------------- Address ----------------
const AddressSchema = z.object({
  country: z.string().optional().nullable().default(null),
  countrySubd: z.string().optional().nullable().default(null),
  line1: z.string().optional().nullable().default(null),
  line2: z.string().optional().nullable().default(null),
  locality: z.string().optional().nullable().default(null),
  matchCode: z.string().optional().nullable().default(null),
  oneLine: z.string().optional().nullable().default(null),
  postal1: z.string().optional().nullable().default(null),
  postal2: z.string().optional().nullable().default(null),
  postal3: z.string().optional().nullable().default(null),
});

// ---------------- Summary ----------------
const SummarySchema = z.object({
  absenteeInd: z.string().optional().nullable().default(null),
  propClass: z.string().optional().nullable().default(null),
  propSubType: z.string().optional().nullable().default(null),
  propType: z.string().optional().nullable().default(null),
  propertyType: z.string().optional().nullable().default(null),
  yearBuilt: z.number().optional().nullable().default(null),
  propLandUse: z.string().optional().nullable().default(null),
  propIndicator: z.number().optional().nullable().default(null),
  legal1: z.string().optional().nullable().default(null),
});

// ---------------- Utilities ----------------
const UtilitiesSchema = z.object({
  coolingType: z.string().optional().nullable().default(null),
  energyType: z.string().optional().nullable().default(null),
  heatingType: z.string().optional().nullable().default(null),
  sewerType: z.string().optional().nullable().default(null),
});

// ---------------- Sale ----------------
const SaleAmountDataSchema = z.object({
  saleAmt: z.number().optional().nullable().default(null),
  saleRecDate: z.string().optional().nullable().default(null),
  saleDisclosureType: z.number().optional().nullable().default(null),
  saleDocNum: z.string().optional().nullable().default(null),
  saleTransType: z.string().optional().nullable().default(null),
});

const SaleSchema = z.object({
  saleSearchDate: z.string().optional().nullable().default(null),
  saleTransDate: z.string().optional().nullable().default(null),
  transactionIdent: z.string().optional().nullable().default(null),
  saleAmountData: SaleAmountDataSchema.optional().nullable().default(null),
});

// ---------------- Building Size ----------------
const BuildingSizeSchema = z.object({
  bldgSize: z.number().optional().nullable().default(null),
  grossSize: z.number().optional().nullable().default(null),
  grossSizeAdjusted: z.number().optional().nullable().default(null),
  livingSize: z.number().optional().nullable().default(null),
  sizeInd: z.string().optional().nullable().default(null),
  universalSize: z.number().optional().nullable().default(null),
});

// ---------------- Building Rooms ----------------
const BuildingRoomsSchema = z.object({
  bathFixtures: z.number().optional().nullable().default(null),
  bathsFull: z.number().optional().nullable().default(null),
  bathsPartial: z.number().optional().nullable().default(null),
  bathsTotal: z.number().optional().nullable().default(null),
  beds: z.number().optional().nullable().default(null),
});

// ---------------- Building Interior ----------------
const BuildingInteriorSchema = z.object({
  bsmtSize: z.number().optional().nullable().default(null),
  bsmtFinishedPercent: z.number().optional().nullable().default(null),
  fplcCount: z.number().optional().nullable().default(null),
  fplcInd: z.string().optional().nullable().default(null),
  fplcType: z.string().optional().nullable().default(null),
});

// ---------------- Building Construction ----------------
const BuildingConstructionSchema = z.object({
  condition: z.string().optional().nullable().default(null),
  constructionType: z.string().optional().nullable().default(null),
  foundationType: z.string().optional().nullable().default(null),
  frameType: z.string().optional().nullable().default(null),
});

// ---------------- Building Parking ----------------
const BuildingParkingSchema = z.object({
  garageType: z.string().optional().nullable().default(null),
  prkgSize: z.number().optional().nullable().default(null),
  prkgType: z.string().optional().nullable().default(null),
});

// ---------------- Building Summary ----------------
const BuildingSummarySchema = z.object({
  levels: z.number().optional().nullable().default(null),
  storyDesc: z.string().optional().nullable().default(null),
  view: z.string().optional().nullable().default(null),
  viewCode: z.string().optional().nullable().default(null),
});

// ---------------- Building ----------------
const BuildingSchema = z.object({
  size: BuildingSizeSchema.optional().nullable().default(null),
  rooms: BuildingRoomsSchema.optional().nullable().default(null),
  interior: BuildingInteriorSchema.optional().nullable().default(null),
  construction: BuildingConstructionSchema.optional().nullable().default(null),
  parking: BuildingParkingSchema.optional().nullable().default(null),
  summary: BuildingSummarySchema.optional().nullable().default(null),
});

// ---------------- Owner ----------------
const OwnerNameSchema = z.object({
  fullName: z.string().optional().nullable().default(null),
  lastName: z.string().optional().nullable().default(null),
  firstNameAndMi: z.string().optional().nullable().default(null),
});

const OwnerSchema = z.object({
  corporateIndicator: z.string().optional().nullable().default(null),
  owner1: OwnerNameSchema.optional().nullable().default(null),
  owner2: z.object({}).optional().nullable().default(null),
  owner3: z.object({}).optional().nullable().default(null),
  owner4: z.object({}).optional().nullable().default(null),
  absenteeOwnerStatus: z.string().optional().nullable().default(null),
  mailingAddressOneLine: z.string().optional().nullable().default(null),
});

// ---------------- Assessed ----------------
const AssessedSchema = z.object({
  assdImprValue: z.number().optional().nullable().default(null),
  assdLandValue: z.number().optional().nullable().default(null),
  assdTtlValue: z.number().optional().nullable().default(null),
});

// ---------------- Market ----------------
const MarketSchema = z.object({
  mktImprValue: z.number().optional().nullable().default(null),
  mktLandValue: z.number().optional().nullable().default(null),
  mktTtlValue: z.number().optional().nullable().default(null),
});

// ---------------- Tax ----------------
const TaxSchema = z.object({
  taxAmt: z.number().optional().nullable().default(null),
  taxPerSizeUnit: z.number().optional().nullable().default(null),
  taxYear: z.number().optional().nullable().default(null),
  exemption: z.object({}).optional().nullable().default(null),
  exemptiontype: z.object({}).optional().nullable().default(null),
});

// ---------------- Mortgage ----------------
const MortgageFirstConcurrentSchema = z.object({
  trustDeedDocumentNumber: z.string().optional().nullable().default(null),
  amount: z.number().optional().nullable().default(null),
  lenderLastName: z.string().optional().nullable().default(null),
});

const MortgageSchema = z.object({
  FirstConcurrent: MortgageFirstConcurrentSchema.optional().nullable().default(null),
  SecondConcurrent: z.object({}).optional().nullable().default(null),
});

// ---------------- Assessment ----------------
const AssessmentSchema = z.object({
  appraised: z.object({}).optional().nullable().default(null),
  assessed: AssessedSchema.optional().nullable().default(null),
  market: MarketSchema.optional().nullable().default(null),
  tax: TaxSchema.optional().nullable().default(null),
  improvementPercent: z.number().optional().nullable().default(null),
  owner: OwnerSchema.optional().nullable().default(null),
  mortgage: MortgageSchema.optional().nullable().default(null),
});

// ---------------- Vintage ----------------
const VintageSchema = z.object({
  lastModified: z.string().optional().nullable().default(null),
  pubDate: z.string().optional().nullable().default(null),
});

// ---------------- Property ----------------
const PropertySchema = z.object({
  identifier: IdentifierSchema.optional().nullable().default(null),
  lot: LotSchema.optional().nullable().default(null),
  area: AreaSchema.optional().nullable().default(null),
  location: LocationSchema.optional().nullable().default(null),
  address: AddressSchema.optional().nullable().default(null),
  summary: SummarySchema.optional().nullable().default(null),
  utilities: UtilitiesSchema.optional().nullable().default(null),
  sale: SaleSchema.optional().nullable().default(null),
  building: BuildingSchema.optional().nullable().default(null),
  assessment: AssessmentSchema.optional().nullable().default(null),
  vintage: VintageSchema.optional().nullable().default(null),
});

// ---------------- Expanded Profile ----------------
export const BasicProfileSchema = z.object({
  status: StatusSchema.optional().nullable().default(null),
  echoed_fields: EchoedFieldsSchema.optional().nullable().default(null),
  property: z.array(PropertySchema).optional().nullable().default([]),
});

export type PropertyBasicProfile = z.infer<typeof BasicProfileSchema>;
