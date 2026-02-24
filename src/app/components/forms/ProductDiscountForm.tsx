import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { ProductDiscount, ProductDiscountFormData } from "../../types/productDiscount";
import { getAllProducts } from "../../service/productApiService";
import { productDiscountValidation } from "../../validation/productDiscountValidation";

interface Props {
    defaultValues?: ProductDiscount | null;
    onSubmit: (data: ProductDiscountFormData) => Promise<void>;
    onCancel: () => void;
}

export function ProductDiscountForm({ defaultValues, onSubmit, onCancel }: Props) {
    const [products, setProducts] = useState<any[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await getAllProducts();
            setProducts(data);
            setLoadingOptions(false);
        };
        loadProducts();
    }, []);

    // inside useForm
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductDiscountFormData>({
        values: defaultValues
            ? {
                product_id: defaultValues.product_id,
                description: defaultValues.description ?? "",
                discount: defaultValues.discount,
                start_date: defaultValues.start_date
                    ? new Date(defaultValues.start_date).toISOString().split("T")[0]
                    : "",
                end_date: defaultValues.end_date
                    ? new Date(defaultValues.end_date).toISOString().split("T")[0]
                    : "",
                is_active: defaultValues.is_active,
            }
            : { product_id: "", description: "", discount: "0%", start_date: "", end_date: "", is_active: true },
    });

    if (loadingOptions) return <p className="text-center py-4">Loading...</p>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Product */}
            <div>
                <Label>Product</Label>
                <select {...register("product_id")} className="w-full border rounded px-3 py-2">
                    <option value="">Select Product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>

            {/* Description */}
            <div>
                <Label>Description</Label>
                <input type="text" {...register("description")} className="w-full border rounded px-3 py-2" />
            </div>

            {/* Discount */}
            <div>
                <Label>Discount *</Label>
                <input type="text" {...register("discount", productDiscountValidation.discount)} className="w-full border rounded px-3 py-2" />
                {errors.discount && <p className="text-red-500 text-sm">{errors.discount.message}</p>}
            </div>

            {/* Start Date */}
            <div>
                <Label>Start Date *</Label>
                <input type="date" {...register("start_date", productDiscountValidation.start_date)} className="w-full border rounded px-3 py-2" />
                {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date.message}</p>}
            </div>

            {/* End Date */}
            <div>
                <Label>End Date *</Label>
                <input type="date" {...register("end_date", productDiscountValidation.end_date)} className="w-full border rounded px-3 py-2" />
                {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date.message}</p>}
            </div>

            {/* Active */}
            <div className="flex items-center gap-2">
                <input type="checkbox" {...register("is_active")} />
                <Label>Active</Label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#D73D32] text-white">
                    {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    );
}