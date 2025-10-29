import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CardHeader,
  FormHelperText,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VITE_API_BASE_URL } from "../../utils/State";

const categories = ["AC Units", "Parts", "Electronics", "Accessories"];

// KPI Card Component
const KpiCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export default function InventoryManagementContent() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    warrantyMonths: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authKey");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // ✅ Fetch All Products
  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(
        `${VITE_API_BASE_URL}/products/all`,
        axiosConfig
      );
      setProducts(
        response.data.map((p) => ({
          id: p.productId,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock,
          warrantyMonths: p.warrantyMonths,
          status:
            p.stock === 0
              ? "Out of Stock"
              : p.stock < 10
              ? "Low Stock"
              : "In Stock",
        }))
      );
    } catch (err) {
      toast.error("Failed to fetch products");
      console.error("Fetch Products Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setEditing(false);
    setSelectedId(null);
    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      warrantyMonths: "",
    });
    setErrors({});
  };

  // ✅ Validation Function
  const validateForm = () => {
    const newErrors = {};

    if (!newProduct.name.trim()) newErrors.name = "Product name is required.";
    if (!newProduct.category)
      newErrors.category = "Please select a category.";
    if (newProduct.price === "" || newProduct.price < 0)
      newErrors.price = "Enter a valid price.";
    if (newProduct.stock === "" || newProduct.stock < 0)
      newErrors.stock = "Enter a valid stock quantity.";
    if (newProduct.warrantyMonths === "" || newProduct.warrantyMonths < 0)
      newErrors.warrantyMonths = "Enter valid warranty months.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Add Product
  const handleAddProduct = async () => {
    if (!validateForm()) {
      toast.warning("Please fix form errors before submitting.");
      return;
    }
    try {
      setLoading(true);
      const body = {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        warrantyMonths: parseInt(newProduct.warrantyMonths),
      };
      const response = await axios.post(
        `${VITE_API_BASE_URL}/products/create`,
        body,
        axiosConfig
      );
      const data = response.data;
      setProducts((prev) => [
        ...prev,
        {
          id: data.productId,
          name: data.name,
          category: data.category,
          price: data.price,
          stock: data.stock,
          warrantyMonths: data.warrantyMonths,
          status:
            data.stock === 0
              ? "Out of Stock"
              : data.stock < 10
              ? "Low Stock"
              : "In Stock",
        },
      ]);
      toast.success("Product added successfully!");
      handleClose();
    } catch (err) {
      toast.error("Error adding product");
      console.error("Add Product Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit Product
  const handleEditProduct = (product) => {
    setEditing(true);
    setSelectedId(product.id);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      warrantyMonths: product.warrantyMonths,
    });
    setOpen(true);
  };

  // ✅ Update Product
  const handleUpdateProduct = async () => {
    if (!validateForm()) {
      toast.warning("Please fix form errors before submitting.");
      return;
    }
    try {
      setLoading(true);
      const body = {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        warrantyMonths: parseInt(newProduct.warrantyMonths),
      };
      const response = await axios.put(
        `${VITE_API_BASE_URL}/products/${selectedId}/update`,
        body,
        axiosConfig
      );
      const updated = response.data;

      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedId
            ? {
                id: updated.productId,
                name: updated.name,
                category: updated.category,
                price: updated.price,
                stock: updated.stock,
                warrantyMonths: updated.warrantyMonths,
                status:
                  updated.stock === 0
                    ? "Out of Stock"
                    : updated.stock < 10
                    ? "Low Stock"
                    : "In Stock",
              }
            : p
        )
      );
      toast.success("Product updated successfully!");
      handleClose();
    } catch (err) {
      toast.error("Error updating product");
      console.error("Update Product Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(
        `${VITE_API_BASE_URL}/products/${id}/delete`,
        axiosConfig
      );
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully!");
    } catch (err) {
      toast.error("Error deleting product");
      console.error("Delete Product Error:", err.response?.data || err.message);
    }
  };

  // ✅ Stock Status Chip
  const getStatusChip = (status) => {
    let color = "default";
    if (status === "In Stock") color = "success";
    if (status === "Low Stock") color = "warning";
    if (status === "Out of Stock") color = "error";
    return (
      <Chip label={status} color={color} size="small" variant="outlined" />
    );
  };

  const kpiData = useMemo(() => {
    const lowStockCount = products.filter(
      (p) => p.status === "Low Stock"
    ).length;
    const outOfStockCount = products.filter(
      (p) => p.status === "Out of Stock"
    ).length;
    return [
      {
        title: "Total Products",
        value: products.length,
        icon: <InventoryIcon />,
        color: "primary",
      },
      {
        title: "Total Categories",
        value: categories.length,
        icon: <CategoryIcon />,
        color: "info",
      },
      {
        title: "Low Stock Items",
        value: lowStockCount,
        icon: <WarningAmberIcon />,
        color: "warning",
      },
      {
        title: "Out of Stock Items",
        value: outOfStockCount,
        icon: <ReportProblemIcon />,
        color: "error",
      },
    ];
  }, [products]);

  return (
    <Box>
      {/* ✅ Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* KPI Cards */}
      <Grid container spacing={4} mb={3}>
        {kpiData.map((kpi, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <KpiCard
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              color={kpi.color}
            />
          </Grid>
        ))}
      </Grid>

      {/* Products Table */}
      <Box sx={{ width: "100%", mt: 2 }}>
        <Card>
          <CardHeader
            title="Product Inventory"
            action={
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleClickOpen}
              >
                Add Product
              </Button>
            }
          />
          <TableContainer
            sx={{
              height: "calc(100vh - 280px)",
              overflowY: "auto",
              overflowX: "auto",
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {[
                    "Product Name",
                    "Category",
                    "Price",
                    "Stock",
                    "Warranty (Months)",
                    "Status",
                    "Action",
                  ].map((head) => (
                    <TableCell key={head}>{head}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar variant="rounded">
                          <InventoryIcon />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {product.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      ₹{product.price.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {product.stock}
                    </TableCell>
                    <TableCell>{product.warrantyMonths}</TableCell>
                    <TableCell>{getStatusChip(product.status)}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditProduct(product)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Add / Edit Product Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editing ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              autoFocus
              label="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />

            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category}</FormHelperText>
              )}
            </FormControl>

            <TextField
              label="Price"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              error={!!errors.price}
              helperText={errors.price}
              inputProps={{ min: 0 }}
              fullWidth
            />

            <TextField
              label="Stock Quantity"
              type="number"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
              error={!!errors.stock}
              helperText={errors.stock}
              inputProps={{ min: 0 }}
              fullWidth
            />

            <TextField
              label="Warranty Months"
              type="number"
              value={newProduct.warrantyMonths}
              onChange={(e) =>
                setNewProduct({ ...newProduct, warrantyMonths: e.target.value })
              }
              error={!!errors.warrantyMonths}
              helperText={errors.warrantyMonths}
              inputProps={{ min: 0 }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px" }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (editing) {
                await handleUpdateProduct();
              } else {
                await handleAddProduct();
              }
            }}
            disabled={loading}
          >
            {loading ? "Saving..." : editing ? "Update Product" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
