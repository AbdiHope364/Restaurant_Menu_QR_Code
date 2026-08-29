import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Loader2, Trash2, Info } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { menuApi } from '@ethio-buna/shared';

const DEFAULT_FALLBACK_CATEGORIES = [
  { id: 'cat-main', name: 'Main Courses' },
  { id: 'cat-hot-drinks', name: 'Hot Drinks & Coffee' },
  { id: 'cat-cold-drinks', name: 'Cold Beverages & Juices' },
  { id: 'cat-appetizers', name: 'Appetizers & Starters' },
  { id: 'cat-desserts', name: 'Desserts & Sweets' },
  { id: 'cat-specials', name: 'Chef Specials' },
];

const MenuFormModal = ({ editItem, onClose }) => {
  const { categories: contextCategories, fetchData } = useMenu();
  const fileInputRef = useRef(null);

  const categories = Array.isArray(contextCategories) && contextCategories.length > 0
    ? contextCategories
    : DEFAULT_FALLBACK_CATEGORIES;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: categories[0]?.id || '',
    price: '',
    oldPrice: '',
    description: '',
    preparationTime: '',
    spicyLevel: '0',
    isAvailable: true,
    isFeatured: false,
    ingredients: '',
    allergens: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  // Prefill when editing
  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name || '',
        categoryId: editItem.categoryId || '',
        price: editItem.price?.toString() || '',
        oldPrice: editItem.oldPrice?.toString() || '',
        description: editItem.description || '',
        preparationTime: editItem.preparationTime?.toString() || '',
        spicyLevel: editItem.spicyLevel?.toString() || '0',
        isAvailable: editItem.isAvailable ?? true,
        isFeatured: editItem.isFeatured ?? false,
        ingredients: Array.isArray(editItem.ingredients)
          ? editItem.ingredients.join(', ')
          : '',
        allergens: Array.isArray(editItem.allergens)
          ? editItem.allergens.join(', ')
          : '',
        calories: editItem.calories?.toString() || '',
        protein: editItem.protein || '',
        carbs: editItem.carbs || '',
        fat: editItem.fat || '',
      });

      // Load existing images
      if (editItem.images?.length > 0) {
        setPreviewUrls(editItem.images.map((img) => img.imageUrl));
      }
    }
  }, [editItem]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const handleFiles = (files) => {
    if (!files?.length) return;
    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newUrls]);
  };

  // ---: REORDERING LOGIC ---
  const moveImage = (index, direction) => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;

    // Prevent moving out of bounds
    if (newIndex < 0 || newIndex >= previewUrls.length) return;

    const swap = (arr) => {
      const updated = [...arr];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated;
    };

    setPreviewUrls(swap(previewUrls));
    setSelectedFiles(swap(selectedFiles));
  };

  const removeImage = (index) => {
    if (previewUrls[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Dish name is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const data = new FormData();

      // Basic fields
      data.append('name', formData.name.trim());
      data.append('categoryId', formData.categoryId);
      data.append('price', parseFloat(formData.price));
      data.append('spicyLevel', parseInt(formData.spicyLevel) || 0);
      data.append('isAvailable', formData.isAvailable);
      data.append('isFeatured', formData.isFeatured);

      // Optional fields
      if (formData.oldPrice)
        data.append('oldPrice', parseFloat(formData.oldPrice));
      if (formData.preparationTime)
        data.append('preparationTime', parseInt(formData.preparationTime));
      if (formData.description)
        data.append('description', formData.description);
      if (formData.calories)
        data.append('calories', parseInt(formData.calories));
      if (formData.protein) data.append('protein', formData.protein);
      if (formData.carbs) data.append('carbs', formData.carbs);
      if (formData.fat) data.append('fat', formData.fat);
      if (formData.ingredients)
        data.append('ingredients', formData.ingredients);
      if (formData.allergens) data.append('allergens', formData.allergens);

      // Images
      selectedFiles.forEach((file) => data.append('images', file));

      // Submit
      if (editItem) {
        await menuApi.update(`${editItem.id}`, data);
      } else {
        await menuApi.create(data);
      }

      await fetchData();
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors.reduce(
          (acc, e) => ({ ...acc, [e.field]: e.message }),
          {},
        );
        setErrors(backendErrors);
      } else if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-3">
      <div className="bg-white w-full max-w-4xl h-[95vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-5 bg-white shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {editItem ? 'Edit Dish' : 'Create New Dish'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Manage menu information, nutrition and images
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-slate-100 hover:bg-red-100 transition-all flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Error Banner */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm">
              {errors.general}
            </div>
          )}

          {/* SECTION 1: Basic Information */}
          <div className="bg-slate-50 rounded-3xl p-6 space-y-5">
            <h3 className="font-black text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
              <Info size={16} /> Basic Information
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Dish Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Dish Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Double Cheese Burger"
                  className={`w-full rounded-2xl border px-4 py-3 outline-none transition-all bg-white
                    ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100'}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full rounded-2xl border px-4 py-3 outline-none bg-white
                    ${errors.categoryId ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-orange-500'}`}
                >
                  <option value="">Select category</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-red-500 text-xs">{errors.categoryId}</p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Price * (ETB)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="120"
                  className={`w-full rounded-2xl border px-4 py-3 outline-none bg-white
                    ${errors.price ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-orange-500'}`}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs">{errors.price}</p>
                )}
              </div>

              {/* Old Price */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Old Price (Optional)
                </label>
                <input
                  type="number"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  placeholder="150"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white focus:border-orange-500"
                />
              </div>

              {/* Prep Time */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Preparation Time (mins)
                </label>
                <input
                  type="number"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleChange}
                  placeholder="20"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white focus:border-orange-500"
                />
              </div>

              {/* Spicy Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Spicy Level
                </label>
                <select
                  name="spicyLevel"
                  value={formData.spicyLevel}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white focus:border-orange-500"
                >
                  <option value="0">🌶️ Mild</option>
                  <option value="1">🌶️🌶️ Medium</option>
                  <option value="2">🌶️🌶️🌶️ Hot</option>
                  <option value="3">🌶️🌶️🌶️🌶️ Extra Hot</option>
                </select>
              </div>
            </div>

            {/* SECTION 2: Dish Images */}
            <div className="bg-slate-50 rounded-3xl p-6 space-y-5">
              <h3 className="font-black text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
                <Camera size={16} /> Dish Images
              </h3>

              {/* Hidden Input with Capture Attribute */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              {/* Interaction Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="
      border-4 
      border-dashed 
      border-slate-200 
      rounded-[2.5rem] 
      p-10 
      text-center 
      cursor-pointer 
      hover:border-orange-500 
      hover:bg-orange-50/50 
      transition-all 
      group
    "
              >
                <div className="space-y-4">
                  <div
                    className="
          w-16 h-16 
          bg-orange-100 
          text-orange-600 
          rounded-2xl 
          flex 
          items-center 
          justify-center 
          mx-auto 
          group-hover:bg-orange-600 
          group-hover:text-white 
          transition-all
        "
                  >
                    <Camera size={32} />
                  </div>

                  <div>
                    <h4 className="font-black text-slate-800 uppercase tracking-tight">
                      Capture or Upload
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                      Tap to open camera or browse gallery
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Previews remain the same logic as before */}
              {previewUrls.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {previewUrls.map((img, i) => (
                    <div
                      key={i}
                      className="relative shrink-0 animate-in zoom-in"
                    >
                      <img
                        src={img}
                        alt="Dish preview"
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 3: Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the taste, ingredients and uniqueness..."
                rows={4}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white resize-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* SECTION 4: Nutrition Facts */}
          <div className="bg-slate-50 rounded-3xl p-6 space-y-5">
            <h3 className="font-black text-slate-700 text-sm uppercase tracking-wider">
              Nutrition Facts
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Calories
                </label>
                <input
                  type="text"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="450"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Protein
                </label>
                <input
                  type="text"
                  name="protein"
                  value={formData.protein}
                  onChange={handleChange}
                  placeholder="20g"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Carbs
                </label>
                <input
                  type="text"
                  name="carbs"
                  value={formData.carbs}
                  onChange={handleChange}
                  placeholder="30g"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Fat
                </label>
                <input
                  type="text"
                  name="fat"
                  value={formData.fat}
                  onChange={handleChange}
                  placeholder="10g"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: Ingredients & Allergens */}
          <div className="bg-slate-50 rounded-3xl p-6 space-y-5">
            <h3 className="font-black text-slate-700 text-sm uppercase tracking-wider">
              Ingredients & Allergens
            </h3>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="Ingredients: Cheese, Onion, Tomato, Lettuce..."
              rows={3}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white resize-none focus:border-orange-500"
            />
            <textarea
              name="allergens"
              value={formData.allergens}
              onChange={handleChange}
              placeholder="Allergens: Milk, Gluten, Nuts..."
              rows={3}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none bg-white resize-none focus:border-orange-500"
            />
          </div>

          {/* SECTION 6: Status Switches */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-3 bg-slate-50 rounded-2xl px-5 py-4 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="font-medium">Available for ordering</span>
            </label>

            <label className="flex items-center gap-3 bg-slate-50 rounded-2xl px-5 py-4 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="font-medium">Featured menu item</span>
            </label>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t p-5 bg-white flex gap-3 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl py-4 font-black transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : editItem ? (
              'Update Dish'
            ) : (
              'Publish Dish'
            )}
          </button>
          <button
            onClick={onClose}
            className="px-8 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuFormModal;
