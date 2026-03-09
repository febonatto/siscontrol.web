import {
  MeasurementReportExcel,
  MeasurementReportLine,
  MeasurementReportResume,
} from '../../api/useGenerateMeasurementReport';

import ExcelJS from 'exceljs';
import {
  applyStylesToCell,
  createHeaderRow,
  CURRENCY_FORMAT,
  getColumnConfig,
  getStyle,
  GroupVariant,
  StyleType,
} from '../constants';

export class ExcelTreeGenerator {
  // Constante de altura do cabeçalho (3 linhas: Grupo, Header, Chave/Vazio)
  private static readonly HEADER_HEIGHT: number = 3;

  static async generate(
    data: MeasurementReportExcel,
    measurementReportNumber: number,
    fileName: string,
  ) {
    const workbook = new ExcelJS.Workbook();

    await this.generateResumeworksheet(workbook, data.measurementReportResume);

    await this.generateDetailsWorksheet(
      workbook,
      measurementReportNumber,
      data.measurementReportDetails,
      `BM${measurementReportNumber}`,
    );

    await this.downloadWorkbook(workbook, fileName);
  }

  private static async generateResumeworksheet(
    workbook: ExcelJS.Workbook,
    data: MeasurementReportResume,
  ) {
    const worksheet = workbook.addWorksheet('Resumo');

    worksheet.columns = [
      { width: 39 },
      { width: 39 },
      { width: 25 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 20 },
    ];

    createReadjustmentTable({ data, worksheet });
    addEmptyRow(worksheet, 1);

    createDivisionForEachCompanyTable({ data, worksheet });
    addEmptyRow(worksheet, 3);
  }

