hints = {
    "permitted_use_matrix": {
        "extraction_hint": """
        If looking at a title list, the title is usually something to do with zoning or land use. Its also usually a later title, towards the end of the book.
        If looking for sections, look for sections that are titled "Permitted Uses", "Use Table", "Land Use Matrix", "Zone Districts", or similar.
        """,
        "additional_information": """
        You are looking for the permitted use matrix. This is a table that shows the permitted uses for each zone district. Here is an example of the expected output:
    <PERMITTED_USE_MATRIX_EXAMPLE>
        (A)   R-1 Residential.
      (1)   Permitted uses.
         (a)   Single-family dwellings;
         (b)   Public and parochial school;
         (c)   Parks and playgrounds;
         (d)   Churches;
         (e)   Essential services; and
         (f)   Accessory uses.
      (2)   Special exceptions (§ 151.089).
         (a)   Nursery schools;
         (b)   Hospitals, clinics, and nursing homes;
         (c)   Public utility buildings;
         (d)   Swimming pools;
         (e)   Fire stations;
         (f)   Municipal buildings and libraries;
         (g)   Planned unit residential projects;
         (h)   Cemeteries;
         (i)   Private clubs;
         (j)   Parking lots;
         (k)   Golf courses;
         (l)   Home occupations;
         (m)   Funeral homes; and
         (n)   Manufactured housing and mobile homes.
   (B)   R-2 Residential.
      (1)   Permitted uses.
         (a)   Single-family dwellings;
         (b)   Two-family dwellings;
         (c)   Public schools;
         (d)   Public parks and playgrounds;
         (e)   Churches;
         (f)   Essential uses;
         (g)   Accessory uses; and
         (h)   Parochial schools.
      (2)   Special exceptions (§ 151.089).
         (a)   Nursery schools;
         (b)   Hospitals, clinics, and nursing homes;
         (c)   Public utility buildings;
         (d)   Swimming pools;
         (e)   Fire stations;
         (f)   Municipal buildings and libraries;
         (g)   Planned unit residential projects;
         (h)   Private clubs;
         (i)   Parking lots;
         (j)   Home occupations;
         (k)   Funeral homes;
         (l)   Manufactured housing and mobile homes;
         (m)   Condominiums; and
         (n)   Cooperatives.
   (C)   R-3 Residential.
      (1)   Permitted uses.
         (a)   Single-family dwelling;
         (b)   Two-family dwelling;
         (c)   Multiple-family dwellings;
         (d)   Public and parochial schools;
         (e)   Churches;
         (f)   Public parks and playgrounds;
         (g)   Essential services; and
         (h)   Accessory uses.
      (2)   Special exceptions.
         (a)   Nursery schools;
         (b)   Hospitals, clinics, and nursing homes;
         (c)   Public utility buildings;
         (d)   Swimming pools;
         (e)   Fire stations;
         (f)   Municipal buildings and libraries;
         (g)   Planned unit residential projects;
         (h)   Private clubs;
         (i)   Parking lots;
         (j)   Home occupations;
         (k)   Funeral homes;
         (l)   Manufactured housing and mobile homes;
         (m)   Condominiums; and
         (n)   Cooperatives.
   (D)   B-1 Business.
      (1)   Permitted uses.
         (a)   Retail businesses;
         (b)   Eating establishments;
         (c)   Offices and banks;
         (d)   Personal and professional services;
         (e)   Fire station and municipal buildings;
         (f)   Public parks;
         (g)   Parking lots;
         (h)   Essential services; and
         (i)   Accessory uses.
      (2)   Special exceptions.
         (a)   Theaters;
         (b)   Planned unit, business project;
         (c)   Auto sales, service and repair;
         (d)   Wholesale business;
         (e)   Hotels and motels;
         (f)   Commercial schools;
         (g)   Commercial recreation;
         (h)   Public utility buildings;
         (i)   Printing shops;
         (j)   Churches;
         (k)   Schools, public and parochial;
         (l)   Multiple-family dwellings;
         (m)   Funeral homes;
         (n)   Any eating or drinking establishment selling any type of alcoholic beverage; and
         (o)   Manufactured housing and mobile homes.
   (E)   B-2 Business.
      (1)   Permitted uses.
         (a)   Retail business;
         (b)   Eating establishments;
         (c)   Offices and banks;
         (d)   Personal and professional services;
         (e)   Printing shops;
         (f)   Public utility buildings;
         (g)   Parking lots;
         (h)   Public parks;
         (i)   Accessory uses;
         (j)   Essential uses;
         (k)   Auto sales, service and repair;
         (l)   Hotels and motels; and
         (m)   Cleaners and laundries.
      (2)   Special exceptions.
         (a)   Theaters;
         (b)   Supply yards;
         (c)   Commercial recreation;
         (d)   Planned unit business projects;
         (e)   Dairies;
         (f)   Wholesale businesses;
         (g)   Warehouses;
         (h)   Commercial schools;
         (i)   Churches;
         (j)   Schools, public and parochial;
         (k)   Hospitals, clinics, and nursing homes;
         (l)   Mobile home parks;
         (m)   Funeral homes;
         (n)   Any eating or drinking establishment selling any type of alcoholic beverage; and
         (o)   Manufactured housing and mobile homes.
   (F)   I-1 Industrial.
      (1)   Permitted uses.
         (a)   Research and testing laboratories;
         (b)   Offices;
         (c)   Warehouses;
         (d)   Parking lots;
         (e)   Light industrial;
         (f)   Essential services;
         (g)   Accessory uses;
         (h)   Wholesale businesses;
         (i)   Public parks;
         (j)   Mining or quarrying operations, including on-site sale of products;
         (k)   Concrete or asphalt plant operations, including on-site sale of products; and
         (l)   Mineral processing, storage, and distribution, including on-site sale of products.
      (2)   Special exceptions (§ 151.089).
         (a)   Motels;
         (b)   Planned unit industrial projects;
         (c)   Restaurants;
         (d)   Truck and railroad terminals;
         (e)   Supply yards;
         (f)   Fire stations and municipal buildings;
         (g)   Water and sewage treatment plants; and
         (h)   Manufactured housing and mobile homes.
   (G)   C-1 Conservation.
      (1)   Permitted uses.
         (a)   Public parks and playgrounds;
         (b)   Game preserves;
         (c)   Essential services; and
         (d)   Accessory uses.
      (2)   Special exceptions.
         (a)   Single-family dwellings;
         (b)   Riding stables;
         (c)   Parking lots;
         (d)   Swimming pools;
         (e)   Cemeteries;
         (f)   Golf courses;
         (g)   Water and sewage treatment plants;
         (h)   Public and parochial schools; and
         (i)   Manufactured housing and homes.

        </PERMITTED_USE_MATRIX_EXAMPLE>/PERMITTED_USE_MATRIX_EXAMPLE>

        Note: If you are unable to find something similar to this, return NULL. You must be extremely confident that you have found the permitted use matrix before returning it. 
        """,      
        "expected_output": """
        Return the permitted use matrix
        """

    }
}