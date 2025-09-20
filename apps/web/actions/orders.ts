'use server';

import { orderDAL } from 'core/dal/order';
import type { Order } from 'core/dal/order/order.sql';
import type { UpdateOrderRequest } from 'core/types';

export async function getOrders(): Promise<Order[]> {
  try {
    return await orderDAL.getAllOrders();
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

export async function getOrdersPaginated(page: number = 1, limit: number = 10): Promise<{ orders: Order[], total: number }> {
  try {
    return await orderDAL.getOrdersPaginated(page, limit);
  } catch (error) {
    console.error('Failed to fetch paginated orders:', error);
    return { orders: [], total: 0 };
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    return await orderDAL.getOrderById(id);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return null;
  }
}

export async function updateOrderStatus(id: string, status: UpdateOrderRequest['status']) {
  try {
    if (!status) throw new Error('Status is required');
    return await orderDAL.updateOrder(id, { status });
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
}

export async function deleteOrder(id: string) {
  try {
    return await orderDAL.deleteOrder(id);
  } catch (error) {
    console.error('Failed to delete order:', error);
    throw error;
  }
}
