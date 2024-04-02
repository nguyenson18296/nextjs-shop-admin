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

export interface DataResponseBase {
    success: boolean;
    status: 200;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}