  private static async generateDetailsWorksheet(
    workbook: ExcelJS.Workbook,
    measurementReportNumber: number,
    data: MeasurementReportLine,
    sheetName: string,
  ) {
    // 1. Criação do Workbook e Worksheet
    const worksheet = workbook.addWorksheet(sheetName, {
      views: [
        {
          state: 'frozen',
          xSplit: 0, // Não trava colunas
          ySplit: 2, // Trava as 2 primeiras linhas (Linhas 1 e 2 ficam fixas)
          topLeftCell: 'A3', // A primeira célula que rola é a A3 (Logo abaixo da trava)
          activeCell: 'A1',
        },
      ],
    });

    const columns = getColumnConfig(measurementReportNumber);

    // 2. Definição da Largura das Colunas
    // ExcelJS usa 'width' (aproximadamente caracteres).
    worksheet.columns = columns.map((col) => ({
      key: col.key, // Usado internamente se quisermos acessar por chave
      width: col.width, // Ajuste empírico: xlsx usa pixels/pontos, exceljs usa chars. Dividindo por ~7 para aproximar
    }));

    // Variáveis para construção do cabeçalho
    const firstRowValues: string[] = [];
    const secondRowValues: string[] = [];
    const thirdRowValues: (number | null)[] = [];

    // Arrays para guardar metadados de estilos de cada célula do cabeçalho
    const firstRowStyles: { type: StyleType; groupVariant?: GroupVariant }[] =
      [];
    const secondRowStyles: { type: StyleType; groupVariant?: GroupVariant }[] =
      [];
    const thirdRowStyles: { type: StyleType; groupVariant?: GroupVariant }[] =
      [];

    // Arrays para guardar as definições de merge
    const merges: {
      s: { r: number; c: number };
      e: { r: number; c: number };
    }[] = [];

    let currentGroup = '';
    let groupStartIndex = 0;

    // 3. Lógica de Construção dos Arrays de Cabeçalho (Igual à original)
    columns.forEach((column, index) => {
      // Índice baseado em 0 para lógica, mas ExcelJS usa 1-based para colunas/linhas na hora de merge

      if (column.rowSpan && column.rowSpan > 1) {
        // Fechamento de grupo anterior se houver
        if (currentGroup) {
          merges.push({
            s: { r: 1, c: groupStartIndex + 1 }, // Linha 1
            e: { r: 1, c: index }, // Até coluna anterior (index é atual, anterior é index-1+1 = index no exceljs logic?) -> index é 0-based. Col excel é index+1. Col anterior é index.
          });
          currentGroup = '';
        }

        // Adiciona valores e estilos
        firstRowValues.push(column.header);
        firstRowStyles.push({ type: 'simpleHeader' });

        secondRowValues.push('');
        secondRowStyles.push({ type: 'simpleHeader' });

        thirdRowValues.push(null);
        thirdRowStyles.push({ type: 'simpleHeader' });

        // Merge Vertical (RowSpan)
        // Linhas 1 a 3 (baseado em HEADER_HEIGHT=3), Coluna index+1
        merges.push({
          s: { r: 1, c: index + 1 },
          e: { r: column.rowSpan, c: index + 1 },
        });
      } else {
        // Lógica de Grupo
        if (column.group !== currentGroup) {
          if (currentGroup) {
            // Fecha merge do grupo anterior
            merges.push({
              s: { r: 1, c: groupStartIndex + 1 },
              e: { r: 1, c: index }, // Coluna anterior
            });
          }

          currentGroup = column.group!;
          groupStartIndex = index;

          const isMeasurementGroup = currentGroup
            .toLocaleLowerCase()
            .includes('medição');

          firstRowValues.push(currentGroup.toUpperCase());
          firstRowStyles.push({
            type: 'groupTitle',
            groupVariant: isMeasurementGroup ? 'green' : 'yellow',
          });
        } else {
          const isMeasurementGroup = currentGroup
            .toLocaleLowerCase()
            .includes('medição');
          firstRowValues.push('');
          firstRowStyles.push({
            type: 'groupTitle',
            groupVariant: isMeasurementGroup ? 'green' : 'yellow',
          });
        }

        const isMeasurementGroup = currentGroup
          .toLocaleLowerCase()
          .includes('medição');

        secondRowValues.push(column.header);
        secondRowStyles.push({
          type: 'groupSubtitle',
          groupVariant: isMeasurementGroup ? 'green' : 'yellow',
        });

        // Terceira linha (vazia visualmente, usada para chave interna ou espaçamento)
        thirdRowValues.push(
          data.totals[column.totalKey as keyof typeof data.totals],
        );
        thirdRowStyles.push({
          type: 'groupSubtitle',
          groupVariant: isMeasurementGroup ? 'green' : 'yellow',
        }); // Usando estilo do subheader para manter consistência ou 'fixedHeader' se fosse o caso. No original não tinha estilo explícito na row3 do else, assumindo padrão. Vou manter limpo ou aplicar borda.
        // O original aplicava style na first e second row. Third row recebia apenas valor column.key, sem style explícito no `push`.
      }
    });

    // Fecha último grupo se houver
    if (currentGroup) {
      merges.push({
        s: { r: 1, c: groupStartIndex + 1 },
        e: { r: 1, c: columns.length },
      });
    }

    // 4. Adiciona as linhas de cabeçalho ao Worksheet
    const row1 = worksheet.addRow(firstRowValues);
    const row2 = worksheet.addRow(secondRowValues);
    const row3 = worksheet.addRow(thirdRowValues);

    // 5. Aplica Estilos aos Cabeçalhos
    // Iteramos célula a célula para aplicar o estilo correto guardado nos arrays
    row1.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const styleName = firstRowStyles[colNumber - 1];
      if (styleName)
        applyStylesToCell(
          cell,
          getStyle({
            type: styleName.type,
            groupVariant: styleName.groupVariant,
          }),
        );
    });
    row2.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const styleName = secondRowStyles[colNumber - 1];
      if (styleName)
        applyStylesToCell(
          cell,
          getStyle({
            type: styleName.type,
            groupVariant: styleName.groupVariant,
          }),
        );
    });
    row3.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const columnConfig = columns[colNumber - 1];
      const styleName = thirdRowStyles[colNumber - 1];
      if (styleName)
        applyStylesToCell(cell, {
          font: {
            bold: true,
            size: 12,
          },
        });

      if (columnConfig.format && typeof cell.value === 'number') {
        cell.numFmt = columnConfig.format;
      }
    });
    // Row 3 no original (parte do else) não tinha estilo definido explicitamente exceto para fixed cols.
    // Vamos manter sem estilo específico para as não-fixas, ou replicar borda inferior.

    // 6. Aplica Merges do Cabeçalho
    merges.forEach((merge) => {
      worksheet.mergeCells(merge.s.r, merge.s.c, merge.e.r, merge.e.c);
    });

    // 7. Processamento dos Dados
    let currentRowIndex = this.HEADER_HEIGHT + 1; // Começa na linha 4 (ExcelJS é 1-based)
    const mainBlockRowIndexes: number[] = [];

    data.blocks.forEach((item) => {
      // Adiciona Header do Bloco Principal
      createHeaderRow(worksheet, columns, item.title, item.totals, 'mainBlock');
      // Registra índice para ajuste de altura posterior (currentRowIndex é o índice da linha recém adicionada)
      // addBlockHeaderRow adiciona uma linha e incrementa o contador interno da worksheet? Não, precisamos controlar.
      // O método addBlockHeaderRow vai fazer worksheet.addRow.
      mainBlockRowIndexes.push(currentRowIndex);
      currentRowIndex++;

      const children = item.lines ?? item.subBlocks ?? [];

      children.forEach((child) => {
        if ('lines' in child) {
          // Sub-bloco com linhas
          createHeaderRow(
            worksheet,
            columns,
            child.title,
            child.totals,
            'subBlock',
          );
          currentRowIndex++;

          if (child.lines.length > 0) {
            child.lines.forEach((line) => {
              const rowValues = columns.map((column) => {
                let value = line[column.key as keyof typeof line];

                // Tratamento de Datas
                if (
                  value instanceof Date ||
                  (typeof value === 'string' && value.includes('T'))
                ) {
                  const dateValue = new Date(value);
                  if (!isNaN(dateValue.getTime())) {
                    value = dateValue.toLocaleDateString('pt-BR');
                    return value; // Retorna string formatada
                  }
                }

                // Tratamento de Números
                if (column.format) {
                  const isNullish =
                    value === null || value === undefined || value === '';

                  if (isNullish) {
                    return column.group === 'SME' || column.group === 'Contrato'
                      ? null
                      : 0;
                  }

                  const numValue = Number(value);
                  if (!isNaN(numValue)) return numValue;
                }

                return value || '';
              });

              // Adiciona linha de dados
              const dataRow = worksheet.addRow(rowValues);

              // Formatação de Células de Dados
              dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const columnConfig = columns[colNumber - 1];

                // Aplica formato numérico se existir
                if (columnConfig.format && typeof cell.value === 'number') {
                  cell.numFmt = columnConfig.format; // Remove escapes do xlsx (ex: \"R$\") se necessário, ExcelJS usa padrão Excel direto
                  // Ajuste formato para ExcelJS: '"R$" #,##0.00' funciona.
                }

                // Aplica alinhamento e bordas
                applyStylesToCell(cell, getStyle({ type: 'data' }));
              });

              currentRowIndex++;
            });
          }
        } else {
          // Caso onde não tem 'lines' (estrutura plana ou diferente) - similar ao anterior
          const rowValues = columns.map((column) => {
            // Lógica de extração de valor idêntica...
            let value: any = child[column.key as keyof typeof child];
            if (
              value instanceof Date ||
              (typeof value === 'string' && value.includes('T'))
            ) {
              const dateValue = new Date(value);
              if (!isNaN(dateValue.getTime()))
                value = dateValue.toLocaleDateString('pt-BR');
            }
            if (column.format) {
              const isNullish =
                value === null || value === undefined || value === '';

              if (isNullish) {
                return column.group === 'SME' || column.group === 'Contrato'
                  ? null
                  : 0;
              }

              const numValue = Number(value);
              if (!isNaN(numValue)) return numValue;
            }
            return value || '';
          });

          const dataRow = worksheet.addRow(rowValues);
          dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const columnConfig = columns[colNumber - 1];
            if (columnConfig.format && typeof cell.value === 'number') {
              cell.numFmt = columnConfig.format;
            }
            // Estilo Data
            applyStylesToCell(cell, getStyle({ type: 'data' }));
          });
          currentRowIndex++;
        }
      });
    });

    // 8. Ajuste de Altura das Linhas (!rows no original)
    worksheet.eachRow((row, rowNumber) => {
      let height = 17; // Padrão
      if (rowNumber <= this.HEADER_HEIGHT) {
        height = 28; // Cabeçalho
      } else if (mainBlockRowIndexes.includes(rowNumber)) {
        height = 28; // Bloco Principal
      }
      row.height = height; // ExcelJS usa 'points' para altura por padrão
    });
  }

  private static async downloadWorkbook(
    workbook: ExcelJS.Workbook,
    fileName: string,
  ) {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    console.log('aqui');
    anchor.click();

    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }
}

