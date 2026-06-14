import useSWR from 'swr';
import { Order } from '../types';

// Mock fetcher function for SWR since this is a local/Firebase-simulated app
// In a real app, this would be an API call like: fetch('/api/orders').then(res => res.json())
const fetcher = async (key: string): Promise<Order[]> => {
  // Try to parse from localStorage for the simulation
  const savedOrders = localStorage.getItem('persisted_orders');
  if (savedOrders) {
    try {
      return JSON.parse(savedOrders);
    } catch (e) {
      console.error('Failed to parse orders', e);
      return [];
    }
  }
  return [];
};

export function useOrdersSWR() {
  const { data, error, mutate } = useSWR<Order[]>('orders_data', fetcher, {
    refreshInterval: 3000, // Re-fetch every 3 seconds to replace manual polling
    revalidateOnFocus: true,
  });

  return {
    orders: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
