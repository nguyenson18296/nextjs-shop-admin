/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

import { type TableColumnInterface } from '@/types/common';

interface FormatTable<T> {
  key: string;
  content: (...values: T[]) => React.ReactElement;
}

export interface TableRow {
  id: number | string;
  [key: string]: string | number | boolean | React.ReactElement;
}

export interface FilterItem {
  id: number;
  label: string;
  count: number;
}

interface TableComponentInterface<T> {
  columns: TableColumnInterface[];
  data: TableRow[] | any[];
  dataFormatted: FormatTable<T>[];
  filters: FilterItem[];
  activeFilter?: number;
  onSwitchFilterTab?: (id: number) => void;
}

const CustomTabs = styled(Tabs)({
  paddingRight: '24px',
  paddingLeft: '24px',
  minHeight: '48px',
  display: 'flex',
  overflow: 'auto',

  '.MuiTabs-flexContainer': {
    overflow: 'auto',
  }
})

const CustomTabItem = styled(Tab)({
  '&:not(:first-child)': {
    marginLeft: '8px'
  },
  '.inner-tab': {
    display: 'flex',
    alignItems: 'center',

    '.items-count': {
      marginLeft: '8px'
    }
  }
})

export function TableComponent({ columns, dataFormatted, data, filters, activeFilter, onSwitchFilterTab }: TableComponentInterface<any>): React.JSX.Element {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <div>
        <CustomTabs value={activeFilter}>
          {filters.map((filter) => (
             <CustomTabItem value={filter.id} key={filter.id} label={(
                <div className='inner-tab'>
                  {filter.label}
                  <Chip label={filter.count} className='items-count' />
                </div>
              )} onClick={() => { onSwitchFilterTab?.(filter.id); }} />
          ))}
        </CustomTabs>
      </div>
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
                  {dataFormatted.map((f) => {
                    return f.content(item[f.key] as string, item.id as string)
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
