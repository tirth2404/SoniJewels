import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

const ProductManagement = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { products } = useSelector((state) => state.products);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-8">
        <button
          onClick={() => window.history.back()}
          className="btn btn-outline rounded-full mb-4 w-10 h-10 flex items-center justify-center text-burgundy border-burgundy hover:bg-burgundy hover:text-white transition-colors"
          aria-label="Back to Admin Dashboard"
        >
          <span className="text-2xl font-bold">&larr;</span>
        </button>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading">Product Management</h1>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add New Product
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={product.images[0]}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-burgundy hover:text-burgundy-dark mr-3"
                        aria-label="Edit product"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h2 className="text-2xl font-heading mb-6">
              {selectedProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form className="space-y-4">
              <div>
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={selectedProduct?.name}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-input">
                    <option value="rings">Rings</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="bracelets">Bracelets</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue={selectedProduct?.price}
                  />
                </div>
                <div>
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue={selectedProduct?.stock || ''}
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input min-h-[100px]"
                  defaultValue={selectedProduct?.description}
                ></textarea>
              </div>
              
              <div>
                <label className="form-label">Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">
                    Drag and drop images here, or click to select files
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;