interface CreateReadjustmentTableParams {
  data: MeasurementReportResume;
  worksheet: ExcelJS.Worksheet;
}

function addEmptyRow(worksheet: ExcelJS.Worksheet, rowSpan: number = 1) {
  for (let i = 0; i < rowSpan; i++) {
    worksheet.addRow([]);
  }
}

function createReadjustmentTable({
  data,
  worksheet,
}: CreateReadjustmentTableParams) {
  const EMPTY_CELL = '';

  const INITIAL_MERGE_CELL = 6;
  const MERGE_ROWS_COUNT = 3;

  function mergeRows(rows: ExcelJS.Row[]) {
    const firstMergeRow = rows[1];
    const lastMergeRow = rows[rows.length - 1];
    Array.from({ length: MERGE_ROWS_COUNT })
      .map((_, index) => INITIAL_MERGE_CELL + index)
      .forEach((row) => {
        worksheet.mergeCells(
          `${firstMergeRow.getCell(row).address}:${lastMergeRow.getCell(row).address}`,
        );
      });
  }

  function applyCurrencyFormat(row: ExcelJS.Row, isMergedCell: boolean) {
    const currencyCells = [3, 5];

    if (isMergedCell) {
      currencyCells.push(7, 8);
    }

    currencyCells.forEach((cell) => {
      row.getCell(cell).numFmt = CURRENCY_FORMAT;
    });
  }

  function applyCellBorders(
    row: ExcelJS.Row,
    shouldApplyTop: boolean,
    shouldApplyBottom: boolean,
  ) {
    const borderCells = [1, 2, 3, 4, 5, 6, 7, 8];
    const customBorderCells = [3, 5, 6, 7, 8];

    borderCells.forEach((cell) => {
      let borderStyles: Partial<ExcelJS.Borders> = {
        ...(shouldApplyTop && { top: { style: 'medium' } }),
        ...(shouldApplyBottom && { bottom: { style: 'medium' } }),
      };

      row.getCell(cell).border = borderStyles;

      if (customBorderCells.includes(cell)) {
        borderStyles = {
          ...borderStyles,
          right: {
            style: 'medium',
          },
        };

        row.getCell(cell).border = borderStyles;
      }
    });
  }

  const firstRow = worksheet.addRow([
    'VALOR MEDIDO',
    EMPTY_CELL,
    data.totalMeasurementValueWithPenalties,
    'VALOR APROVADO',
    data.totalMeasurementValueWithPenalties,
    'ÍNDICE DE REAJUSTE',
    'ITENS SEM REAJUSTE',
    'ITENS SEM RETENÇÃO',
  ]);
  const secondRow = worksheet.addRow([
    'REAJUSTE',
    EMPTY_CELL,
    data.readjustValue,
    'REAJUSTE',
    data.readjustValue,
    data.adjustmentIndex + '%',
    EMPTY_CELL,
    EMPTY_CELL,
  ]);
  const thirdRow = worksheet.addRow([
    'DEVOLUÇÃO REAJUSTE SERVIÇOS',
    EMPTY_CELL,
    EMPTY_CELL,
    'DEVOLUÇÃO REAJUSTE SERVIÇOS',
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
  ]);
  const fourthRow = worksheet.addRow([
    ...Array.from({ length: 8 }).map(() => EMPTY_CELL),
  ]);
  const fifthRow = worksheet.addRow([
    'VALOR MEDIDO REAJUSTADO',
    EMPTY_CELL,
    data.readjustedMeasurementValue,
    'VALOR MEDIDO REAJUSTADO',
    data.readjustedMeasurementValue,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
  ]);

  const rows = [firstRow, secondRow, thirdRow, fourthRow, fifthRow];

  mergeRows(rows);

  rows.forEach((row, index) => {
    const shouldMergeCells = index === 1;
    applyCurrencyFormat(row, shouldMergeCells);

    const shouldApplyTop = index === 0;
    const shouldApplyBottom = index === rows.length - 1;
    applyCellBorders(row, shouldApplyTop, shouldApplyBottom);
  });
}

