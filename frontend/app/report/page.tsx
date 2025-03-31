"use client";

import React, { useEffect, useState } from "react";
// import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { GeneralPropertyTab } from "@/app/report/general-property-info-tab";
import { DevelopmentInfoTab } from "@/app/report/development-info";
import { NewsArticlesTab } from "@/app/report/news-articles";
import { PrintDialog } from "@/components/print-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import "@/styles/report.css";
import Image from "next/image";
import { NavBar } from "@/components/nav-bar";
import { PropertyReportHandler } from "@/lib/report-handler";
import { fetchAttomData } from "@/lib/attom-data-fetcher";
import { fetchZoneomicsData } from "@/lib/zoneomics-data-fetcher";
import { mockPropertyData } from "@/app/report/mock-data"
import { NewsArticle } from "@/schemas/views/research-agent-schema";

export default function PropertyAnalysisDashboard() {
  const [reportHandler, setReportHandler] = useState<PropertyReportHandler | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [propertyAddress, setPropertyAddress] = useState<string | null>(null);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [developmentInfoLoading, setDevelopmentInfoLoading] = useState(false);
  const [developmentInfoError, setDevelopmentInfoError] = useState<string | null>(null);
  const [generalInfoLoaded, setGeneralInfoLoaded] = useState(false);
  const [developmentInfoLoaded, setDevelopmentInfoLoaded] = useState(false);
  
  // First useEffect: Fetch general property information
  useEffect(() => {
    async function fetchGeneralData() {
      const handler = new PropertyReportHandler();
      setReportHandler(handler);
      const propertyAddress = localStorage.getItem("propertyAddress") || "";
      setPropertyAddress(propertyAddress);
      const isDemo = localStorage.getItem("isDemo") === "true";
      
      if (isDemo) {
        console.log('DEMO');
        setTimeout(() => {
          const propertyData = mockPropertyData[propertyAddress]["General Property Information"];
          const developmentInfo = mockPropertyData[propertyAddress]["Development Information"];
          handler.setGeneralInfo(propertyData);
          handler.setDevelopmentInfo(developmentInfo);
          console.log('PROPERTY DATA', propertyData);
          console.log('DEVELOPMENT INFO', developmentInfo);
          setIsLoading(false);
          setGeneralInfoLoaded(true); // Signal that this step is complete
        }, 1500);
      } else {
        let attomSuccess = false;
        
        try {
          console.log("Fetching ATTOM data for", propertyAddress);
          await fetchAttomData(handler, propertyAddress);
          attomSuccess = true;
          
          // Get location data from ATTOM response
          const generalInfo = handler.getGeneralInfo();
          if (generalInfo) {
            const geospatialInfo = generalInfo["Property Identification & Legal Framework"]["Geospatial Information"];
            const latitude = geospatialInfo.latitude?.value as string;
            const longitude = geospatialInfo.longitude?.value as string;

            // Fetch Zoneomics data if we have coordinates
            if (latitude && longitude) {
              try {
                console.log("Found coordinates, fetching Zoneomics data:", { latitude, longitude });
                await fetchZoneomicsData(handler, latitude, longitude);
                console.log("Zoneomics data fetch completed");
              } catch (zoneomicsError) {
                console.error("Error fetching Zoneomics data (isolated):", zoneomicsError);
                // Don't set the main error state - we'll continue with just ATTOM data
              }
            } else {
              console.log("No coordinates found in ATTOM data");
            }
          } else {
            console.log("No general info found from ATTOM");
          }
        } catch (error) {
          console.error("Error in data fetching:", error);
          
          // Only set the error if ATTOM also failed
          if (!attomSuccess) {
            setError(error instanceof Error ? error.message : "An unexpected error occurred");
          }
        } finally {
          setIsLoading(false);
          setGeneralInfoLoaded(true); // Signal that this step is complete
        }
      }
    }
    fetchGeneralData();
  }, []);

  // Second useEffect: Fetch development information after general info is loaded
  useEffect(() => {
    async function fetchDevelopmentInfo() {
      if (!reportHandler || !generalInfoLoaded) {
        return; // Only proceed when generalInfoLoaded is true and reportHandler exists
      }
      
      try {
        const generalInfo = reportHandler.getGeneralInfo();
        
        // If generalInfo doesn't exist, don't proceed
        if (!generalInfo) {
          console.log("No general info available, skipping development info fetch");
          setDevelopmentInfoLoaded(true); // Signal completion even if we didn't do anything
          return;
        }
        
        // Extract required parameters from generalInfo
        let stateCode;
        let municipality;
        let zoneCode;
        
        // Try to extract state
        if (generalInfo["Property Identification & Legal Framework"] && 
            generalInfo["Property Identification & Legal Framework"]["Geospatial Information"] &&
            generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].countrySubd?.value) {
          stateCode = generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].countrySubd.value;
        } 
        
        // Try to extract municipality
        if (generalInfo["Property Identification & Legal Framework"] && 
            generalInfo["Property Identification & Legal Framework"]["Geospatial Information"] &&
            generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].munName?.value) {
          municipality = generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].munName.value;
        } else if (generalInfo["Property Identification & Legal Framework"] && 
                  generalInfo["Property Identification & Legal Framework"]["Geospatial Information"] &&
                  generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].locality?.value) {
          municipality = generalInfo["Property Identification & Legal Framework"]["Geospatial Information"].locality.value;
        }
        
        // Try to extract zone code
        if (generalInfo["Property Identification & Legal Framework"] && 
            generalInfo["Property Identification & Legal Framework"]["Regulatory Status"] &&
            generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"] &&
            generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"].siteZoningIdent?.value) {
          zoneCode = generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"].siteZoningIdent.value;
        } else if (generalInfo["Property Identification & Legal Framework"] && 
                  generalInfo["Property Identification & Legal Framework"]["Regulatory Status"] &&
                  generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"] &&
                  generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"].zoneSubType?.value) {
          zoneCode = generalInfo["Property Identification & Legal Framework"]["Regulatory Status"]["Zoning Classification"].zoneSubType.value;
        }
        
        // If any required parameter is missing, log error and return
        if (!stateCode) {
          console.error("Missing state code from property data");
          setDevelopmentInfoError("Could not determine property state");
          setDevelopmentInfoLoaded(true); // Signal completion even though we had an error
          return;
        }
        
        if (!municipality) {
          console.error("Missing municipality from property data");
          setDevelopmentInfoError("Could not determine property municipality");
          setDevelopmentInfoLoaded(true); // Signal completion even though we had an error
          return;
        }
        
        if (!zoneCode) {
          console.error("Missing zone code from property data");
          setDevelopmentInfoError("Could not determine property zone code");
          setDevelopmentInfoLoaded(true); // Signal completion even though we had an error
          return;
        }
        console.log("INPUTS: ", stateCode, municipality, zoneCode);
        // Start loading
        setDevelopmentInfoLoading(true);
        console.log('DEVELOPMENT INFO ERROR: ', developmentInfoError);
        console.log(`Fetching development info for ${municipality}, ${stateCode}, zone: ${zoneCode}`);
        
        // Call API route
        const response = await fetch('/api/development-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            municipality: municipality,
            state: stateCode,
            zone_code: zoneCode
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('DEVELOPMENT INFO: ', result);
        
        // Set development info in the report handler
        if (result.status === 'success' && result.requirements) {
          console.log('DEVELOPMENT INFO: ', result.requirements);
          reportHandler.setDevelopmentInfo(result.requirements);
        } else if (result.status === 'error') {
          throw new Error(result.error || "Unknown error fetching development info");
        }
      } catch (error) {
        console.error("Error fetching development info:", error);
        setDevelopmentInfoError(
          error instanceof Error ? error.message : "An unexpected error occurred"
        );
      } finally {
        setDevelopmentInfoLoading(false);
        setDevelopmentInfoLoaded(true); // Signal that this step is complete
      }
    }
  
    fetchDevelopmentInfo();
  }, [reportHandler, generalInfoLoaded, developmentInfoError]);
  
  // Third useEffect: Fetch news articles after development info is loaded
  useEffect(() => { 
    function getLocality(address: string) {
        const addressParts = address.split(',');
        // Extract city from second-to-last element and state from the state code in the next element
        if (addressParts.length >= 3) {
          const city = addressParts[addressParts.length - 3].trim();
          // Extract just the state code from the state+zip part
          const stateZipPart = addressParts[addressParts.length - 2].trim();
          const state = stateZipPart.split(' ')[0]; // Get just the state code
          return `${city}, ${state}`;
        }
        return address; // Return full address if parsing fails
    }

    async function fetchNewsData() {
        if (!developmentInfoLoaded || !propertyAddress) {
          return; // Only proceed when development info is loaded and property address exists
        }
        
        try {
          setNewsLoading(true);
          const locality = getLocality(propertyAddress);
          const response = await fetch('/api/agents', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: locality }),
          });
          const data = await response.json();
          console.log(data);
          if (data.status === 'success' && data.output && data.output.news) {
            setNewsArticles(data.output.news);
          } else {
            setNewsArticles([]);
            // Optional: Set error if the response format isn't as expected
            if (data.status === 'failed') {
              setNewsError(data.error || "Failed to retrieve news articles");
            }
          }
        } catch (error) {
          console.error("Error fetching news articles:", error);
          setNewsError(error instanceof Error ? error.message : "An unexpected error occurred");
        } finally {
          setNewsLoading(false);
        }
    }
  
    fetchNewsData();
  }, [propertyAddress, developmentInfoLoaded]);

  if (error) {
    return (
      <main className="property-demo min-h-screen pt-16">
        <NavBar />
        <div className="container mx-auto py-12 px-4 md:px-8">
          <p>Error: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="property-demo min-h-screen pt-16">
      <NavBar />
      <div className="container mx-auto py-12 px-4 md:px-8 space-y-12">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">Property Assessment Report</h1>
            <PrintDialog reportHandler={reportHandler!} />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-5 w-5" />
            <p className="text-lg">{propertyAddress}</p>
          </div>

          {/* Image Carousel */}
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uZ7J3h8v7RkCQvbW4zOpGQWPKISqu1.png"
                      alt="Exterior view of the property showing modern two-story residential building"
                      fill
                      style={{ objectFit: "cover" }}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nbZliwuRjp9a7cwyA8vUFEErMJfxOt.png"
                      alt="Interior view showing home office and living room spaces"
                      fill
                      style={{ objectFit: "cover" }}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZU9GzXZxEpWtz4PKmrPWa5s1uuBZRC.png"
                      alt="Map view of the property location"
                      fill
                      style={{ objectFit: "cover" }}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CarouselItem>
                {/* Duplicate images for scrollability */}
                <CarouselItem>
                  <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uZ7J3h8v7RkCQvbW4zOpGQWPKISqu1.png"
                      alt="Exterior view of the property"
                      fill
                      style={{ objectFit: "cover" }}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nbZliwuRjp9a7cwyA8vUFEErMJfxOt.png"
                      alt="Interior view of the property"
                      fill
                      style={{ objectFit: "cover" }}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZU9GzXZxEpWtz4PKmrPWa5s1uuBZRC.png"
                      alt="Map view of the property location"
                      fill
                      style={{ objectFit: "cover" }}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardDescription>Parcel ID</CardDescription>
                <CardTitle className="text-xl">#888-123456</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total Area</CardDescription>
                <CardTitle className="text-xl">2.11 acres</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Assessed Value (2024)</CardDescription>
                <CardTitle className="text-xl">$4.2M</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="property" className="space-y-8">
          <TabsList className="tabs-list">
            <TabsTrigger value="property">General Property Information</TabsTrigger>
            <TabsTrigger value="development">Development Info</TabsTrigger>
            <TabsTrigger value="news">News Articles</TabsTrigger>
          </TabsList>

          <TabsContent value="property" className="m-0" data-section="property">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-4">Detailed Property Analysis</h2>
              <p className="text-muted-foreground">
                Comprehensive assessment of physical characteristics, zoning requirements, and development potential.
              </p>
            </div>
            <GeneralPropertyTab reportHandler={reportHandler} parentLoading={isLoading} />
          </TabsContent>

          <TabsContent value="development" className="m-0" data-section="development">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Development Information</h2>
              <p className="text-muted-foreground">
                Detailed overview of zoning parameters, building requirements, and development standards.
              </p>
            </div>
            <DevelopmentInfoTab reportHandler={reportHandler!} parentLoading={isLoading || developmentInfoLoading} />
          </TabsContent>

          <TabsContent value="news" className="m-0" data-section="news">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-4">News Articles</h2>
              <p className="text-muted-foreground">
                Latest news articles and updates about the area.
              </p>
            </div>
            <NewsArticlesTab newsArticles={newsArticles} newsLoading={newsLoading} newsError={newsError} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}