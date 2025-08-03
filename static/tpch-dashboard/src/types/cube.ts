// Cube API response types
export interface CubeQueryResponse {
  query: CubeQuery;
  data: CubeDataRow[];
  annotation: {
    measures: Record<string, CubeMeasureAnnotation>;
    dimensions: Record<string, CubeDimensionAnnotation>;
    timeDimensions: Record<string, CubeTimeDimensionAnnotation>;
  };
}

export interface CubeQuery {
  measures?: string[];
  dimensions?: string[];
  timeDimensions?: CubeTimeDimension[];
  filters?: CubeFilter[];
  order?: CubeOrder;
  limit?: number;
  offset?: number;
}

export interface CubeTimeDimension {
  dimension: string;
  granularity?: string;
  dateRange?: string | string[];
}

export interface CubeFilter {
  member: string;
  operator: string;
  values: string[];
}

export interface CubeOrder {
  [key: string]: 'asc' | 'desc';
}

export interface CubeDataRow {
  [key: string]: string | number | null;
}

export interface CubeMeasureAnnotation {
  title: string;
  shortTitle: string;
  type: string;
  format?: string;
}

export interface CubeDimensionAnnotation {
  title: string;
  shortTitle: string;
  type: string;
}

export interface CubeTimeDimensionAnnotation {
  title: string;
  shortTitle: string;
  type: string;
}

// Dashboard-specific types
export interface MetricCardData {
  title: string;
  value: string | number;
  format?: string;
  change?: number;
  isLoading?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}