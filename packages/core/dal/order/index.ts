import { eq } from 'drizzle-orm';
import { db } from '../index';
import { orders, type Order, type NewOrder } from './order.sql';
import type { CreateOrderRequest, UpdateOrderRequest } from '../../types';
import { createID } from "../utils";

export class OrderDAL {
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const id = createID('order');
    const newOrder: NewOrder = {
      id,
      ...data,
    };

    const [createdOrder] = await db.insert(orders).values(newOrder).returning();
    if (!createdOrder) {
      throw new Error('Failed to create order');
    }
    return createdOrder;
  }

  async getOrderById(id: string): Promise<Order | null> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return order ?? null;
  }

  async getOrdersByTelegramUserId(telegramUserId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.telegramUserId, telegramUserId));
  }

  async getAllOrders(): Promise<Order[]> {
    return db.select().from(orders);
  }

  async updateOrder(id: string, data: UpdateOrderRequest): Promise<Order | null> {
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const [updatedOrder] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();

    return updatedOrder ?? null;
  }

  async deleteOrder(id: string): Promise<boolean> {
    await db.delete(orders).where(eq(orders.id, id));
    return true
  }
}

export const orderDAL = new OrderDAL();
export { orders, type Order, type NewOrder };
