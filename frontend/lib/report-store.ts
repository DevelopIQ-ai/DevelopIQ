import { GeneralPropertyInfo } from "@/schemas/views/general-property-info-schema";
import { DevelopmentInfo } from "@/schemas/views/development-info-schema";

const REPORT_STORAGE_KEY = 'property_report_data';

interface ReportData {
  generalPropertyInfo: GeneralPropertyInfo | null;
  developmentInfo: DevelopmentInfo | null;
  timestamp: number;
}

export const reportStore = {
  getReportData(): ReportData | null {
    const data = localStorage.getItem(REPORT_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  },

  saveReportData(data: Omit<ReportData, 'timestamp'>) {
    const reportData: ReportData = {
      ...data,
      timestamp: Date.now()
    };
    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(reportData));
  },

  clearReportData() {
    localStorage.removeItem(REPORT_STORAGE_KEY);
  }
}; 