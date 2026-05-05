import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { AdminLayout } from "./components/layouts/AdminLayout";
import { HomePage } from "./components/customer/HomePage";
import { ProductListingPage } from "./components/customer/ProductListingPage";
import { ProductDetailPage } from "./components/customer/ProductCustomizationPage";
import { CartPage } from "./components/customer/CartPage";
import { CheckoutPage } from "./components/customer/CheckoutPage";
import { OrderHistoryPage } from "./components/customer/OrderTrackingPage";
import { ViewOrderPage } from "./components/customer/ViewOrderPage";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { ProductManagement } from "./components/admin/ProductManagement";
import { OrderManagement } from "./components/admin/OrderManagement";
import { FileReviewPanel } from "./components/admin/FileReviewPanel";
import { InvoiceSection } from "./components/admin/InvoiceSection";
import { CategoryManagement } from "./components/admin/CategoryManagement";
import { SubcategoryManagement } from "./components/admin/SubcategoryManagement";
import { PaperTypeManagement } from "./components/admin/PaperTypeManagement";
import { CutTypeManagement } from "./components/admin/CutTypeManagement";
import { PrintTypeManagement } from "./components/admin/PrintTypeManagement";
import { SizeManagement } from "./components/admin/SizeManagement";
import { ProductManagements } from "./components/admin/ProductManagements";
import { ProductVariantManagement } from "./components/admin/ProductVariantManagement";
import { ProductVariantPriceManagement } from "./components/admin/ProductVariantPriceManagement";
import { ProductDiscountManagement } from "./components/admin/ProductDiscountManagement";
import { ProductSetupManagement } from "./components/admin/ProductSetupManagement";
import { DesignReviewPage } from "./components/customer/DesignReviewPage";
import { LoginPage } from "./components/Auth/LoginPage";
import { WishlistPage } from "./components/customer/WishlistPage";
import { ProfilePage } from "./components/customer/MyProfile";
import VpaPage from "./Payment/VpaPage";
import ReviewsPage from "./components/customer/ReviewPage";
import ProductReviews from "./components/customer/ReviewPage";
import { FAQManagement } from "./components/admin/FaqManagement";
import { AddressPage } from "./components/customer/AddressPage";
import SubcategoryListPage from "./components/customer/SubCategory";
import { DesignManagement } from "./components/admin/DesignManagement";
import RequireAuth from "./RequireAuth";
import { ROLES } from "./types/roles";
import UserRole from "./components/admin/UserRole";
import AddRole from "./components/admin/CreateRole";
import AddResourceActions from "./components/admin/CreateResourcesActions";
import { AttributeManagement } from "./components/admin/AttributeManagement";
import { AttributeValueManagement } from "./components/admin/AttributeValueManagement";
import { ProductAttributeManagement } from "./components/admin/ProductAttributeManagement";
import ProductSetupWrapper from "./components/admin/ProductSetupWrapper";
import { OrderDetailsPage } from "./components/admin/OrderDetailsPage";
import ShiprocketManagement from "./components/shiprocket/ShiprockectManagement";





// export const router = createBrowserRouter([
//   {
//     path: "/",
//     Component: RootLayout,
//     children: [
//       { index: true, Component: HomePage },
//       { path: "products", Component: ProductListingPage },
//       { path: "product/:id", Component: ProductDetailPage },
//       { path: "/design-review", Component: DesignReviewPage },
//       { path: "cart", Component: CartPage },
//       { path: "checkout", Component: CheckoutPage },
//       { path: "orderhistory", Component: OrderHistoryPage },
//       { path: "vieworder/:orderId", Component: ViewOrderPage },
//       { path: "address", Component: AddressPage },
//       { path: "/WishlistPage", Component: WishlistPage },
//       { path: "/MyProfile", Component: ProfilePage },
//       { path: "/VpaPage", Component: VpaPage },
//       { path: "/ReviewsPage", Component: ProductReviews },
//       { path: "/ReviewsPage", Component: ProductReviews },
//       { path: "/subcategorylist", Component: SubcategoryListPage },




// // <Route path="/address" element={<AddressPage />} />
// // <Route path="/checkout" element={<CheckoutPage />} />




//       { path: "login", Component: LoginPage },
//     ],
//   },
//   {
//     path: "/admin",
//     Component: AdminLayout,
//     children: [
//       { index: true, Component: AdminDashboard },
//       { path: "products", Component: ProductManagement },
//       { path: "Category", Component: CategoryManagement },
//       { path: "SubCategory", Component: SubcategoryManagement },
//       { path: "Papertype", Component: PaperTypeManagement },
//       { path: "Cuttype", Component: CutTypeManagement },
//       { path: "Printtype", Component: PrintTypeManagement },
//       { path: "Sizetype", Component: SizeManagement },
//       { path: "product", Component: ProductManagements },
//       { path: "productVarient", Component: ProductVariantManagement },
//       { path: "productDiscount", Component: ProductDiscountManagement },
//       { path: "productVarientPrice", Component: ProductVariantPriceManagement },
//       { path: "ProductSetup", Component: ProductSetupManagement },
//       { path: "Order", Component: OrderManagement },
//       { path: "FAQ", Component: FAQManagement },
//       { path: "Design", Component: DesignManagement },

//     ],
//   },
// ]);


// src/routes/routes.jsx

// import { createBrowserRouter } from "react-router-dom";
// import RequireAuth from "./RequireAuth";
// import { ROLES } from "../constants/roles";

// // Layouts
// import { RootLayout } from "../components/layouts/RootLayout";
// import { AdminLayout } from "../components/layouts/AdminLayout";

