import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import { assets } from '../../assets/assets.js';
import toast from 'react-hot-toast';

function Orders() {
  const { currency, axios } = useAppContext();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFarmerSales = async () => {
    try {
      const { data } = await axios.get('/api/order/farmer/sales');
      if (data.success) {
        setSales(data.sales);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const { data } = await axios.post('/api/order/status', { orderId, status: newStatus });
      if (data.success) {
        toast.success("Order status updated!");
        fetchFarmerSales(); // Refresh list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchFarmerSales();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading farmer sales...</div>;
  }

  return (
    <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
      <div className="md:p-10 p-4 space-y-4 max-w-5xl">
        <h2 className="text-xl font-semibold text-gray-800">Farm Orders & Sales</h2>
        
        {sales.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
            No orders for your produce yet. Keep your inventory updated!
          </div>
        ) : (
          sales.map((item) => (
            <div key={item.id} className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 rounded-md border border-gray-300 bg-white shadow-sm">
              
              {/* Product Info */}
              <div className="flex gap-4 items-center max-w-xs">
                <img className="w-16 h-16 object-cover rounded border" src={item.product.images[0] || assets.box_icon} alt="Produce" />
                <div>
                  <p className="font-medium text-gray-800">{item.product.name}</p>
                  <p className="text-xs text-gray-500">Unit: {item.product.unit}</p>
                  <p className="text-primary font-semibold mt-1">Qty ordered: {item.quantity}</p>
                </div>
              </div>

              {/* Buyer & Shipping Address */}
              <div className="text-sm text-gray-600 space-y-0.5">
                <p className='font-semibold text-gray-800'>{item.order.address.firstName} {item.order.address.lastName} ({item.order.user.email})</p>
                <p>{item.order.address.street}, {item.order.address.city}, {item.order.address.state}</p>
                <p className="font-medium text-gray-700">Phone: {item.order.address.phone}</p>
              </div>

              {/* Total Item Price */}
              <div className="font-semibold text-lg text-gray-800">
                {currency}{Number(item.price) * item.quantity}
              </div>

              {/* Meta & Status Changer */}
              <div className="flex flex-col text-sm text-gray-600 gap-1.5 min-w-[160px]">
                <p>Method: <span className="font-medium">{item.order.paymentType}</span></p>
                <p>Paid: <span className={item.order.isPaid ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>{item.order.isPaid ? "Paid Online" : "Pending COD"}</span></p>
                <p className="text-xs text-gray-400">Date: {new Date(item.createdAt).toLocaleDateString()}</p>
                
                {/* Status Dropdown */}
                <div className="mt-1 flex items-center gap-2">
                  <select 
                    value={item.order.status} 
                    onChange={(e) => updateStatus(item.order.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-xs outline-none bg-gray-50 font-medium text-gray-700">
                      <option value="ORDER_PLACED">Order Placed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;