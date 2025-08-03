import axios from 'axios';
import { CubeQuery, CubeQueryResponse } from '../types/cube';

// Configuration - replace these with your actual values
const CUBE_API_URL = process.env.REACT_APP_CUBE_API_URL || 'YOUR_CUBE_ENDPOINT_HERE';
const CUBE_API_TOKEN = process.env.REACT_APP_CUBE_API_TOKEN || 'YOUR_BEARER_TOKEN_HERE';

class CubeApiService {
  private apiUrl: string;
  private token: string;

  constructor() {
    this.apiUrl = CUBE_API_URL;
    this.token = CUBE_API_TOKEN;
  }

  // Update configuration
  updateConfig(apiUrl: string, token: string) {
    this.apiUrl = apiUrl;
    this.token = token;
    console.log('🔧 Cube API configuration updated with new JWT token');
  }

  // Set token (convenience method)
  setToken(token: string) {
    this.token = token;
    console.log('🔧 Cube API token updated');
  }

  // Check if configuration is valid
  isConfigured(): boolean {
    const configured = this.apiUrl !== 'YOUR_CUBE_ENDPOINT_HERE' && 
           this.token !== 'YOUR_BEARER_TOKEN_HERE' &&
           this.apiUrl.length > 0 && 
           this.token.length > 0;
    
    // Debug logging
    console.log('🐛 Cube API Configuration:', {
      apiUrl: this.apiUrl,
      tokenPrefix: this.token.substring(0, 20) + '...',
      configured
    });
    
    return configured;
  }

  // Main query method
  async query(query: CubeQuery): Promise<CubeQueryResponse> {
    if (!this.isConfigured()) {
      throw new Error('Cube API not configured. Please set your endpoint and token.');
    }

    try {
      console.log('🚀 Making Cube API request:', {
        url: `${this.apiUrl}/load`,
        query: JSON.stringify(query, null, 2),
        tokenPrefix: this.token.substring(0, 20) + '...'
      });

      // Use GET with URL-encoded query parameter (like in the docs)
      const queryParam = encodeURIComponent(JSON.stringify(query));
      const response = await axios.get(
        `${this.apiUrl}/load?query=${queryParam}`,
        {
          headers: {
            'Authorization': this.token,
          },
        }
      );

      console.log('✅ Cube API response received:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ Cube API Error:', error);
      if (axios.isAxiosError(error)) {
        console.error('📋 Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url
        });
        
        if (error.response?.status === 401) {
          throw new Error('Authentication failed. Please check your Bearer token.');
        }
        if (error.response?.status === 403) {
          throw new Error('Access denied. Please check your permissions.');
        }
        if (error.response?.status === 400) {
          throw new Error(`Bad Request: ${JSON.stringify(error.response?.data) || error.response?.statusText || error.message}`);
        }
        if (error.response?.status === 500) {
          throw new Error(`Server Error: ${JSON.stringify(error.response?.data) || error.response?.statusText || error.message}`);
        }
        throw new Error(`API Error: ${error.response?.statusText || error.message}`);
      }
      throw error;
    }
  }

  // Simple test query to verify API connection
  async testConnection(): Promise<CubeQueryResponse> {
    return this.query({
      measures: ['customer_behavior.count']
    });
  }
    // Get all regions for filter dropdown
  async getRegions(): Promise<CubeQueryResponse> {
    return this.query({
      dimensions: ['sales.region']
    });
  }

  // Get customer segments for filter dropdown  
  async getCustomerSegments(): Promise<CubeQueryResponse> {
    return this.query({
      dimensions: ['customer_behavior.customers_segment']
    });
  }

  // Main dashboard queries optimized for pre-aggregations
  async getKPIs(filters: any[] = []): Promise<CubeQueryResponse> {
    return this.query({
      measures: [
        'customer_behavior.count',
        'customer_behavior.total_revenue', 
        'customer_behavior.average_order_value'
      ],
      timeDimensions: [{
        dimension: 'customer_behavior.order_date',
        dateRange: 'last 12 months'
      }],
      filters
    });
  }
    async getSalesOverTime(filters: any[] = [], dateRange = 'last 12 months'): Promise<CubeQueryResponse> {
    // Use customer_behavior view for consistency with filters
    return this.query({
      measures: ['customer_behavior.total_revenue'],
      timeDimensions: [{
        dimension: 'customer_behavior.order_date',
        granularity: 'month',
        dateRange
      }],
      filters
    });
  }

  async getSalesByRegion(filters: any[] = []): Promise<CubeQueryResponse> {
    // Use customer_behavior view to avoid join loops when filters are applied
    return this.query({
      measures: ['customer_behavior.total_revenue'],
      dimensions: ['customer_behavior.region'],
      timeDimensions: [{
        dimension: 'customer_behavior.order_date',
        granularity: 'month',
        dateRange: 'last 12 months'
      }],
      filters
    });
  }

  async getCustomerSegmentRevenue(filters: any[] = []): Promise<CubeQueryResponse> {
    return this.query({
      measures: ['customer_behavior.total_revenue'],
      dimensions: ['customer_behavior.customers_segment'],
      filters
    });
  }
    async getOrderSizeDistribution(filters: any[] = []): Promise<CubeQueryResponse> {
    return this.query({
      measures: ['customer_behavior.count', 'customer_behavior.total_revenue'],
      dimensions: ['customer_behavior.order_size_category'],
      filters
    });
  }

  async getTopBrands(filters: any[] = [], limit = 10): Promise<CubeQueryResponse> {
    return this.query({
      measures: ['sales.total_sales_amount'],
      dimensions: ['sales.parts_brand'],
      filters,
      limit
    });
  }

  async getOrderStatusBreakdown(filters: any[] = []): Promise<CubeQueryResponse> {
    return this.query({
      measures: ['customer_behavior.count', 'customer_behavior.total_revenue'],
      dimensions: ['customer_behavior.status'],
      filters
    });
  }
}

// Export singleton instance
export const cubeApi = new CubeApiService();
export default cubeApi;