// // Customer Pages
// import { HomePage } from "../components/customer/HomePage";
// import { ProductListingPage } from "../components/customer/ProductListingPage";
// import { ProductDetailPage } from "../components/customer/ProductCustomizationPage";
// import { CartPage } from "../components/customer/CartPage";
// import { CheckoutPage } from "../components/customer/CheckoutPage";
// import { OrderHistoryPage } from "../components/customer/OrderTrackingPage";
// import { ViewOrderPage } from "../components/customer/ViewOrderPage";
// import { WishlistPage } from "../components/customer/WishlistPage";
// import { ProfilePage } from "../components/customer/MyProfile";
// import { AddressPage } from "../components/customer/AddressPage";
// import { DesignReviewPage } from "../components/customer/DesignReviewPage";
// import SubcategoryListPage from "../components/customer/SubCategory";
// import VpaPage from "../Payment/VpaPage";
// import ProductReviews from "../components/customer/ReviewPage";

// // Admin Pages
// import { AdminDashboard } from "../components/admin/AdminDashboard";
// import { ProductManagement } from "../components/admin/ProductManagement";
// import { OrderManagement } from "../components/admin/OrderManagement";
// import { CategoryManagement } from "../components/admin/CategoryManagement";
// import { SubcategoryManagement } from "../components/admin/SubcategoryManagement";
// import { PaperTypeManagement } from "../components/admin/PaperTypeManagement";
// import { CutTypeManagement } from "../components/admin/CutTypeManagement";
// import { PrintTypeManagement } from "../components/admin/PrintTypeManagement";
// import { SizeManagement } from "../components/admin/SizeManagement";
// import { ProductManagements } from "../components/admin/ProductManagements";
// import { ProductVariantManagement } from "../components/admin/ProductVariantManagement";
// import { ProductVariantPriceManagement } from "../components/admin/ProductVariantPriceManagement";
// import { ProductDiscountManagement } from "../components/admin/ProductDiscountManagement";
// import { ProductSetupManagement } from "../components/admin/ProductSetupManagement";
// import { FAQManagement } from "../components/admin/FaqManagement";
// import { DesignManagement } from "../components/admin/DesignManagement";

// // Auth
// import { LoginPage } from "../components/Auth/LoginPage";
export const router = createBrowserRouter([
  // ================= PUBLIC =================


  // ================= CUSTOMER =================
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { index: true, element: <HomePage /> },
          {
            path: "/login",
            element: <LoginPage />,
          },
          { path: "products", element: <ProductListingPage /> },
          { path: "product/:id", element: <ProductDetailPage /> },
          { path: "design-review", element: <DesignReviewPage /> },
          { path: "cart", element: <CartPage /> },
          { path: "checkout", element: <CheckoutPage /> },

          // ✅ YOUR ORIGINAL PATHS (KEPT)
          { path: "orderhistory", element: <OrderHistoryPage /> },
          { path: "vieworder/:orderId", element: <ViewOrderPage /> },
          { path: "address", element: <AddressPage /> },
          { path: "wishlist", element: <WishlistPage /> },
          { path: "MyProfile", element: <ProfilePage /> },
          { path: "vpa", element: <VpaPage /> },
          { path: "subcategorylist", element: <SubcategoryListPage /> },
        ],
      },
    ],
  },

  // ================= ADMIN =================
  {
    element: (
      <RequireAuth
        allowedRoles={[
          ROLES.ADMIN,
          ROLES.DESIGNER,
          ROLES.WAREHOUSER,
        ]}
      />
    ),
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },

          // ===== COMMON (ALL ROLES) =====
          { path: "Products", element: <ProductManagements /> },
          { path: "productVarient", element: <ProductVariantManagement /> },
          { path: "productVarientPrice", element: <ProductVariantPriceManagement /> },

          // ===== ADMIN ONLY =====
          {
            element: <RequireAuth allowedRoles={[ROLES.ADMIN]} />,
            children: [
              { path: "Category", element: <CategoryManagement /> },
              { path: "SubCategory", element: <SubcategoryManagement /> },
              { path: "Attribute", element: <AttributeManagement /> },
              { path: "Attribute-values", element: <AttributeValueManagement /> },
              { path: "Product-Attribute", element: <ProductAttributeManagement /> },
              { path: "ProductSetupWrapper", element: <ProductSetupWrapper /> },

              { path: "Papertype", element: <PaperTypeManagement /> },
              { path: "Cuttype", element: <CutTypeManagement /> },
              { path: "Printtype", element: <PrintTypeManagement /> },
              { path: "Sizetype", element: <SizeManagement /> },
              { path: "productDiscount", element: <ProductDiscountManagement /> },
              { path: "ProductSetup", element: <ProductSetupManagement /> },
              { path: "FAQ", element: <FAQManagement /> },
              { path: "Role", element: <UserRole /> },
              { path: "add-role", element: <AddRole /> },
              { path: "resources-actions", element: <AddResourceActions /> },
              { path: "Shiprocket", element: <ShiprocketManagement /> }
            ],
          },
          // ===== DESIGNER + ADMIN =====
          {
            element: (
              <RequireAuth allowedRoles={[ROLES.ADMIN, ROLES.DESIGNER]} />
            ),
            children: [
              { path: "Design", element: <DesignManagement /> },
            ],
          },

          // ===== WAREHOUSER + ADMIN =====
          {
            element: (
              <RequireAuth allowedRoles={[ROLES.ADMIN, ROLES.WAREHOUSER]} />
            ),
            children: [
              { path: "Order", element: <OrderManagement /> },
              { path: "Orders/:orderId", element: <OrderDetailsPage /> },

            ],
          },
        ],
      },
    ],
  },

  // ================= FALLBACK =================
  // {
  //   path: "*",
  //   element: <div>404 Not Found</div>,
  // },
]);