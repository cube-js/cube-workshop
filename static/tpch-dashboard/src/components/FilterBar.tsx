import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import { CubeFilter } from '../types/cube';
import cubeApi from '../services/cubeApi';

interface FilterBarProps {
  onFiltersChange: (filters: CubeFilter[]) => void;
  disabled?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFiltersChange, disabled = false }) => {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [availableSegments, setAvailableSegments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Track previous filters to avoid unnecessary updates
  const prevFiltersRef = useRef<string>('');

  const updateFilters = () => {
    const filters: CubeFilter[] = [];

    // Use compatible filter paths that don't create join loops
    if (selectedRegions.length > 0) {
      // For region filter, use customer_behavior view to avoid join loops
      filters.push({
        member: 'customer_behavior.region',
        operator: 'equals',
        values: selectedRegions
      });
    }

    if (selectedSegments.length > 0) {
      filters.push({
        member: 'customer_behavior.customers_segment',
        operator: 'equals',
        values: selectedSegments
      });
    }

    // Only call onFiltersChange if filters actually changed
    const filtersString = JSON.stringify(filters);
    if (filtersString !== prevFiltersRef.current) {
      console.log('🔄 FilterBar: Filters changed, updating:', filters);
      prevFiltersRef.current = filtersString;
      onFiltersChange(filters);
    } else {
      console.log('🚫 FilterBar: Filters unchanged, skipping update');
    }
  };

  const loadFilterOptions = async () => {
    try {
      setLoading(true);
      
      const [regionsResponse, segmentsResponse] = await Promise.all([
        cubeApi.getRegions(),
        cubeApi.getCustomerSegments()
      ]);

      const regions = regionsResponse.data.map(row => row['sales.region'] as string).filter(Boolean);
      const segments = segmentsResponse.data.map(row => row['customer_behavior.customers_segment'] as string).filter(Boolean);

      setAvailableRegions(Array.from(new Set(regions)).sort());
      setAvailableSegments(Array.from(new Set(segments)).sort());
    } catch (error) {
      console.error('Failed to load filter options:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    updateFilters();
  }, [selectedRegions, selectedSegments]); // Remove updateFilters from dependencies

  const handleRegionChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    
    // If "All" (empty string) is selected, clear the selection
    if (newValue.includes('')) {
      setSelectedRegions([]);
    } else {
      setSelectedRegions(newValue);
    }
  };

  const handleSegmentChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    
    // If "All" (empty string) is selected, clear the selection
    if (newValue.includes('')) {
      setSelectedSegments([]);
    } else {
      setSelectedSegments(newValue);
    }
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <CircularProgress size={20} />
        <span>Loading filters...</span>
      </Box>
    );
  }

  return (
    <Box display="flex" gap={3} mb={3} flexWrap="wrap">
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Region</InputLabel>
        <Select
          multiple
          value={selectedRegions}
          onChange={handleRegionChange}
          input={<OutlinedInput label="Region" />}
          disabled={disabled}
          renderValue={(selected) => 
            selected.length === 0 ? 'All Regions' : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )
          }
        >
          <MenuItem 
            key="all-regions" 
            value=""
            sx={{ fontStyle: 'italic' }}
          >
            All Regions
          </MenuItem>
          {availableRegions.map((region) => (
            <MenuItem key={region} value={region}>
              {region}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Customer Segment</InputLabel>
        <Select
          multiple
          value={selectedSegments}
          onChange={handleSegmentChange}
          input={<OutlinedInput label="Customer Segment" />}
          disabled={disabled}
          renderValue={(selected) => 
            selected.length === 0 ? 'All Segments' : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )
          }
        >
          <MenuItem 
            key="all-segments" 
            value=""
            sx={{ fontStyle: 'italic' }}
          >
            All Segments
          </MenuItem>
          {availableSegments.map((segment) => (
            <MenuItem key={segment} value={segment}>
              {segment}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterBar;