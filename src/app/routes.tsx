import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { AdminLayout } from "./components/layouts/AdminLayout";
import { HomePage } from "./components/customer/HomePage";
import { ProductListingPage } from "./components/customer/ProductListingPage";
import { ProductDetailPage } from "./components/customer/ProductCustomizationPage";
import { CartPage } from "./components/customer/CartPage";
import { CheckoutPage } from "./components/customer/CheckoutPage";
import { OrderTrackingPage } from "./components/customer/OrderTrackingPage";
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





export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "products", Component: ProductListingPage },
      { path: "product/:id", Component: ProductDetailPage },
      { path: "/design-review", Component: DesignReviewPage },
      { path: "cart", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "order-tracking/:orderId", Component: OrderTrackingPage },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "products", Component: ProductManagement },
      { path: "Category", Component: CategoryManagement },
      { path: "SubCategory", Component: SubcategoryManagement },
      { path: "Papertype", Component: PaperTypeManagement },
      { path: "Cuttype", Component: CutTypeManagement },
      { path: "Printtype", Component: PrintTypeManagement },
      { path: "Sizetype", Component: SizeManagement },
      { path: "product", Component: ProductManagements },
      { path: "productVarient", Component: ProductVariantManagement },
      { path: "productDiscount", Component: ProductDiscountManagement },

      { path: "productVarientPrice", Component: ProductVariantPriceManagement },
      { path: "ProductSetup", Component: ProductSetupManagement },

      // { path: "orders", Component: OrderManagement },
      // { path: "file-review", Component: FileReviewPanel },
      // { path: "invoices", Component: InvoiceSection },
    ],
  },
]);
