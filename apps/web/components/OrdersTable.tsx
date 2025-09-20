'use client';

import { useState } from 'react';
import { MoreIcon } from './icons/more';
import type { Order } from 'core/dal/order/order.sql';
import { updateOrderStatus, deleteOrder } from '../actions/orders';
import { useRouter } from 'next/navigation';

function getStatusColor(status: string) {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-800';
    case 'in_review': return 'bg-yellow-100 text-yellow-800';
    case 'approved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getDeviceIcon(device: string) {
  switch (device) {
    case 'iPhone': return '📱';
    case 'iPad': return '📱';
    case 'Mac': return '💻';
    default: return '📱';
  }
}

interface OrderRowProps {
  order: Order;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

function OrderRow({ order, onStatusUpdate, onDelete }: OrderRowProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(order.id, e.target.value);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this order?')) {
      setIsDeleting(true);
      try {
        await onDelete(order.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleChatWithUser = () => {
    const telegramUrl = order.telegramUsername
      ? `https://t.me/${order.telegramUsername.replace('@', '')}`
      : `https://t.me/${order.telegramUserId}`;

    window.open(telegramUrl, '_blank');
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="p-4">
        <div className="flex items-center gap-3">
          {/* <input type="checkbox" className="rounded" /> */}
          <div>
            <p className="font-medium text-gray-900">{order.fullName}</p>
            <p className="text-sm text-gray-500">{order.telegramUsername || `User ${order.telegramUserId}`}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
          {order.status.toUpperCase()}
        </span>
      </td>
      <td className="p-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>{getDeviceIcon(order.device)}</span>
          <span className="text-sm">{order.device}</span>
        </div>
      </td>
      <td className="p-4 text-sm text-gray-600">{order.country}</td>
      <td className="p-4 text-sm text-gray-600">{order.icloudEmail}</td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${order.consentGroupInvite ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {order.consentGroupInvite ? 'YES' : 'NO'}
        </span>
      </td>
      <td className="p-4 text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
      <td className="p-4">
        <div className="relative group">
          <button className="p-1 hover:bg-gray-100 rounded" disabled={isUpdating || isDeleting}>
            <MoreIcon className="w-4 h-4 text-gray-400" />
          </button>
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <div className="py-1">
              <button
                onClick={handleChatWithUser}
                className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
              >
                <span>💬</span>
                <span>Chat with User</span>
              </button>
              <div className="border-t">
                <div className="px-4 py-2 text-xs text-gray-500 font-medium">
                  Update Status
                </div>
                <div className="px-4 py-1">
                  <select
                    className="w-full text-xs border rounded px-2 py-1 text-gray-500"
                    defaultValue={order.status}
                    onChange={handleStatusChange}
                    disabled={isUpdating}
                  >
                    <option value="new">New</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="border-t">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                >
                  <span>{isDeleting ? 'Deleting...' : 'Delete Order'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateOrderStatus(id, status as any);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteOrder(id);
    router.refresh();
  };

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-50 border-b text-xs font-medium text-gray-500 uppercase">
          <th className="text-left p-4">ORDER</th>
          <th className="text-left p-4">STATUS</th>
          <th className="text-left p-4">DEVICE</th>
          <th className="text-left p-4">COUNTRY</th>
          <th className="text-left p-4">EMAIL</th>
          <th className="text-left p-4">CONSENT</th>
          <th className="text-left p-4">LAST ACTION</th>
          <th className="text-left p-4">ACTIONS</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
          />
        ))}
      </tbody>
    </table>
  );
}
