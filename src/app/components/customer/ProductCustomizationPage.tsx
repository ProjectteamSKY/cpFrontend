import React from "react";
import { ChevronLeft, AlertCircle } from "lucide-react";

import StepProgress from "../product/StepProgress";
import ReviewsSection from "../product/ReviewsSection";
import { GalleryPanel } from "../product/Gallerypanel";
import { ProductHero } from "../product/Productinfo";
import { ConfigurePanel } from "../product/Configurepanel";
import { SpecsTable } from "../product/SpecsTable";
import { MobileStickyBar } from "../product/MobileStickyBar";
import { ImageGalleryModal } from "../product/ImageGalleryModal";
import { ToastStack } from "../ui/ToasterStack";
import { useProductDetail } from "../../hooks/Useproductdetail";
import FAQ from "./Faqsection";


// PATH CHAGES
// ─── Page ─────────────────────────────────────────────────────────────────────
// PATH CHAGES
export function ProductDetailPage() {
  const ctx = useProductDetail();

  // ── Loading ───────────────────────────────────────────────────────────────
  if (ctx.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="relative w-10 h-10 mx-auto">
            <div className="absolute inset-0 rounded-full border-[3px] border-neutral-100" />
            <div className="absolute inset-0 rounded-full border-[3px] border-neutral-900 border-t-transparent animate-spin" />
          </div>
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-widest">Loading</p>
        </div>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!ctx.product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 text-neutral-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Product Not Found</h2>
            <p className="text-sm text-neutral-400 mt-1">
              This product may have been removed or the link is invalid.
            </p>
          </div>
          <button
            onClick={() => ctx.navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:gap-3 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Go back
          </button>
        </div>
      </div>
    );
  }

  // ── Page ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}>
      {/* <GlobalStyles /> */}

      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center gap-2 text-[11px] text-neutral-400 overflow-x-auto">
          <button
            onClick={() => ctx.navigate("/")}
            className="hover:text-neutral-900 transition-colors font-semibold shrink-0 tracking-wide"
          >
            Home
          </button>
          <span className="text-neutral-200 font-light">/</span>
          <button
            onClick={() => ctx.navigate("/products")}
            className="hover:text-neutral-900 transition-colors font-semibold shrink-0 tracking-wide"
          >
            Products
          </button>
          <span className="text-neutral-200 font-light">/</span>
          <span className="text-neutral-700 font-semibold truncate">{ctx.product.name}</span>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-12">
        <StepProgress current={ctx.currentStep} />
        {/* ══ ROW 1 — Gallery + Hero ══════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 mb-12">
          <div className="h-full">
            <GalleryPanel
              allImages={ctx.allImages}
              selectedImageIndex={ctx.selectedImageIndex}
              setSelectedImageIndex={ctx.setSelectedImageIndex}
              isFavorite={ctx.isFavorite}
              onFavoriteToggle={() => ctx.setIsFavorite((f) => !f)}
              copied={ctx.copied}
              onShare={ctx.handleShare}
              onZoom={() => ctx.setShowGallery(true)}
              productName={ctx.product.name}
            />
          </div>



          <ConfigurePanel
            product={ctx.product}
            allSizes={ctx.allSizes}
            totalPrice={ctx.totalPrice}
            availablePaperTypes={ctx.availablePaperTypes}
            availablePrintTypes={ctx.availablePrintTypes}
            availableCutTypes={ctx.availableCutTypes}

            selectedSize={ctx.selectedSize}
            selectedPaperType={ctx.selectedPaperType}
            selectedPrintType={ctx.selectedPrintType}
            selectedCutType={ctx.selectedCutType}
            selectedSides={ctx.selectedSides}

            selectedVariant={ctx.selectedVariant}
            selectedQuantity={ctx.selectedQuantity}
            useCustomQty={ctx.useCustomQty}
            customQty={ctx.customQty}
            customQtyPrice={ctx.customQtyPrice}

            onSizeChange={ctx.handleSizeChange}
            onPaperChange={ctx.handlePaperChange}
            onPrintChange={ctx.handlePrintChange}
            onCutChange={ctx.setSelectedCutType}
            onSidesChange={ctx.setSelectedSides}
            onQuantitySelect={(id) => {
              ctx.setSelectedQuantity(id);
              ctx.setUseCustomQty(false);
              ctx.setCustomQty("");
            }}
            onCustomQtyToggle={() => {
              ctx.setUseCustomQty(true);
              ctx.setSelectedQuantity("");
            }}
            onCustomQtyChange={ctx.setCustomQty}

            // ✅ Upload wiring
            frontFile={ctx.frontFile}
            backFile={ctx.backFile}
            frontPreview={ctx.frontPreview}
            backPreview={ctx.backPreview}
            onFrontUpload={(file) => ctx.handleFrontUpload({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>)}
            onBackUpload={(file) => ctx.handleBackUpload({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>)}
            onFrontRemove={() => {
              ctx.setFrontFile(null);
              ctx.setFrontPreview(null);
            }}
            onBackRemove={() => {
              ctx.setBackFile(null);
              ctx.setBackPreview(null);
            }}

            ctaDisabled={ctx.ctaDisabled}
            ctaLabel={ctx.ctaLabel}
            onContinue={ctx.handleContinue}
          />
        </div>

        {/* ══ ROW 2 — Configure + Upload ══════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">


          {/* <UploadPanel
            selectedSides={ctx.selectedSides}
            frontFile={ctx.frontFile}
            backFile={ctx.backFile}
            frontPreview={ctx.frontPreview}
            backPreview={ctx.backPreview}
            onFrontUpload={ctx.handleFrontUpload}
            onBackUpload={ctx.handleBackUpload}
            onFrontRemove={() => { ctx.setFrontFile(null); ctx.setFrontPreview(null); }}
            onBackRemove={() => { ctx.setBackFile(null); ctx.setBackPreview(null); }}
            selectedVariant={ctx.selectedVariant}
            selectedQuantity={ctx.selectedQuantity}
            useCustomQty={ctx.useCustomQty}
            customQty={ctx.customQty}
            totalPrice={ctx.totalPrice}
            ctaDisabled={ctx.ctaDisabled}
            ctaLabel={ctx.ctaLabel}
            onContinue={ctx.handleContinue}
          /> */}
        </div>

        {/* ══ ROW 3 — Specs Table ═════════════════════════════════════ */}
        <SpecsTable
          variants={ctx.variants}
          selectedVariant={ctx.selectedVariant}
          selectedQuantity={ctx.selectedQuantity}
        />

        {/* ══ ROW 4 — Reviews ═════════════════════════════════════════ */}
        <ReviewsSection product={ctx.product} />
        <FAQ categoryId={ctx.product.category_id} productId={ctx.product.id} />

      </div>

      {/* ── Mobile sticky bar ──────────────────────────────────────── */}
      <MobileStickyBar
        selectedVariant={ctx.selectedVariant}
        totalPrice={ctx.totalPrice}
        ctaDisabled={ctx.ctaDisabled}
        onContinue={ctx.handleContinue}
      />

      {/* ── Gallery modal ──────────────────────────────────────────── */}
      {ctx.showGallery && (
        <ImageGalleryModal
          images={ctx.allImages}
          selectedIndex={ctx.selectedImageIndex}
          productName={ctx.product.name}
          onClose={() => ctx.setShowGallery(false)}
          onPrev={() =>
            ctx.setSelectedImageIndex(
              ctx.selectedImageIndex > 0
                ? ctx.selectedImageIndex - 1
                : ctx.allImages.length - 1
            )
          }
          onNext={() =>
            ctx.setSelectedImageIndex(
              ctx.selectedImageIndex < ctx.allImages.length - 1
                ? ctx.selectedImageIndex + 1
                : 0
            )
          }
          onSelect={ctx.setSelectedImageIndex}
        />
      )}

      {/* ── Toasts ────────────────────────────────────────────────── */}
      <ToastStack toasts={ctx.toasts} onDismiss={ctx.dismiss} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

      </div>

    </div>

  );
}


