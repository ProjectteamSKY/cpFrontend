import { useState } from "react";
import { useParams, Link } from "react-router";
import { Upload, FileCheck, Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function ProductCustomizationPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(100);
  const [size, setSize] = useState("standard");
  const [material, setMaterial] = useState("matte");
  const [lamination, setLamination] = useState("none");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const basePrice = 299;
  const materialPrices = { matte: 0, glossy: 50, premium: 150 };
  const laminationPrices = { none: 0, standard: 100, premium: 200 };
  const sizePrices = { standard: 0, large: 200, custom: 300 };

  const calculatePrice = () => {
    const total = (
      basePrice + 
      materialPrices[material as keyof typeof materialPrices] + 
      laminationPrices[lamination as keyof typeof laminationPrices] +
      sizePrices[size as keyof typeof sizePrices]
    ) * quantity;
    return total;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link to="/products" className="hover:text-[#D73D32]">Products</Link>
        <span>/</span>
        <span className="text-[#1A1A1A]">Business Cards</span>
      </div>

      <Link to="/products">
        <Button variant="ghost" className="mb-6 -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Preview */}
        <div>
          <Card className="bg-white p-8 shadow-md border-0 sticky top-24">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Product Preview</h2>
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-lg shadow-lg mb-4 mx-auto flex items-center justify-center">
                  <div className="text-xs text-gray-400">Preview</div>
                </div>
                <p className="text-sm text-gray-600">Upload your design to preview</p>
              </div>
            </div>
            
            <div className="space-y-3 bg-[#EFEFEF] p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Size:</span>
                <span className="font-medium text-[#1A1A1A]">{size === 'standard' ? '90mm x 50mm' : size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Material:</span>
                <span className="font-medium text-[#1A1A1A] capitalize">{material}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Lamination:</span>
                <span className="font-medium text-[#1A1A1A] capitalize">{lamination}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium text-[#1A1A1A]">{quantity} pieces</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Customization Options */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Business Cards</h1>
            <p className="text-gray-600">Customize your premium business cards</p>
          </div>

          {/* Size Selection */}
          <Card className="bg-white p-6 shadow-sm border-0">
            <Label className="text-lg mb-4 block">Select Size</Label>
            <RadioGroup value={size} onValueChange={setSize}>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#D73D32] cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="standard" id="size-standard" />
                    <div>
                      <label htmlFor="size-standard" className="font-medium cursor-pointer">Standard</label>
                      <p className="text-sm text-gray-600">90mm x 50mm</p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#D73D32]">+₹0</span>
                </div>
                <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#D73D32] cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="large" id="size-large" />
                    <div>
                      <label htmlFor="size-large" className="font-medium cursor-pointer">Large</label>
                      <p className="text-sm text-gray-600">100mm x 60mm</p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#D73D32]">+₹200</span>
                </div>
              </div>
            </RadioGroup>
          </Card>

          {/* Material Selection */}
          <Card className="bg-white p-6 shadow-sm border-0">
            <Label className="text-lg mb-4 block">Select Material</Label>
            <RadioGroup value={material} onValueChange={setMaterial}>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#D73D32] cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="matte" id="material-matte" />
                    <label htmlFor="material-matte" className="font-medium cursor-pointer">Matte Paper</label>
                  </div>
                  <span className="font-semibold text-[#D73D32]">+₹0</span>
                </div>
                <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#D73D32] cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="glossy" id="material-glossy" />
                    <label htmlFor="material-glossy" className="font-medium cursor-pointer">Glossy Paper</label>
                  </div>
                  <span className="font-semibold text-[#D73D32]">+₹50</span>
                </div>
                <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#D73D32] cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="premium" id="material-premium" />
                    <label htmlFor="material-premium" className="font-medium cursor-pointer">Premium Cardstock</label>
                  </div>
                  <span className="font-semibold text-[#D73D32]">+₹150</span>
                </div>
              </div>
            </RadioGroup>
          </Card>

          {/* Lamination Selection */}
          <Card className="bg-white p-6 shadow-sm border-0">
            <Label className="text-lg mb-4 block">Lamination</Label>
            <Select value={lamination} onValueChange={setLamination}>
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Lamination (+₹0)</SelectItem>
                <SelectItem value="standard">Standard Lamination (+₹100)</SelectItem>
                <SelectItem value="premium">Premium UV Lamination (+₹200)</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          {/* Quantity Selection */}
          <Card className="bg-white p-6 shadow-sm border-0">
            <Label className="text-lg mb-4 block">Quantity</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(50, quantity - 50))}
                className="border-gray-200"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold text-[#1A1A1A]">{quantity}</div>
                <div className="text-sm text-gray-600">pieces</div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 50)}
                className="border-gray-200"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* File Upload */}
          <Card className="bg-white p-6 shadow-sm border-0">
            <Label className="text-lg mb-4 block">Upload Your Design</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D73D32] transition-colors cursor-pointer">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.ai,.psd,.jpg,.png"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {uploadedFile ? (
                  <div className="space-y-3">
                    <FileCheck className="w-12 h-12 text-green-500 mx-auto" />
                    <p className="font-medium text-[#1A1A1A]">{uploadedFile}</p>
                    <p className="text-sm text-gray-600">Click to change file</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="font-medium text-[#1A1A1A]">Drag & Drop or Click to Upload</p>
                    <p className="text-sm text-gray-600">Accepted formats: PDF, AI, PSD, JPG, PNG</p>
                  </div>
                )}
              </label>
            </div>
          </Card>

          {/* Price & CTA */}
          <Card className="bg-white p-6 shadow-md border-0 sticky bottom-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Price (incl. GST)</p>
                <p className="text-3xl font-bold text-[#D73D32]">₹{calculatePrice().toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Per unit</p>
                <p className="text-xl font-semibold text-[#1A1A1A]">₹{(calculatePrice() / quantity).toFixed(2)}</p>
              </div>
            </div>
            <Link to="/cart">
              <Button 
                className="w-full bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white py-6 text-lg"
                disabled={!uploadedFile}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </Link>
            {!uploadedFile && (
              <p className="text-sm text-[#D73D32] text-center mt-2">Please upload a design file</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
