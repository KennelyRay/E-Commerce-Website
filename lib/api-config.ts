// API Configuration for PC Parts
export const API_CONFIG = {
  // GPU Info API
  GPU_API: {
    url: 'https://raw.githubusercontent.com/voidful/gpu-info-api/gpu-data/gpu.json',
    enabled: true,
    timeout: 10000
  },
  
  // CPU Benchmark API
  CPU_API: {
    url: 'https://raw.githubusercontent.com/InstantWindy/ProcessorAPI/main/processors.json',
    enabled: true,
    timeout: 10000
  },
  
  // Alternative API endpoints (backup)
  BACKUP_APIS: {
    techSpecs: 'https://api.techspecs.blog/v2/search',
    pcPartPicker: 'https://pcpartpicker.com/api/products',
    techPowerUp: 'https://www.techpowerup.com/gpu-specs/api'
  },
  
  // Rate limiting
  RATE_LIMIT: {
    requests_per_minute: 60,
    retry_delay: 1000
  },
  
  // Default fallback data
  FALLBACK_DATA: {
    categories: [
      'Graphics Cards',
      'Processors',
      'Memory',
      'Motherboards',
      'Storage',
      'Power Supplies',
      'Peripherals',
      'Monitors'
    ]
  }
};

// API Error types
export enum APIError {
  TIMEOUT = 'TIMEOUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  RATE_LIMITED = 'RATE_LIMITED'
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  message?: string;
} 