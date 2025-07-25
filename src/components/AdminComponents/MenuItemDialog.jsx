// src/components/AdminComponents/MenuItemDialog.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, FormControlLabel, Switch, Box } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axiosInstance from '../../api/axiosInstance';
import CategoryDialog from './CategoryDialog';
import { useNotification } from "../../context/Notifications";

const MenuItemDialog = ({ open, onClose, onSave, item }) => {
  const [currentItem, setCurrentItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const isEditing = item !== null;
  const { showNotification } = useNotification();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [variationToDelete, setVariationToDelete] = useState({ index: null, id: null });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/api/menu/categories/');
        setCategories(res.data);
      } catch (error) { console.error("Failed to fetch categories", error); }
    };
    if (open) {
      fetchCategories();
      if (item) {
        setCurrentItem(JSON.parse(JSON.stringify(item)));
      } else {
        setCurrentItem({
          name: '', category_id: '', is_available: true,
          variations: [{ size_name: 'Regular', price: '', stock_level: 0, is_available: true }],
        });
      }
      setImageFile(null);
    }
  }, [item, open]);

  const handleCategoryCreated = (newCategory) => {
    setCategories(prev => [...prev, newCategory]);
    setCurrentItem(prev => ({ ...prev, category_id: newCategory.id }));
    setCategoryDialogOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleVariationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariations = [...currentItem.variations];
    updatedVariations[index][name] = value;
    setCurrentItem(prev => ({ ...prev, variations: updatedVariations }));
  };
  
  const addVariation = () => {
    setCurrentItem(prev => ({
      ...prev,
      variations: [...prev.variations, { size_name: '', price: '', stock_level: 0 }],
    }));
  };

  const removeVariation = async (index, variationId) => {
    if (currentItem.variations.length <= 1) {
      showNotification("An item must have at least one variation.");
      return;
    }

    if (variationId) {
      setVariationToDelete({ index, id: variationId });
      setConfirmOpen(true);
    } else {
      const updatedVariations = currentItem.variations.filter((_, i) => i !== index);
      setCurrentItem(prev => ({ ...prev, variations: updatedVariations }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', currentItem.name);
    formData.append('category_id', currentItem.category_id || currentItem.category.id);
    formData.append('is_available', currentItem.is_available);
    
    const variationsKey = isEditing ? 'variations' : 'variations_data';
    formData.append(variationsKey, JSON.stringify(currentItem.variations));

    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    try {
      if (isEditing) {
        await axiosInstance.put(`/api/menu/admin/items/${currentItem.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axiosInstance.post('/api/menu/admin/items/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      onSave();
    } catch (err) {
      showNotification('Error saving item. Check console for details.');
      console.error('Save item error:', err.response?.data || err);
    }
  };

  if (!open || !currentItem) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" gutterBottom>Item Image</Typography>
              <Box sx={{ border: '2px dashed grey', borderRadius: 2, p: 2, textAlign: 'center', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundImage: `url(${imageFile ? URL.createObjectURL(imageFile) : (currentItem.image || '')})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {!imageFile && !currentItem.image && <Typography color="text.secondary">Preview</Typography>}
              </Box>
              <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                Upload Image
                <input type="file" hidden onChange={handleImageChange} accept="image/*" />
              </Button>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="subtitle1" gutterBottom>Item Details</Typography>
              <TextField name="name" label="Item Name" fullWidth margin="normal" value={currentItem.name} onChange={handleChange} />
              <Box display="flex" alignItems="center" gap={1}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select name="category_id" label="Category" value={currentItem.category_id || currentItem.category?.id || ''} onChange={handleChange}>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton onClick={() => setCategoryDialogOpen(true)} color="primary" sx={{ mt: 1 }}><Add /></IconButton>
              </Box>
              <FormControlLabel control={<Switch checked={currentItem.is_available} onChange={handleChange} name="is_available" />} label="Item is Active (uncheck to archive)" />
            </Grid>
          </Grid>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Pricing & Stock</Typography>
          {currentItem.variations.map((v, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
              <Grid item xs={12} sm={4}><TextField label="Variation Name" name="size_name" fullWidth size="small" value={v.size_name} onChange={(e) => handleVariationChange(index, e)} /></Grid>
              <Grid item xs={6} sm={3}><TextField label="Price" name="price" type="number" fullWidth size="small" value={v.price} onChange={(e) => handleVariationChange(index, e)} /></Grid>
              <Grid item xs={6} sm={4}><TextField label="Stock Level" name="stock_level" type="number" fullWidth size="small" value={v.stock_level} onChange={(e) => handleVariationChange(index, e)}  /></Grid>
              <Grid item xs={12} sm={1}><IconButton onClick={() => removeVariation(index, v.id)}><Delete color="error" /></IconButton></Grid>
            </Grid>
          ))}
          <Button onClick={addVariation} startIcon={<Add />}>Add Variation</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{isEditing ? 'Save Changes' : 'Create Item'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete this variation? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              try {
                await axiosInstance.delete(`/api/menu/admin/variations/${variationToDelete.id}/`);
                const updated = currentItem.variations.filter((_, i) => i !== variationToDelete.index);
                setCurrentItem(prev => ({ ...prev, variations: updated }));
                showNotification("Variation deleted.", "success");
              } catch (err) {
                showNotification(err.response?.data?.error || "Failed to delete variation.");
              } finally {
                setConfirmOpen(false);
                setVariationToDelete({ index: null, id: null });
              }
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      <CategoryDialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)} onSuccess={handleCategoryCreated} />
    </>
  );
};

export default MenuItemDialog;