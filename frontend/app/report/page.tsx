"use client";

import React, { useEffect, useState } from "react";
// import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { GeneralPropertyTab } from "@/app/report/general-property-info-tab";
import { GeneralPropertyFallbackTab } from "@/components/general-property-info-fallback";
import { DevelopmentInfoTab } from "@/app/report/development-info";
import { DevelopmentInfoFallbackTab } from "@/components/development-info-fallback";
import { MarketResearchTab } from "@/app/report/market-research";
import { NewsArticlesTab } from "@/app/report/news-articles";
import { NewsArticlesFallbackTab } from "@/components/news-articles-fallback";
import { PrintDialog } from "@/components/print-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
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
import { useGeneralPropertyInfo } from "@/hooks/useGeneralPropertyInfo";
import { useDevelopmentInfo } from "@/hooks/useDevelopmentInfo";
import { useNewsArticles } from "@/hooks/useNewsArticles";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { Button } from "@/components/ui/button";
import SubmitEvaluationDialog from "@/components/submit-evaluation-dialog";
import Link from "next/link";

export default function PropertyAnalysisDashboard() {
  const [reportHandler, setReportHandler] = useState<PropertyReportHandler | null>(null);
  const [propertyAddress, setPropertyAddress] = useState<string | null>(null);
  const [hasFeedback, setHasFeedback] = useState<boolean>(false);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState<boolean>(false);
  const [previousAddress, setPreviousAddress] = useState<string | null>(null);
  const [isAddressSupported, setIsAddressSupported] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { generalPropertyInfoLoading, generalPropertyInfoError } = useGeneralPropertyInfo(reportHandler);
  const { developmentInfoLoading, developmentInfoError } = useDevelopmentInfo(reportHandler, generalPropertyInfoError);
  const { newsArticles, newsArticlesLoading, newsArticlesError } = useNewsArticles(reportHandler, generalPropertyInfoError);
  const { images, imagesLoading, imagesError } = usePropertyImages(propertyAddress);
  
  // First useEffect: Fetch general property information
  useEffect(() => {
    async function fetchGeneralData() {
      const address = localStorage.getItem("propertyAddress");
      if (!address) {
        return;
      }

      const isAddressSupported = localStorage.getItem("isAddressSupported");
      if (isAddressSupported === "false") {
        setIsAddressSupported(false);
      } else {
        setIsAddressSupported(true);
      }
      setIsLoading(false);
      
      // Check if this is a new property search
      if (previousAddress && previousAddress !== address) {
        // Clear all property-related data
        localStorage.removeItem("feedback");
        localStorage.removeItem("propertyData");
        localStorage.removeItem("developmentInfo");
        localStorage.removeItem("newsArticles");
        localStorage.removeItem("county");
        localStorage.removeItem("state");
        // Any other property-specific data that should be cleared
        
        // Update feedback state immediately
        setHasFeedback(false);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event("feedbackUpdated"));
        
        // Reset the report handler to force new data fetching
        setReportHandler(null);
      }
      
      setPreviousAddress(address);
      setPropertyAddress(address);
      if (!reportHandler) {
        const handler = new PropertyReportHandler();
        setReportHandler(handler);
      }
      
      // Check if feedback exists in localStorage
      const feedback = localStorage.getItem("feedback");
      setHasFeedback(!!feedback);
    }
    fetchGeneralData();
  }, [previousAddress, reportHandler]);

  // Add this useEffect to listen for changes to localStorage
  useEffect(() => {
    // Function to check for feedback in localStorage
    const checkFeedback = () => {
      const feedback = localStorage.getItem("feedback");
      setHasFeedback(!!feedback);
    };

    // Initial check
    checkFeedback();

    // Set up event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "feedback") {
        checkFeedback();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab updates
    const handleCustomEvent = () => {
      checkFeedback();
    };

    window.addEventListener("feedbackUpdated", handleCustomEvent);

    // Clean up
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("feedbackUpdated", handleCustomEvent);
    };
  }, []);

  const handleSubmitEvaluation = () => {
    // Close the modal
    setIsEvalModalOpen(false);
  };

  const handleEvaluationButtonClick = () => {
    // Check for feedback directly from localStorage when button is clicked
    const feedback = localStorage.getItem("feedback");
    setHasFeedback(!!feedback);
    setIsEvalModalOpen(true);
  };

  const ImagesError = () => {
    return (
    <Alert variant="default">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No images found</AlertTitle>
        <AlertDescription>No images found for this property.</AlertDescription>
      </Alert>
    )
  }

  const ImagesLoading = () => {
    return (
      <Alert variant="default">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Loading</AlertTitle>
        <AlertDescription>Loading images for this property...</AlertDescription>
      </Alert>
    )
  }

  return (
    <main className="property-demo min-h-screen pt-16">
      <NavBar />
      <div className="container mx-auto py-12 px-4 md:px-8 space-y-12">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">Property Assessment Report</h1>
            <div className="flex items-center gap-3">
              <Button 
                variant={hasFeedback ? "default" : "outline"} 
                className={hasFeedback ? "bg-orange-500 hover:bg-orange-600" : ""}
                onClick={handleEvaluationButtonClick}
              >
                Submit Evaluation
              </Button>
              <PrintDialog reportHandler={reportHandler!} />
            </div>
          </div>
          
          {/* Use the new component */}
          <SubmitEvaluationDialog
            open={isEvalModalOpen}
            onOpenChange={setIsEvalModalOpen}
            hasFeedback={hasFeedback}
            onSubmit={handleSubmitEvaluation}
          />
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-5 w-5" />
            <p className="text-lg">{propertyAddress}</p>
          </div>

          {/* Image Carousel */}
          <div className="relative">
            {imagesError && <ImagesError />}
            {imagesLoading && <ImagesLoading />}
            {!imagesError && !imagesLoading && (
              <Carousel className="w-full">
                <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        style={{ objectFit: "cover" }}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white text-sm">
                          Image source: {image.source}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardDescription>Parcel ID</CardDescription>
                {/* <CardTitle className="text-xl">#888-123456</CardTitle> */}
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total Area</CardDescription>
                {/* <CardTitle className="text-xl">2.11 acres</CardTitle> */}
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Assessed Value (2024)</CardDescription>
                {/* <CardTitle className="text-xl">$4.2M</CardTitle> */}
              </CardHeader>
            </Card>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}

        {!isLoading && (
          <Tabs defaultValue={isAddressSupported ? "property" : "market_research"} className="space-y-8">
            <TabsList className="tabs-list">
              <TabsTrigger value="property">General Property Information</TabsTrigger>
              <TabsTrigger value="development">Development Info</TabsTrigger>
              <TabsTrigger value="market_research">Market Research</TabsTrigger>
              <TabsTrigger value="news">News Articles</TabsTrigger>
            </TabsList>

          <TabsContent value="property" className="m-0" data-section="property">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Detailed Property Analysis</h2>
              {isAddressSupported ? (
                <p className="text-muted-foreground">
                  Comprehensive assessment of physical characteristics, zoning requirements, and development potential.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Oh no! This address is not currently available. Please request this location to be notified when it is ready.
                </p>
              )}
            </div>
            {isAddressSupported ? (
              <GeneralPropertyTab reportHandler={reportHandler} generalPropertyInfoLoading={generalPropertyInfoLoading} generalPropertyInfoError={generalPropertyInfoError} />
            ) : (
              <GeneralPropertyFallbackTab />
            )}
          </TabsContent>

          <TabsContent value="development" className="m-0" data-section="development">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Development Information</h2>
              {isAddressSupported ? (
                <p className="text-muted-foreground">
                  Detailed overview of zoning parameters, building requirements, and development standards.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Oh no! This address is not currently available. Please request this location to be notified when it is ready.
                </p>
              )}
            </div>
            {isAddressSupported ? (
              <DevelopmentInfoTab reportHandler={reportHandler!} developmentInfoLoading={developmentInfoLoading} developmentInfoError={developmentInfoError} />
            ) : (
              <DevelopmentInfoFallbackTab />
            )}
          </TabsContent>

          <TabsContent value="market_research" className="m-0" data-section="market_research">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Market Research</h2>
              <p className="text-muted-foreground">
                Market research and analysis of the area, compiled from US Census data and powered by <Link href="https://www.esri.com/en-us/home">Esri</Link>.
              </p>
            </div>
            {propertyAddress && <MarketResearchTab reportHandler={reportHandler!} propertyAddress={propertyAddress} />}
          </TabsContent>

          <TabsContent value="news" className="m-0" data-section="news">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">News Articles</h2>
              {isAddressSupported ? (
                <p className="text-muted-foreground">
                  Latest news articles and updates about the area.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Oh no! This address is not currently available. Please request this location to be notified when it is ready.
                </p>
              )}
            </div>
            {isAddressSupported ? (
              <NewsArticlesTab newsArticles={newsArticles} newsLoading={newsArticlesLoading} newsError={newsArticlesError} />
            ) : (
              <NewsArticlesFallbackTab />
            )}
          </TabsContent>
        </Tabs>
        )}
      </div>
    </main>
  );
}