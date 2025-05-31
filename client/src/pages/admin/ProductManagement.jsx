import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, ChevronLeft, X } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost/SoniJewels/server/products';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [features, setFeatures] = useState(['']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/get_products.php`);
      if (response.data.status === 'success') {
        setProducts(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setImages(product.images || []);
    setFeatures(product.features || ['']);
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    
    // Add each file to FormData
    files.forEach(file => {
      formData.append('images[]', file);
    });

    try {
      // Upload images to server
      const response = await axios.post(`${API_URL}/upload_images.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status === 'success') {
        // Add new image URLs to state
        // setImages([...images, ...response.data.urls]);
        setImages([...images, ...response.data.data.urls]);
      } else {
        setError('Failed to upload images');
      }
    } catch (err) {
      setError('Failed to upload images');
      console.error('Error uploading images:', err);
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      category: formData.get('category'),
      material: formData.get('material'),
      stock: parseInt(formData.get('stock')),
      featured: formData.get('featured') === 'on',
      images: images,
      features: features.filter(f => f.trim() !== '')
    };

    try {
      if (selectedProduct) {
        // Update existing product
        productData.id = selectedProduct.id;
        const response = await axios.put(`${API_URL}/update_product.php`, productData);
        if (response.data.status === 'success') {
          fetchProducts();
          setIsModalOpen(false);
        } else {
          setError(response.data.message);
        }
      } else {
        // Add new product
        const response = await axios.post(`${API_URL}/add_product.php`, productData);
        if (response.data.status === 'success') {
          fetchProducts();
          setIsModalOpen(false);
        } else {
          setError(response.data.message);
        }
      }
    } catch (err) {
      setError('Failed to save product');
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.delete(`${API_URL}/delete_product.php?id=${id}`);
        if (response.data.status === 'success') {
          fetchProducts();
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-8">
        <button
          onClick={() => window.history.back()}
          className="rounded-full mb-4 w-10 h-10 flex items-center justify-center border-2 border-burgundy bg-white group hover:bg-burgundy transition-colors shadow"
          aria-label="Back to Admin Dashboard"
          type="button"
        >
          <ChevronLeft size={28} strokeWidth={3} className="text-burgundy group-hover:text-gold transition-colors" />
        </button>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading">Product Management</h1>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setImages([]);
              setFeatures(['']);
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
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Featured</th>
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
                            src={`http://localhost${product.images[0].replace(/\\/g, '/')}`}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">SKU: JWLRY-{product.id.toString().padStart(4, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.featured
                          ? 'bg-gold bg-opacity-20 text-gold'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.featured ? 'Featured' : 'Regular'}
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
                        onClick={() => handleDelete(product.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto relative">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading text-gray-900">
                  {selectedProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={selectedProduct?.name}
                      required
                      className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      defaultValue={selectedProduct?.category}
                      required
                      className="form-select w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
                    >
                      <option value="">Select Category</option>
                      <option value="rings">Rings</option>
                      <option value="necklaces">Necklaces</option>
                      <option value="earrings">Earrings</option>
                      <option value="bracelets">Bracelets</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={selectedProduct?.description}
                    rows={3}
                    className="form-textarea w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      defaultValue={selectedProduct?.price}
                      required
                      min="0"
                      step="0.01"
                      className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">
                      Material
                    </label>
                    <input
                      type="text"
                      id="material"
                      name="material"
                      defaultValue={selectedProduct?.material}
                      className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      defaultValue={selectedProduct?.stock}
                      required
                      min="0"
                      className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
                    />
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square group">
                        <img
                          src={`http://localhost${image.replace(/\\/g, '/')}`}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Remove image"
                        >
                          <X size={16} className="text-gray-600" />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-burgundy transition-colors group">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="text-center">
                        <ImageIcon size={24} className="mx-auto text-gray-400 group-hover:text-burgundy transition-colors" />
                        <span className="text-sm text-gray-500 mt-1 group-hover:text-burgundy transition-colors">Add Images</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features
                  </label>
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          className="form-input flex-1 rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
                          placeholder="Enter feature"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Remove feature"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="text-sm text-burgundy hover:text-burgundy-dark transition-colors"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    defaultChecked={selectedProduct?.featured}
                    className="form-checkbox h-4 w-4 text-burgundy rounded border-gray-300 focus:ring-burgundy"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                    Featured Product
                  </label>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4 mt-6">
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-burgundy border border-transparent rounded-md shadow-sm hover:bg-burgundy-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy"
                    >
                      {selectedProduct ? 'Update Product' : 'Add Product'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;