# PC Parts API Integration

This document explains how VertixHub integrates with external REST APIs to fetch PC parts data.

## Overview

VertixHub now supports loading PC parts data from external APIs instead of relying solely on static JSON files or manual data entry. This integration provides:

- **Real-time data**: Fresh product information from reliable sources
- **Automatic updates**: Products stay current without manual intervention
- **Fallback protection**: Graceful degradation when APIs are unavailable
- **Admin controls**: Easy API management through the admin panel

## Supported APIs

### 1. GPU Database API
- **Source**: GitHub repository with GPU specifications
- **Endpoint**: `https://raw.githubusercontent.com/InstantWindy/GPU-Z-JSON-Database/main/GPU_Database.json`
- **Data**: Graphics cards with specifications, memory, manufacturers
- **Fallback**: Pre-defined list of popular NVIDIA/AMD GPUs

### 2. CPU Database API
- **Source**: Tech specs dataset with processor information
- **Endpoint**: `https://raw.githubusercontent.com/filipamiralopes/tech-specs-dataset/main/cpu_data.json`
- **Data**: Processors with cores, clock speeds, manufacturers
- **Fallback**: Pre-defined list of Intel/AMD processors

### 3. Generated Components
For components not available via API, the system generates realistic data for:
- RAM/Memory modules
- Motherboards
- Storage (SSDs/HDDs)
- Power Supplies
- Peripherals
- Monitors

## How It Works

### 1. Automatic Loading
When the application starts and finds no products in the database:
```typescript
// Auto-load from APIs if database is empty
if (dbProducts.length === 0) {
  await db.loadProductsFromAPI();
  const apiProducts = await db.getAllProducts();
  setProducts(apiProducts);
}
```

### 2. Manual Loading
Administrators can manually trigger API loading:
- Admin Panel → "Load from API" button
- Database Admin → "Load API Data" button
- API Test Page → Individual API testing

### 3. Error Handling
The system includes robust error handling:
- **Timeouts**: 10-second timeout per API call
- **Retry logic**: Built-in retry mechanisms
- **Fallback data**: Local fallback if APIs fail
- **User feedback**: Toast notifications for status updates

## Usage Examples

### For Developers

#### Import the API service:
```typescript
import { fetchAllPCPartsData, fetchGPUData, fetchCPUData } from '@/lib/pc-parts-api';
```

#### Load all PC parts:
```typescript
const products = await fetchAllPCPartsData();
console.log(`Loaded ${products.length} products from APIs`);
```

#### Load specific component types:
```typescript
const gpus = await fetchGPUData();
const cpus = await fetchCPUData();
```

#### Integrate with database:
```typescript
await db.loadProductsFromAPI();
const allProducts = await db.getAllProducts();
```

### For Administrators

#### Access API Testing:
1. Login as admin
2. Navigate to `/admin/api-test`
3. Test individual APIs or load complete dataset
4. View real-time results and product previews

#### Load Products from Admin Panel:
1. Go to Admin Dashboard
2. Click "Load from API" button
3. Confirm the action
4. Wait for loading completion

#### Database Management:
1. Admin Panel → Database section
2. Use "Load API Data" for fresh data
3. Use "Reset Database" to clear and reload

## Configuration

### API Settings
Configured in `lib/pc-parts-api.ts`:
```typescript
const API_CONFIG = {
  timeout: 10000,        // 10 second timeout
  retryAttempts: 3,      // Retry failed requests
  retryDelay: 1000       // 1 second between retries
};
```

### Rate Limiting
- Built-in request throttling
- Respectful API usage
- Automatic backoff on errors

## Error Handling

### Common Issues
1. **Network timeouts**: APIs may be slow or unavailable
2. **CORS errors**: Browser security restrictions
3. **Rate limiting**: Too many requests to external APIs
4. **Invalid data**: API responses may have unexpected formats

### Solutions
1. **Fallback data**: Local product lists when APIs fail
2. **Error logging**: Detailed console logs for debugging
3. **User feedback**: Clear status messages
4. **Graceful degradation**: App continues working without APIs

## Data Structure

### Product Schema
```typescript
interface Product {
  id: string;                    // Generated unique ID
  name: string;                  // Product name from API
  description: string;           // Generated description
  price: number;                 // Calculated price
  originalPrice?: number;        // MSRP pricing
  image: string;                 // Category-appropriate image
  category: string;              // Component category
  stock: number;                 // Random stock levels
  rating: number;                // Generated ratings
  reviews: number;               // Review counts
  featured?: boolean;            // Featured products
  tags: string[];                // Search tags
  specifications?: object;       // Technical specs
}
```

### API Response Processing
Each API response is processed to match the internal Product schema:
- **Data cleaning**: Remove invalid entries
- **Price generation**: Realistic pricing based on category
- **Image assignment**: Category-appropriate product images
- **Specification mapping**: Technical details from API data

## Benefits

### For Users
- **Fresh content**: Always up-to-date product listings
- **Real specifications**: Accurate technical information
- **Better search**: Rich product data enables better filtering

### For Administrators
- **Reduced maintenance**: Less manual product entry
- **Scalability**: Easy to add new product categories
- **Testing tools**: Built-in API testing interface

### For Developers
- **Modular design**: Easy to add new API sources
- **Type safety**: Full TypeScript support
- **Error resilience**: Robust error handling

## Future Enhancements

### Planned Features
1. **Additional APIs**: More component categories
2. **Price tracking**: Historical pricing data
3. **Stock monitoring**: Real-time availability
4. **Review integration**: User review aggregation

### Potential Integrations
- Newegg API (when available)
- Amazon Product API
- Best Buy API
- Manufacturer APIs (ASUS, MSI, etc.)

## Troubleshooting

### If APIs aren't working:
1. Check browser console for errors
2. Test individual APIs in the API test page
3. Verify network connectivity
4. Try refreshing the database

### If products aren't loading:
1. Clear browser localStorage
2. Reset database from admin panel
3. Manually trigger "Load from API"
4. Check for JavaScript errors

### For developers:
1. Monitor network requests in DevTools
2. Check console logs for detailed errors
3. Test API endpoints directly in browser
4. Verify TypeScript compilation

## Security Considerations

- **No API keys**: Uses public APIs only
- **Client-side only**: No server-side API calls
- **CORS handling**: Proper cross-origin request handling
- **Rate limiting**: Respectful API usage patterns

This integration makes VertixHub a more dynamic and data-rich e-commerce platform while maintaining reliability and user experience. 