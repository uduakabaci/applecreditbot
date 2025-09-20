import { getOrdersPaginated } from '../actions/orders';
import { OrdersTable } from '../components/OrdersTable';
import { SearchInput } from '../components/SearchInput';

export default async function OrdersDashboard({
  searchParams
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || '';
  const limit = 10;

  const { orders, total } = await getOrdersPaginated(page, limit, search);

  const totalPages = Math.ceil(total / limit);
  const stats = {
    new: orders.filter(o => o.status === 'new').length,
    approved: orders.filter(o => o.status === 'approved').length,
    rejected: orders.filter(o => o.status === 'rejected').length,
    total: total
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mt-[50px] mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <div>
              <p className="text-sm text-gray-500">New</p>
              <p className="text-2xl font-semibold text-gray-600">{stats.new}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-semibold text-gray-600">{stats.approved}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-semibold text-gray-600">{stats.rejected}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <div>
              <p className="text-sm text-gray-500">Total orders</p>
              <p className="text-2xl font-semibold text-gray-600">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border mb-6">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SearchInput defaultValue={search} />
              </div>
            </div>
          </div>

          {/* Table */}
          <OrdersTable orders={orders} />

          {/* Pagination */}
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
            </div>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <a
                  href={`?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                >
                  Previous
                </a>
              )}

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                if (pageNum > totalPages) return null;

                return (
                  <a
                    key={pageNum}
                    href={`?page=${pageNum}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                    className={`px-3 py-1 text-sm border rounded ${pageNum === page
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </a>
                );
              })}

              {page < totalPages && (
                <a
                  href={`?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                >
                  Next
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
