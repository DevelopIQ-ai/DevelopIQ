/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Building2, MapPin, Trees, Car, Signpost } from "lucide-react"
import type { PropertyReportHandler } from "@/lib/report-handler"
import type { DevelopmentInfo } from "@/schemas/views/development-info-schema"
import { DataPointDisplay } from "@/components/data-point-display"
import { useDevelopmentInfo } from "@/hooks/useDevelopmentInfo"

interface DevelopmentInfoTabProps {
  reportHandler: PropertyReportHandler;
  generalPropertyInfoLoading: boolean;
}

export function DevelopmentInfoTab({ reportHandler, generalPropertyInfoLoading }: DevelopmentInfoTabProps) {
  const { developmentInfo, developmentInfoLoading, developmentInfoError } = useDevelopmentInfo(reportHandler);
  const [localDevelopmentInfo, setLocalDevelopmentInfo] = useState<DevelopmentInfo | null>(null);

  useEffect(() => {
    if (developmentInfo) {
      setLocalDevelopmentInfo(developmentInfo);
    }
  }, [developmentInfo]);

  if (developmentInfoError) {
    return (
      <div className="p-4 text-red-500">
        Error loading development info: {developmentInfoError}
      </div>
    );
  }

  if (developmentInfoLoading || generalPropertyInfoLoading) {
    return <DevelopmentInfoSkeleton />;
  }

  if (!localDevelopmentInfo) {
    return (
      <div className="p-4 text-gray-500">
        No development info available
      </div>
    );
  }

  const renderDataPoint = (key: string, data: any) => {
    if (!data) return null;
    
    if (typeof data === 'object' && data.summary) {
      return (
        <div key={key} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{key}</h3>
          <div className="space-y-2">
            {Object.entries(data.summary).map(([subKey, subData]: [string, any]) => (
              <DataPointDisplay
                key={subKey}
                dataPoint={{
                  alias: subKey,
                  value: subData.value,
                  source: subData.source,
                  unit: subData.unit
                }}
                developmentInfoLoading={developmentInfoLoading}
                generalPropertyInfoLoading={generalPropertyInfoLoading}
              />
            ))}
          </div>
        </div>
      );
    }

    if (typeof data === 'object' && data.requirements) {
      return (
        <div key={key} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{key}</h3>
          <div className="space-y-2">
            {Object.entries(data.requirements).map(([subKey, subData]: [string, any]) => (
              <DataPointDisplay
                key={subKey}
                dataPoint={{
                  alias: subKey,
                  value: subData.value,
                  source: subData.source,
                  unit: subData.unit
                }}
                developmentInfoLoading={developmentInfoLoading}
                generalPropertyInfoLoading={generalPropertyInfoLoading}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <DataPointDisplay
        key={key}
        dataPoint={{
          alias: key,
          value: data.value,
          source: data.source,
          unit: data.unit
        }}
        developmentInfoLoading={developmentInfoLoading}
        generalPropertyInfoLoading={generalPropertyInfoLoading}
      />
    );
  };

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Lot Requirements</h2>
          </div>
          {renderDataPoint("Lot Requirements", localDevelopmentInfo.lot_requirements)}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Building Placement Requirements</h2>
          </div>
          {renderDataPoint("Building Placement Requirements", localDevelopmentInfo.building_placement_requirements)}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Building Requirements</h2>
          </div>
          {renderDataPoint("Building Requirements", localDevelopmentInfo.building_requirements)}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Trees className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Landscaping Requirements</h2>
          </div>
          {renderDataPoint("Landscaping Requirements", localDevelopmentInfo.landscaping_requirements)}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Parking Requirements</h2>
          </div>
          {renderDataPoint("Parking Requirements", localDevelopmentInfo.parking_requirements)}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Signpost className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Signage Requirements</h2>
          </div>
          {renderDataPoint("Signage Requirements", localDevelopmentInfo.signage_requirements)}
        </div>
      </div>
    </div>
  );
}

function DevelopmentInfoSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="grid grid-cols-12 divide-x divide-gray-100">
                  <div className="col-span-4">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="col-span-5">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="col-span-3">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}