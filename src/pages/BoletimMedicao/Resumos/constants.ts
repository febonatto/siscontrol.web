import {
  MeasurementReportDetailLine,
  ReportTotal,
} from '../api/useGenerateMeasurementReport';

import ExcelJS from 'exceljs';

interface ColumnConfig {
  group?: string;
  header: string;
  width: number;
  rowSpan?: number;
  format?: string;
  key?: keyof MeasurementReportDetailLine;
  totalKey?: keyof ReportTotal;
}

export const CURRENCY_FORMAT = '"R$" #,##0.00';
export const DECIMAL_NUMBER_FORMAT = '0.00';
export const PERCENTAGE_FORMAT = '0"%"';

export function getColumnConfig(
  measurementReportNumber: number,
): ColumnConfig[] {
  return [
    {
      header: 'Cod. Partida',
      width: 20,
      rowSpan: 3,
      key: 'code',
    },
    {
      header: 'Serviço',
      width: 50,
      rowSpan: 3,
      key: 'service',
    },
    {
      header: 'Aeroporto',
      width: 15,
      rowSpan: 3,
      key: 'acronym',
    },
    {
      header: 'Colaborador',
      width: 40,
      rowSpan: 3,
      key: 'fullName',
    },
    {
      header: 'Data de Mobilização',
      width: 30,
      rowSpan: 3,
      key: 'actualMobilizationDate',
    },
    {
      header: 'Data de Desmobilização',
      width: 30,
      rowSpan: 3,
      key: 'actualDemobilizationDate',
    },
    {
      group: 'Contrato',
      header: 'Preço Unitário',
      width: 20,
      key: 'unitPriceContractual',
      totalKey: 'unitPrice',
      format: CURRENCY_FORMAT,
    },
    {
      group: 'Contrato',
      header: 'Meses',
      width: 10,
      key: 'amountMonthsContractual',
      totalKey: 'amountMonths',
    },
    {
      group: 'Contrato',
      header: 'Valor Total do Contrato',
      width: 30,
      key: 'contractualAmountContractual',
      totalKey: 'contractualAmount',
      format: CURRENCY_FORMAT,
    },
    {
      group: 'SME',
      header: 'Preço Unitário',
      width: 30,
      key: 'unitPrice',
      format: CURRENCY_FORMAT,
    },
    {
      group: 'SME',
      header: 'Meses',
      width: 10,
      key: 'amountMonths',
    },
    {
      group: 'SME',
      header: 'Valor Total do Contrato',
      width: 30,
      key: 'contractualAmount',
      format: CURRENCY_FORMAT,
    },
    {
      group: 'SME',
      header: 'Número da SME',
      width: 20,
      key: 'smeNumber',
    },
    {
      group: 'Acumulado Anterior',
      header: 'Quantidade',
      width: 15,
      key: 'previousAmountWorkedMonths',
      totalKey: 'previousAmountWorkedMonths',
      format: DECIMAL_NUMBER_FORMAT,
    },
    {
      group: 'Acumulado Anterior',
      header: 'R$',
      width: 20,
      key: 'previousTotalPaid',
      totalKey: 'previousTotalPaid',
      format: CURRENCY_FORMAT,
    },
    {
      group: 'Medição ' + measurementReportNumber,
      header: 'Experiência Mínima',
      width: 20,
      key: 'requiredExperienceTime',
      totalKey: 'requiredExperienceTime',
      format: '0',
    },
    {
      group: 'Medição ' + measurementReportNumber,
      header: 'Experiência do Colaborador',
      width: 20,
      key: 'experienceTime',
      totalKey: 'experienceTime',
      format: DECIMAL_NUMBER_FORMAT,
    },
    {
      group: 'Medição ' + measurementReportNumber,
      header: 'Diferença de Experiência',
      width: 30,
      key: 'experienceDifference',
      totalKey: 'experienceDifference',
      format: DECIMAL_NUMBER_FORMAT,
    },
    {
      group: 'Medição ' + measurementReportNumber,
      header: 'Proporção de Dias Trabalhados',
      width: 30,
      key: 'proportionDaysWorked',
      totalKey: 'proportionDaysWorked',
      format: '0.000',
    },
    {
      group: 'Medição ' + measurementReportNumber,
      header: '% Multa 7.1',
      width: 20,
      key: 'percentualFineExperience',
      totalKey: 'percentualFineExperience',
      format: PERCENTAGE_FORMAT,
    },
    {
      group: 'Medição ' + measurementReportNumber,
      header: 'Multa 7.1',
      width: 20,
      key: 'amountFineExperience',
      totalKey: 'amountFineExperience',
      format: CURRENCY_FORMAT,
    },
    {
      group: 'Medição ' + measurementReportNumber,
      header: 'Valor da Medição',
      width: 30,
      key: 'measurementReportValue',
      totalKey: 'measurementReportValue',
      format: CURRENCY_FORMAT,
    },
    {
      group: 'Medição ' + measurementReportNumber,
      header: '% Multa 7.2',
      width: 20,
      key: 'percentualFineMobilization',
      totalKey: 'percentualFineMobilization',
      format: PERCENTAGE_FORMAT,
    },
    {
      group: 'Medição ' + measurementReportNumber,
      header: 'Multa 7.2',
      width: 20,
      key: 'amountFineMobilization',
      totalKey: 'amountFineMobilization',
      format: CURRENCY_FORMAT,
    },
    {
      group: 'Medição ' + measurementReportNumber,
      header: 'Valor Real da Medição',
      width: 30,
      key: 'actualMeasurementReportValue',
      totalKey: 'actualMeasurementReportValue',
      format: CURRENCY_FORMAT,
    },
    {
      group: 'Acumulado Atual',
      header: 'Total de Meses Medidos',
      width: 30,
      key: 'actualAmountWorkedMonths',
      totalKey: 'actualAmountWorkedMonths',
      format: DECIMAL_NUMBER_FORMAT,
    },
    {
      group: 'Acumulado Atual',
      header: 'Total Medido',
      width: 30,
      key: 'actualTotalPaid',
      totalKey: 'actualTotalPaid',
      format: CURRENCY_FORMAT,
    },
    {
      group: 'Saldo',
      header: 'Saldo de Meses',
      width: 30,
      key: 'balanceMonths',
      totalKey: 'balanceMonths',
      format: DECIMAL_NUMBER_FORMAT,
    },
    {
      group: 'Saldo',
      header: 'Saldo',
      width: 30,
      key: 'balance',
      totalKey: 'balance',
      format: CURRENCY_FORMAT,
    },
  ];
}

