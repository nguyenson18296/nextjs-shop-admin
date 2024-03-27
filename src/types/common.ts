import type * as React from "react";

export interface TableColumnInterface {
    id: string;
    label: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
    content?: (value: string) => React.ReactElement;
}

export interface TableColumnContent {
    value: string | number | React.ReactElement;
}