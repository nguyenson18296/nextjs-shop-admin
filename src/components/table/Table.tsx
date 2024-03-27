/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { type TableColumnInterface } from '@/types/common';

interface FormatTable {
  key: string;
  content: (...values: string[]) => React.ReactElement;
}

export interface TableRow {
  id: number | string;
  [key: string]: string | number | boolean | React.ReactElement;
}

interface TableComponentInterface {
  columns: TableColumnInterface[];
  data: TableRow[] | any[];
  dataFormatted: FormatTable[];
}

export function TableComponent({ columns, dataFormatted, data }: TableComponentInterface): React.JSX.Element {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 540 }}>
        <Table stickyHeader sx={{ minWidth: 750 }} aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((head) => {
                if (head.content) {
                  return head.content(head.id);
                }
                return <TableCell key={head.id}>{head.label}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item: TableRow) => {
              return (
                <TableRow key={item.id}>
                  {dataFormatted.map((f) => (
                    f.content(item[f.key] as string)
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
