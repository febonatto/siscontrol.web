import * as xlsx from 'xlsx-js-style';
import slugify from 'slugify';

interface ColumnConfig {
  width?: number;
  format?: string;
}

interface ColumnSettingsMap {
  [header: string]: ColumnConfig;
}

function applyStylesToWorksheet(
  worksheet: xlsx.WorkSheet,
  columnSettings: ColumnSettingsMap = {},
  defaultWidth: number = 25,
): xlsx.WorkSheet {
  const headerStyles = {
    fill: {
      fgColor: {
        rgb: 'FFFF00',
      },
    },
    font: {
      bold: true,
      color: {
        rgb: '000000',
      },
    },
    alignment: {
      horizontal: 'center',
    },
  };
  const headerRange = xlsx.utils.decode_range(worksheet['!ref'] || 'A1');

  for (let cell = headerRange.s.c; cell <= headerRange.e.c; cell++) {
    const headerAddress = xlsx.utils.encode_cell({ r: 0, c: cell });
    const headerCell = worksheet[headerAddress];

    if (!headerCell) {
      continue;
    }

    headerCell.s = headerStyles;

    const headerName: string = headerCell.v;
    const settings = columnSettings[headerName];

    if (!settings) {
      continue;
    }

    if (settings.format) {
      for (let row = headerRange.s.r + 1; row <= headerRange.e.r; ++row) {
        const cellAddress = xlsx.utils.encode_cell({
          r: row,
          c: cell,
        });
        const currentCell = worksheet[cellAddress];

        if (currentCell) {
          currentCell.z = settings.format;
          currentCell.t = 'n';
        }
      }
    }
  }

  const headers = xlsx.utils.sheet_to_json<string[]>(worksheet, {
    header: 1,
  })[0];
  const columnWidths = headers.map((header) => ({
    wch: columnSettings[header]?.width || defaultWidth,
  }));
  worksheet['!cols'] = columnWidths;

  return worksheet;
}

export function exportToSpreadsheet(
  data: unknown[],
  columnSettings: ColumnSettingsMap,
  name: string,
) {
  const worksheet = xlsx.utils.json_to_sheet(data);

  applyStylesToWorksheet(worksheet, columnSettings);

  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, name);

  const fileName = slugify(name, {
    replacement: '_',
    lower: true,
    strict: true,
    trim: true,
  });
  xlsx.writeFile(workbook, `${fileName}.xlsx`);
}
