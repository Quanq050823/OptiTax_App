// // hooks/useProducts.ts
// import { useState, useEffect, useCallback } from "react";
// import { getProducts, createProduct, deleteProduct } from "@/src/services/API/productService";

// export const useProducts = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const data = await getProducts();
//       setProducts(data as Product[]);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const addProduct = useCallback(async (product: Product) => {
//     const created = await createProduct(product);
//     await fetchData();
//     return created;
//   }, [fetchData]);

//   const removeProduct = useCallback(async (id: string) => {
//     await deleteProduct(id);
//     await fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return {
//     products,
//     loading,
//     fetchData,
//     addProduct,
//     removeProduct
//   };
// };
