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

export interface ReportTotal {
  unitPrice: number;
  amountMonths: number;
  contractualAmount: number;
  smeUnitPrice: number;
  smeAmountMonths: number;
  smeContractualAmount: number;
  previousAmountWorkedMonths: number;
  previousTotalPaid: number;
  requiredExperienceTime: number;
  experienceTime: number;
  experienceDifference: number;
  proportionDaysWorked: number;
  percentualFineExperience: number;
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

export interface ReportSubBlockDTO {
  title: string;
  totals: ReportTotal;
  lines: MeasurementReportDetailLine[];
}

export interface ReportBlockDTO {
  title: string;
  totals: ReportTotal;
  lines?: MeasurementReportDetailLine[];
  subBlocks?: ReportSubBlockDTO[];
}

export interface MeasurementReportExcel {
  totals: ReportTotal;
  blocks: ReportBlockDTO[];
}

async function generateMeasurementReport(
  measurementReportNumber: number,
): Promise<MeasurementReportExcel> {
  const { data } = await api.get<MeasurementReportExcel>(
    `/bm/generate-report/${measurementReportNumber}`,
  );

  return data;
}

export function useGenerateMeasurementReport(
  measurementReportNumber: Nullable<number>,
) {
  return useQuery<
    MeasurementReportExcel,
    AxiosError,
    MeasurementReportExcel,
    [string, number]
  >({
    queryKey: ['generate-measurement-report', measurementReportNumber!],
    queryFn: () => generateMeasurementReport(measurementReportNumber!),
    enabled: !!measurementReportNumber,
  });
}
