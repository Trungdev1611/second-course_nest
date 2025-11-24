/**
 * API Fallback Utility
 * 
 * Khi API lỗi hoặc chưa có API, tự động fallback về mock data
 * và hiển thị warning cho developer
 */

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

/**
 * Log warning cho developer khi sử dụng mock data
 */
function logMockDataWarning(
  apiName: string,
  error: any,
  mockData: any
) {
  if (!isDev) return;

  const errorMessage = error?.message || error?.response?.statusText || 'Unknown error';
  const errorStatus = error?.response?.status || 'N/A';

  console.group(`⚠️ [API Fallback] ${apiName}`);
  console.warn('API call failed, using mock data instead');
  console.error('Error:', errorMessage);
  console.info('Status:', errorStatus);
  console.info('Mock data:', mockData);
  console.groupEnd();

  // Thêm visual indicator trong dev mode (optional)
  if (typeof window !== 'undefined' && isDev) {
    // Console log với styling
    console.log(
      `%c⚠️ Using Mock Data for ${apiName}`,
      'background: #ff9800; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
    );
    
    // Dispatch custom event để MockDataIndicator có thể hiển thị
    window.dispatchEvent(
      new CustomEvent('mock-data-warning', {
        detail: { apiName, error, mockData },
      })
    );
  }
}

/**
 * Wrapper function để handle API call với fallback to mock data
 */
export async function withApiFallback<T>(
  apiCall: () => Promise<T>,
  mockData: T,
  apiName: string = 'API'
): Promise<T> {
  try {
    const result = await apiCall();
    return result;
  } catch (error: any) {
    // Log warning cho dev
    logMockDataWarning(apiName, error, mockData);
    
    // Return mock data
    return mockData;
  }
}