interface CreateDivisionForEachCompanyTableParams {
  data: MeasurementReportResume;
  worksheet: ExcelJS.Worksheet;
}

function createDivisionForEachCompanyTable({
  data,
  worksheet,
}: CreateDivisionForEachCompanyTableParams) {
  const EMPTY_CELL = '';
  const ENGECORPS_PERCENTAGE = 0.4;
  const SENNER_PERCENTAGE = 0.4;
  const GPO_PERCENTAGE = 0.2;

  const headerRow = worksheet.addRow([
    'EMPRESA',
    EMPTY_CELL,
    'VALOR NOTA FISCAL',
    'RETENÇÃO',
    'DESCONTO VALOR NÃO RETIDO',
    'VALOR FINAL DA RETENÇÃO',
    'DESCONTO VL NÃO REAJUSTÁVEL',
    'PAGAMENTO',
  ]);
  const engecorpsRow = worksheet.addRow([
    'ENGECORPS',
    EMPTY_CELL,
    data.readjustedMeasurementValue * ENGECORPS_PERCENTAGE,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    data.readjustedMeasurementValue * ENGECORPS_PERCENTAGE,
  ]);
  const sennerRow = worksheet.addRow([
    'SENNER',
    EMPTY_CELL,
    data.readjustedMeasurementValue * SENNER_PERCENTAGE,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    data.readjustedMeasurementValue * SENNER_PERCENTAGE,
  ]);
  const gpoRow = worksheet.addRow([
    'GPO',
    EMPTY_CELL,
    data.readjustedMeasurementValue * GPO_PERCENTAGE,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    data.readjustedMeasurementValue * GPO_PERCENTAGE,
  ]);
  const totalRow = worksheet.addRow([
    'TOTAL',
    EMPTY_CELL,
    data.readjustedMeasurementValue,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    data.readjustedMeasurementValue,
  ]);

  const rows = [headerRow, engecorpsRow, sennerRow, gpoRow, totalRow];
  rows.forEach((row, index) => {
    const isHeaderRow = index === 0;
    const isTotalRow = index === rows.length - 1;

    if (!isHeaderRow) {
      applyCurrencyFormat(row);
    }

    applyCellStyles(row, isHeaderRow, isTotalRow);
  });

  function applyCurrencyFormat(row: ExcelJS.Row) {
    const currencyCells = [3, 4, 5, 6, 7, 8];

    currencyCells.forEach((cell) => {
      row.getCell(cell).numFmt = CURRENCY_FORMAT;
    });
  }

  function applyCellStyles(
    row: ExcelJS.Row,
    isHeaderRow: boolean,
    isTotalRow: boolean,
  ) {
    const isHighlightRow = isHeaderRow || isTotalRow;
    const boldCellIndex = [3, 6];

    row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
      cell.style = {
        ...cell.style,
        font: { bold: isHighlightRow || boldCellIndex.includes(columnNumber) },
        ...(isHighlightRow && {
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF91D2FF' },
          },
          border: {
            ...(isHeaderRow && { top: { style: 'thin' } }),
            ...(isTotalRow && { bottom: { style: 'thin' } }),
          },
          alignment: {
            ...(columnNumber !== 1 && !isTotalRow && { horizontal: 'center' }),
          },
        }),
      };
    });
  }
}
