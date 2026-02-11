import { api } from '@/configs/httpClient';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export interface MeasurementReportDetailLine {
  code: string;
  service: string;
  acronym: string;
  fullName: Nullable<string>;
  actualMobilizationDate: Nullable<Date>;
  actualDemobilizationDate: Nullable<Date>;
  unitPrice: number;
  amountMonths: number;
  contractualAmount: number;
  smeUnitPrice: number;
  smeAmountMonths: number;
  smeContractualAmount: number;
  previousAmountWorkedMonths: number;
  previousTotalPaid: number;
  requiredExperienceTime: number;
  experienceTime: Nullable<number>;
  experienceDifference: number;
  proportionDaysWorked: number;
  percentualFineExperience: Nullable<number>;
  amountFineExperience: number;
  measurementReportValue: number;
  percentualFineMobilization: number;
  amountFineMobilization: number;
  actualMeasurementReportValue: number;
  actualAmountWorkedMonths: number;
  actualTotalPaid: number;
  balanceMonths: number;
  balance: number;
}

export interface ReportTotals {
  unitPrice: number;
  amountMonths: number;
  contractualAmount: number;
  smeUnitPrice: number;
  smeAmountMonths: number;
  smeContractualAmount: number;
  previousAmountWorkedMonths: number;
  previousTotalPaid: number;
  proportionDaysWorked: number;
  percentualFineExperience: number;
  amountFineExperience: number;
  percentualFineMobilization: number;
  amountFineMobilization: number;
  actualMeasurementReportValue: number;
  actualAmountWorkedMonths: number;
  actualTotalPaid: number;
  balanceMonths: number;
  balance: number;
}

export interface ReportSubBlockDTO {
  title: string;
  totals: ReportTotals;
  lines: MeasurementReportDetailLine[];
}

export interface MeasurementReportDetailLineExcel {
  title: string;
  totals: ReportTotals;
  lines?: MeasurementReportDetailLine[];
  subBlocks?: ReportSubBlockDTO[];
}

async function generateMeasurementReport(
  measurementReportNumber: number,
): Promise<MeasurementReportDetailLineExcel[]> {
  const { data } = await api.get<MeasurementReportDetailLineExcel[]>(
    `/bm/generate-report/${measurementReportNumber}`,
  );

  return data;
}

export function useGenerateMeasurementReport(
  measurementReportNumber: Nullable<number>,
) {
  return useQuery<
    MeasurementReportDetailLineExcel[],
    AxiosError,
    MeasurementReportDetailLineExcel[],
    [string, number]
  >({
    queryKey: ['generate-measurement-report', measurementReportNumber!],
    queryFn: () => generateMeasurementReport(measurementReportNumber!),
    enabled: !!measurementReportNumber,
  });
}
