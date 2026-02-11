import {
  MeasurementReportDetailLine,
  MeasurementReportDetailLineExcel,
  ReportTotals,
} from '../../api/useGenerateMeasurementReport';

import * as xlsx from 'xlsx-js-style';

interface ColumnConfig {
  header: string;
  key: keyof MeasurementReportDetailLine;
  width: number;

  rowSpan?: number;
  group?: string;

  subKey?: string;
  totalKey?: string;
  isText?: boolean;
  format?: string;
}

export class ExcelTreeGenerator {
  private static readonly HEADER_HEIGHT: number = 3;
  private static readonly COLUMNS = (
    measurementReportNumber: number,
  ): ColumnConfig[] => [
    {
      header: 'Cod. Partida',
      key: 'code',
      width: 20,
      rowSpan: 3,
    },
    {
      header: 'Serviço',
      key: 'service',
      width: 50,
      rowSpan: 3,
    },
    {
      header: 'Aeroporto',
      key: 'acronym',
      width: 15,
      rowSpan: 3,
    },
    {
      header: 'Colaborador',
      key: 'fullName',
      width: 40,
      rowSpan: 3,
    },
    {
      header: 'Data de Mobilização',
      key: 'actualMobilizationDate',
      width: 30,
      rowSpan: 3,
    },
    {
      header: 'Data de Desmobilização',
      key: 'actualDemobilizationDate',
      width: 30,
      rowSpan: 3,
    },
    {
      header: 'Preço Unitário',
      key: 'unitPrice',
      width: 15,
      group: 'CONTRATO',
      totalKey: 'unitPrice',
      format: '"R$"\ #,##0.00',
    },
    {
      header: 'Meses',
      key: 'amountMonths',
      width: 10,
      group: 'CONTRATO',
      totalKey: 'amountMonths',
    },
    {
      header: 'Valor Total do Contrato',
      key: 'contractualAmount',
      width: 30,
      group: 'CONTRATO',
      totalKey: 'contractualAmount',
      format: '"R$"\ #,##0.00',
    },
    {
      header: 'Preço Unitário',
      key: 'smeUnitPrice',
      width: 15,
      group: 'SME',
      totalKey: 'smeUnitPrice',
      format: '"R$"\ #,##0.00',
    },
    {
      header: 'Meses',
      key: 'smeAmountMonths',
      width: 10,
      group: 'SME',
      totalKey: 'smeAmountMonths',
    },
    {
      header: 'Valor Total do Contrato',
      key: 'smeContractualAmount',
      width: 30,
      group: 'SME',
      totalKey: 'smeContractualAmount',
      format: '"R$"\ #,##0.00',
    },
    {
      header: 'Quantidade',
      key: 'previousAmountWorkedMonths',
      width: 15,
      group: 'ACUMULADO ANTERIOR',
      totalKey: 'previousAmountWorkedMonths',
      format: '0.00',
    },
    {
      header: 'R$',
      key: 'previousTotalPaid',
      width: 20,
      group: 'ACUMULADO ANTERIOR',
      totalKey: 'previousTotalPaid',
      format: '"R$"\ #,##0.00',
    },
    {
      header: 'Experiência Mínima',
      key: 'requiredExperienceTime',
      width: 20,
      group: `MEDIÇÃO ${measurementReportNumber}`,
      totalKey: 'requiredExperienceTime',
    },
    {
      header: 'Experiência do Colaborador',
      key: 'experienceTime',
      width: 30,
      group: `MEDIÇÃO ${measurementReportNumber}`,
      totalKey: 'experienceTime',
      format: '0.00',
    },
    {
      header: 'Diferença de Experiência',
      key: 'experienceDifference',
      width: 30,
      group: `MEDIÇÃO ${measurementReportNumber}`,
      totalKey: 'experienceDifference',
      format: '0.00',
    },
    {
      header: 'Proporção de Dias Trabalhados',
      key: 'amountMonths',
      width: 30,
      group: `MEDIÇÃO ${measurementReportNumber}`,
      totalKey: 'proportionDaysWorked',
    },
    {
      header: '% Multa 7.1',
      key: 'percentualFineExperience',
      width: 20,
      group: `MEDIÇÃO ${measurementReportNumber}`,
      totalKey: 'percentualFineExperience',
    },
    {
      header: 'Multa 7.1',
      key: 'amountFineExperience',
      width: 20,
      group: `MEDIÇÃO ${measurementReportNumber}`,
      totalKey: 'amountFineExperience',
      format: '"R$"\ #,##0.00',
    },
    {
      header: 'Valor da Medição',
      key: 'measurementReportValue',
      width: 30,
      group: `MEDIÇÃO ${measurementReportNumber}`,
      totalKey: 'measurementReportValue',
      format: '"R$"\ #,##0.00',
    },
    {
      header: '% Multa 7.2',
      key: 'percentualFineMobilization',
      width: 20,
      group: `MEDIÇÃO ${measurementReportNumber}`,
      totalKey: 'percentualFineMobilization',
    },
    {
      header: 'Multa 7.2',
      key: 'amountFineMobilization',
      width: 20,
      group: `MEDIÇÃO ${measurementReportNumber}`,
      totalKey: 'amountFineMobilization',
      format: '"R$"\ #,##0.00',
    },
    {
      header: 'Valor Real da Medição',
      key: 'actualMeasurementReportValue',
      width: 30,
      group: `MEDIÇÃO ${measurementReportNumber}`,
      totalKey: 'actualMeasurementReportValue',
      format: '"R$"\ #,##0.00',
    },
    {
      header: 'Total de Meses Medidos',
      key: 'actualAmountWorkedMonths',
      width: 30,
      group: 'ACUMULADO ATUAL',
      totalKey: 'actualAmountWorkedMonths',
      format: '0.00',
    },
    {
      header: 'Total Medido',
      key: 'actualTotalPaid',
      width: 30,
      group: 'ACUMULADO ATUAL',
      totalKey: 'actualTotalPaid',
      format: '"R$"\ #,##0.00',
    },
    {
      header: 'Saldo de Meses',
      key: 'balanceMonths',
      width: 30,
      group: 'SALDO',
      totalKey: 'balanceMonths',
      format: '0.00',
    },
    {
      header: 'Saldo',
      key: 'balance',
      width: 30,
      group: 'SALDO',
      totalKey: 'balance',
      format: '"R$"\ #,##0.00',
    },
  ];
  private static STYLES = {
    fixedHeader: {
      fill: { fgColor: { rgb: '90EE90' } },
      font: { bold: true, sz: 11, color: { rgb: '000000' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: {
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        left: { style: 'thin' },
      },
    },
    groupTitleYellow: {
      fill: { fgColor: { rgb: 'FFFF00' } },
      font: { bold: true, sz: 11 },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin' },
        right: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
      },
    },
    groupTitleGreen: {
      fill: { fgColor: { rgb: '90EE90' } },
      font: { bold: true, sz: 11 },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin' },
        right: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
      },
    },
    subHeaderYellow: {
      fill: { fgColor: { rgb: 'FFFF00' } },
      font: { bold: true, sz: 11 },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        left: { style: 'thin' },
      },
    },
    subHeaderGreen: {
      fill: { fgColor: { rgb: '90EE90' } },
      font: { bold: true, sz: 11 },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        left: { style: 'thin' },
      },
    },
    grandTotal: {
      fill: { fgColor: { rgb: 'F0F0F0' } },
      font: { bold: true },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: {
        bottom: { style: 'medium' },
        right: { style: 'thin' },
        left: { style: 'thin' },
      },
    },
    mainBlock: {
      fill: { fgColor: { rgb: 'A9A9A9' } },
      font: { bold: true, sz: 12 },
      alignment: { horizontal: 'right' },
      border: { top: { style: 'medium' }, bottom: { style: 'medium' } },
    },
    mainBlockTitle: {
      fill: { fgColor: { rgb: 'A9A9A9' } },
      font: { bold: true, sz: 13 },
      alignment: { horizontal: 'left', vertical: 'center' },
      border: { top: { style: 'medium' }, bottom: { style: 'medium' } },
    },
    subBlock: {
      fill: { fgColor: { rgb: 'D3D3D3' } },
      font: { bold: true },
      alignment: { horizontal: 'right' },
      border: { bottom: { style: 'thin' } },
    },
    subBlockTitle: {
      fill: { fgColor: { rgb: 'D3D3D3' } },
      font: { bold: true },
      alignment: { horizontal: 'left' },
      border: { bottom: { style: 'thin' } },
    },
    data: {
      alignment: { horizontal: 'left' },
      border: { bottom: { style: 'thin', color: { rgb: 'E0E0E0' } } },
    },
    dataNumber: {
      alignment: { horizontal: 'right' },
      border: { bottom: { style: 'thin', color: { rgb: 'E0E0E0' } } },
    },
  };

  static generate(
    data: MeasurementReportDetailLineExcel[],
    measurementReportNumber: number,
    fileName: string,
  ) {
    const workbook = xlsx.utils.book_new();
    const columns = this.COLUMNS(measurementReportNumber);
    const rows: unknown[][] = [];
    const merges: xlsx.Range[] = [];

    const firstRow: unknown[] = [];
    const secondRow: unknown[] = [];
    const thirdRow: unknown[] = [];

    let currentGroup = '';
    let groupStartIndex = 0;

    columns.forEach((column, index) => {
      if (column.rowSpan && column.rowSpan > 1) {
        if (currentGroup) {
          merges.push({
            s: {
              r: 0,
              c: groupStartIndex,
            },
            e: {
              r: 0,
              c: index - 1,
            },
          });
          currentGroup = '';
        }

        firstRow.push({
          v: column.header,
          s: this.STYLES.fixedHeader,
        });
        secondRow.push({
          v: '',
          s: this.STYLES.fixedHeader,
        });
        thirdRow.push({
          v: '',
          s: this.STYLES.fixedHeader,
        });

        merges.push({
          s: {
            r: 0,
            c: index,
          },
          e: {
            r: column.rowSpan - 1,
            c: index,
          },
        });
      } else {
        if (column.group !== currentGroup) {
          if (currentGroup) {
            merges.push({
              s: {
                r: 0,
                c: groupStartIndex,
              },
              e: {
                r: 0,
                c: index - 1,
              },
            });
          }

          currentGroup = column.group!;
          groupStartIndex = index;

          firstRow.push({
            v: currentGroup,
            s: currentGroup.includes('MEDIÇÃO')
              ? this.STYLES.groupTitleGreen
              : this.STYLES.groupTitleYellow,
          });
        } else {
          firstRow.push({
            v: '',
            s: currentGroup.includes('MEDIÇÃO')
              ? this.STYLES.groupTitleGreen
              : this.STYLES.groupTitleYellow,
          });
        }

        secondRow.push({
          v: column.header,
          s: currentGroup.includes('MEDIÇÃO')
            ? this.STYLES.subHeaderGreen
            : this.STYLES.subHeaderYellow,
        });
        thirdRow.push({
          v: column.key,
        });
      }
    });

    if (currentGroup) {
      merges.push({
        s: {
          r: 0,
          c: groupStartIndex,
        },
        e: {
          r: 0,
          c: columns.length - 1,
        },
      });
    }

    rows.push(firstRow, secondRow, thirdRow);
    let startDataRowIndex = this.HEADER_HEIGHT;
    const mainBlockIndexes: number[] = [];

    data.forEach((item, index) => {
      this.addBlockHeaderRow(
        columns,
        rows,
        item.title,
        item.totals,
        'mainBlock',
        merges,
        startDataRowIndex,
      );
      startDataRowIndex++;
      mainBlockIndexes.push(startDataRowIndex);

      const children = item.lines ?? item.subBlocks ?? [];

      children.forEach((child) => {
        if ('lines' in child) {
          this.addBlockHeaderRow(
            columns,
            rows,
            child.title,
            child.totals,
            'subBlock',
            merges,
            startDataRowIndex,
          );
          startDataRowIndex++;

          if (child.lines.length > 0) {
            child.lines.forEach((line) => {
              const rowData = columns.map((column) => {
                let value: any = line[column.key as keyof typeof line];

                if (
                  value instanceof Date ||
                  (typeof value === 'string' && value.includes('T'))
                ) {
                  const dateValue = new Date(value);
                  if (!isNaN(dateValue.getTime())) {
                    value = dateValue.toLocaleDateString('pt-BR');
                  }
                }

                if (column.format) {
                  const numValue = Number(value);

                  if (!isNaN(numValue)) {
                    return {
                      v: numValue,
                      t: 'n',
                      z: column.format,
                    };
                  }
                }

                return {
                  v: value ?? '',
                };
              });

              rows.push(rowData);
              startDataRowIndex++;
            });
          }
        } else {
          const rowData = columns.map((column) => {
            let value: any = child[column.key as keyof typeof child];

            if (
              value instanceof Date ||
              (typeof value === 'string' && value.includes('T'))
            ) {
              const dateValue = new Date(value);
              if (!isNaN(dateValue.getTime())) {
                value = dateValue.toLocaleDateString('pt-BR');
              }
            }

            if (column.format) {
              const numValue = Number(value);

              if (!isNaN(numValue)) {
                return {
                  v: numValue,
                  t: 'n',
                  z: column.format,
                };
              }
            }

            return {
              v: value ?? '',
            };
          });

          rows.push(rowData);
          startDataRowIndex++;
        }
      });
    });

    const worksheet = xlsx.utils.aoa_to_sheet(rows);
    worksheet['!merges'] = merges;
    worksheet['!cols'] = columns.map((column) => ({ wch: column.width }));

    const sheetRows: xlsx.RowInfo[] = [];
    for (let i = 0; i < rows.length; i++) {
      let height = 17;
      if (i < this.HEADER_HEIGHT || mainBlockIndexes.includes(i + 1)) {
        height = 28;
      }
      sheetRows.push({ hpt: height });
    }
    worksheet['!rows'] = sheetRows;

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Medição');
    xlsx.writeFile(workbook, fileName);
  }

  private static addBlockHeaderRow(
    columns: ColumnConfig[],
    rows: unknown[][],
    title: string,
    totals: ReportTotals,
    type: 'mainBlock' | 'subBlock',
    merges: xlsx.Range[],
    rowIndex: number,
  ) {
    const baseStyle =
      type === 'mainBlock' ? this.STYLES.mainBlock : this.STYLES.subBlock;
    const titleStyle =
      type === 'mainBlock'
        ? this.STYLES.mainBlockTitle
        : this.STYLES.subBlockTitle;
    let textColsCount = 0;

    const row = columns.map((column, index) => {
      if (column.totalKey) {
        return {
          v: totals[column.totalKey as keyof ReportTotals] ?? 0,
          t: 'n',
          s: baseStyle,
          z: column.format,
        };
      }

      textColsCount = index + 1;

      return {
        v: index === 0 ? title : '',
        s: titleStyle,
      };
    });

    rows.push(row);

    if (textColsCount > 1) {
      merges.push({
        s: {
          r: rowIndex,
          c: 0,
        },
        e: {
          r: rowIndex,
          c: textColsCount - 1,
        },
      });
    }
  }
}
