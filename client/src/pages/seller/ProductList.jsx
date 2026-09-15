import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

function ProductList() {
  const { products, currency, axios, fetchProducts } = useAppContext();
  const [editState, setEditState] = useState({});

  const handleEdit = (id, quantity) => {
    setEditState((prev) => ({
      ...prev,
      [id]: { value: quantity, editing: true },
    }));
  };

  const handleChange = (id, value) => {
    setEditState((prev) => ({
      ...prev,
      [id]: { ...prev[id], value },
    }));
  };

  const handleCancel = (id, quantity) => {
    setEditState((prev) => ({
      ...prev,
      [id]: { value: quantity, editing: false },
    }));
  };

  const handleUpdate = async (id) => {
    try {
      const { value } = editState[id];
      const { data } = await axios.post("/api/product", {
        id,
        quantity: parseInt(value, 10),
      });
      if (data.success) {
        toast.success("Stock updated successfully");
        setEditState((prev) => ({
          ...prev,
          [id]: { ...prev[id], editing: false },
        }));
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing? This can't be undone.")) return;
    try {
      const { data } = await axios.delete(`/api/product/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">Farm Produce Inventory</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Produce</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">
                  Price ({currency})
                </th>
                <th className="px-4 py-3 font-semibold truncate">
                  Unit / Stock
                </th>
                <th className="px-4 py-3 font-semibold truncate">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product) => {
                const state = editState[product.id] || {
                  value: product.quantity,
                  editing: false,
                };

                return (
                  <tr key={product.id} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="border border-gray-300 rounded overflow-hidden w-16 h-16 flex items-center justify-center bg-gray-100">
                        <img
                          src={product.images[0]}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="truncate font-medium text-gray-800">
                          {product.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {product.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {currency}
                      {product.offerPrice || product.price}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-primary-dull">
                          {product.unit}
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={state.value}
                            onChange={(e) =>
                              handleChange(product.id, e.target.value)
                            }
                            onFocus={() =>
                              handleEdit(product.id, product.quantity)
                            }
                            className="w-20 px-2 py-1 border border-gray-400 rounded outline-none text-center"
                          />
                          {state.editing && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdate(product.id)}
                                className="px-3 py-1 bg-primary hover:bg-primary-dull text-white cursor-pointer rounded-[5px]"
                              >
                                Save
                              </button>
                              <button
                                onClick={() =>
                                  handleCancel(product.id, product.quantity)
                                }
                                className="px-3 py-1 bg-gray-500 text-white rounded-[5px] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