export type StyleType =
  | 'simpleHeader'
  | 'groupTitle'
  | 'groupSubtitle'
  | 'mainBlock'
  | 'subBlock'
  | 'data';

export type GroupVariant = 'green' | 'yellow';
export type BlockAlignment = 'left' | 'right';

interface GetStyleProps {
  type: StyleType;
  groupVariant?: GroupVariant;
  blockAlignment?: BlockAlignment;
}

export function getStyle({
  type,
  groupVariant,
  blockAlignment,
}: GetStyleProps): Partial<ExcelJS.Style> {
  const borders: Partial<ExcelJS.Borders> = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  const centerAlignment: Partial<ExcelJS.Alignment> = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  };

  const leftAlignment: Partial<ExcelJS.Alignment> = {
    vertical: 'middle',
    horizontal: 'left',
  };

  const rightAlignment: Partial<ExcelJS.Alignment> = {
    vertical: 'middle',
    horizontal: 'right',
  };

  switch (type) {
    case 'simpleHeader':
      return {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF90EE90' },
        },
        font: {
          bold: true,
          size: 11,
          color: { argb: 'FF000000' },
        },
        alignment: centerAlignment,
        border: borders,
      };
    case 'groupTitle':
      return {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: groupVariant === 'yellow' ? 'FFFFFF00' : 'FF90EE90',
          },
        },
        font: {
          bold: true,
          size: 11,
        },
        alignment: centerAlignment,
        border: borders,
      };
    case 'groupSubtitle':
      return {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: groupVariant === 'yellow' ? 'FFFFFF00' : 'FF90EE90',
          },
        },
        font: {
          bold: true,
          size: 11,
        },
        alignment: centerAlignment,
        border: { ...borders, top: undefined },
      };
    case 'mainBlock':
      return {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFA9A9A9' },
        },
        font: {
          bold: true,
          size: 12,
        },
        alignment: blockAlignment === 'left' ? leftAlignment : rightAlignment,
        border: {
          top: { style: 'medium' },
          bottom: { style: 'medium' },
        },
      };
    case 'subBlock':
      return {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD3D3D3' },
        },
        font: { bold: true },
        alignment: blockAlignment === 'left' ? leftAlignment : rightAlignment,
        border: {
          bottom: { style: 'thin' },
          top: { style: 'thin' },
        },
      };
    case 'data':
      return {
        alignment: rightAlignment,
        border: {
          bottom: {
            style: 'thin',
            color: { argb: 'FFE0E0E0' },
          },
        },
      };
    default:
      return {};
  }
}

export function applyStylesToCell(
  cell: ExcelJS.Cell,
  style: Partial<ExcelJS.Style>,
) {
  if (style.fill) {
    cell.fill = style.fill;
  }
  if (style.font) {
    cell.font = style.font;
  }
  if (style.alignment) {
    cell.alignment = style.alignment;
  }
  if (style.border) {
    cell.border = style.border;
  }
}

export function createHeaderRow(
  worksheet: ExcelJS.Worksheet,
  columns: ColumnConfig[],
  title: string,
  totals: ReportTotal,
  type: 'mainBlock' | 'subBlock',
) {
  const rowValues = columns.map((column, index) => {
    if (column.totalKey) {
      return totals[column.totalKey as keyof ReportTotal] ?? 0;
    }
    if (index === 0) {
      return title;
    }
    return '';
  });

  const row = worksheet.addRow(rowValues);
  const rowIndex = row.number;

  let textColumnsCount = 0;
  row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
    const columnConfig = columns[columnNumber - 1];

    applyStylesToCell(
      cell,
      getStyle({ type, blockAlignment: columnNumber === 1 ? 'left' : 'right' }),
    );
    if (columnConfig.totalKey) {
      cell.numFmt = columnConfig.format ?? '';
    }

    if (!columnConfig.totalKey) {
      textColumnsCount = columnNumber;
    }
  });

  if (textColumnsCount > 1) {
    worksheet.mergeCells(rowIndex, 1, rowIndex, textColumnsCount);
  }
}
