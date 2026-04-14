import { api } from '@/configs/httpClient';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export interface MeasurementReportResume {
  measurementReportNumber: number;
  initialMeasurementPeriod: Date;
  finalMeasurementPeriod: Date;
  totalMeasurementValueWithOnlyExperiencePenalty: number;
  totalFineExperienceValue: number;
  totalFineMobilizationValue: number;
  deliverableQuality: number;
  projectDeliverableQualityReview: number;
  deliverableTimelinessQuality: number;
  constructionSupervisionQuality: number;
  dfoQuality: number;
  operationalSafetyQuality: number;
  serviceQuality: number;
  totalMeasurementValueWithPenalties: number;
  adjustmentIndex: number;
  readjustValue: number;
  readjustedMeasurementValue: number;
}

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
  smeNumber: Nullable<number>;
  unitPriceContractual: number;
  amountMonthsContractual: number;
  contractualAmountContractual: number;
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
  unitPriceContractual: number;
  amountMonthsContractual: number;
  contractualAmountContractual: number;
  unitPrice: number;
  amountMonths: number;
  contractualAmount: number;
  previousAmountWorkedMonths: number;
  previousTotalPaid: number;
  amountFineExperience: number;
  measurementReportValue: number;
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

export interface MeasurementReportLine {
  totals: ReportTotal;
  blocks: ReportBlockDTO[];
}

export interface MeasurementReportExcel {
  measurementReportResume: MeasurementReportResume;
  measurementReportDetails: MeasurementReportLine;
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
