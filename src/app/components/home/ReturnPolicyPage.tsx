// ReturnPolicyPage.tsx

import {
    AlertCircle,
    CheckCircle2,
    Mail,
    PackageCheck,
    Phone,
    RefreshCcw,
    ShieldCheck,
    ShoppingBag,
    XCircle,
} from "lucide-react";

const ReturnPolicyPage = () => {
    return (
        <div className="min-h-screen bg-white text-slate-800">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#2d4863] py-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,61,50,0.25),transparent_35%)]" />

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="max-w-4xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                            <ShieldCheck className="h-4 w-4 text-[#D73D32]" />
                            Customer Support & Protection
                        </div>

                        <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                            MAKING IT RIGHT :
                            <span className="block text-[#D73D32]">
                                RETURN & REFUND POLICY
                            </span>
                        </h1>

                        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
                            At Citizen Prints, we understand how important it is for you to receive
                            a product that meets your expectations. Since all our products are
                            customised and personalised just for you, we are unable to accept
                            returns simply because you’ve changed your mind. However, if
                            something isn’t right — whether it’s a defect or an incorrect
                            product — we’re here to make it right.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid gap-8">
                    {/* Return & Replace */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="rounded-2xl bg-[#D73D32]/10 p-3">
                                <RefreshCcw className="h-7 w-7 text-[#D73D32]" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[#2d4863]">
                                    Can I Return or Replace My Order?
                                </h2>
                                <p className="mt-1 text-slate-500">
                                    Support for damaged or incorrect products
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5 text-[15px] leading-8 text-slate-700">
                            <p>
                                Because each order is personalised, we can’t accept returns for
                                reasons unrelated to quality. But if you receive a damaged or
                                incorrect product, we’re happy to help.
                            </p>

                            <p>
                                To raise a complaint, please write to us at{" "}
                                <span className="font-semibold text-[#D73D32]">
                                    citizenprints@gmail.com
                                </span>{" "}
                                or call us at{" "}
                                <span className="font-semibold text-[#D73D32]">
                                    +91  89393 93993
                                </span>{" "}
                                within 7 days of delivery.
                            </p>

                            <p>
                                Please ensure the product is kept intact with all tags, labels,
                                and original packaging so we can process your request smoothly.
                            </p>

                            <p>
                                You will also need to share a picture of the outer packaging and
                                the damaged product. If we’ve delivered the wrong or damaged
                                product, we’ll take care of the return shipping.
                            </p>
                        </div>
                    </div>

                    {/* Damages & Shortages */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="rounded-2xl bg-[#D73D32]/10 p-3">
                                <PackageCheck className="h-7 w-7 text-[#D73D32]" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[#2d4863]">
                                    Can I Claim for Damages or Shortages?
                                </h2>
                                <p className="mt-1 text-slate-500">
                                    Report missing or damaged items quickly
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5 text-[15px] leading-8 text-slate-700">
                            <p>
                                We know how frustrating it can be to receive an incomplete or
                                damaged order.
                            </p>

                            <p>
                                If this happens, please report it to us within 7 days of
                                delivery at{" "}
                                <span className="font-semibold text-[#D73D32]">
                                    citizenprints@gmail.com
                                </span>{" "}
                                or call us at{" "}
                                <span className="font-semibold text-[#D73D32]">
                                    +91  89393 93993
                                </span>
                                .
                            </p>

                            <p>
                                Make sure to inspect your order upon arrival and get in touch
                                with our support team right away so we can assist you promptly.
                            </p>
                        </div>
                    </div>

                    {/* Cancellation */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="rounded-2xl bg-[#D73D32]/10 p-3">
                                <XCircle className="h-7 w-7 text-[#D73D32]" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[#2d4863]">
                                    Can I Cancel My Order?
                                </h2>
                                <p className="mt-1 text-slate-500">
                                    Cancellation eligibility & timelines
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5 text-[15px] leading-8 text-slate-700">
                            <p>
                                We begin processing orders as soon as possible to ensure timely
                                delivery. If you need to cancel your order, please contact us
                                immediately.
                            </p>

                            <div className="space-y-4 rounded-2xl bg-slate-50 p-6">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />

                                    <p>
                                        If production hasn’t started yet, we’ll do our best to
                                        accommodate your request.
                                    </p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <AlertCircle className="mt-1 h-5 w-5 text-[#D73D32]" />

                                    <p>
                                        If production has started or more than 24 hours have passed,
                                        unfortunately we won’t be able to cancel your order.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Refund Process */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="rounded-2xl bg-[#D73D32]/10 p-3">
                                <ShoppingBag className="h-7 w-7 text-[#D73D32]" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[#2d4863]">
                                    What Is the Refund Process?
                                </h2>
                                <p className="mt-1 text-slate-500">
                                    Refund timelines & payment details
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5 text-[15px] leading-8 text-slate-700">
                            <p>
                                If your order is eligible for a refund, we will process it
                                through the original payment method.
                            </p>

                            <p>
                                Our team will keep you updated, and the refund will be completed
                                within{" "}
                                <span className="font-semibold text-[#D73D32]">
                                    5–7 business days
                                </span>{" "}
                                from the date of cancellation.
                            </p>

                            <p>
                                If you need any further clarification on refunds, please email
                                us at{" "}
                                <span className="font-semibold text-[#D73D32]">
                                    citizenprints@gmail.com
                                </span>
                                .
                            </p>

                            <div className="rounded-2xl border border-[#D73D32]/20 bg-[#D73D32]/5 p-5 font-medium text-[#2d4863]">
                                In case Citizen Prints cannot replace the product, a refund will be
                                issued.
                            </div>
                        </div>
                    </div>

                    {/* Category Guidelines */}
                    <div className="rounded-3xl bg-[#2d4863] p-8 text-white shadow-xl">
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold">
                                Guidelines for Specific Categories
                            </h2>

                            <p className="mt-3 text-slate-300">
                                Important information related to apparel and electronic products.
                            </p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* Apparel */}
                            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                                <h3 className="mb-5 text-2xl font-semibold text-white">
                                    Apparel
                                </h3>

                                <div className="space-y-4 text-slate-200">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-1 h-5 w-5 text-[#D73D32]" />

                                        <p>
                                            We want you to love your customised apparel, so please
                                            check the size chart carefully before placing your order.
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="mt-1 h-5 w-5 text-[#D73D32]" />

                                        <p>
                                            Since each piece is customised for you, we’re unable to
                                            offer size exchanges.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Electronics */}
                            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                                <h3 className="mb-5 text-2xl font-semibold text-white   ">
                                    Electronics
                                </h3>

                                <div className="space-y-4 text-slate-200">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-1 h-5 w-5 text-[#D73D32]" />

                                        <p>
                                            For technical queries or product functionality concerns,
                                            please contact the respective brand directly using the
                                            details provided on the product packaging.
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="mt-1 h-5 w-5 text-[#D73D32]" />

                                        <p>
                                            If your electronic product develops an issue after 7 days
                                            of delivery, warranty or guarantee claims must be handled
                                            through the respective brand.
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-1 h-5 w-5 text-[#D73D32]" />

                                        <p>
                                            If you need help finding the brand’s contact details, our
                                            customer support team is happy to assist you.
                                        </p>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="rounded-3xl border border-[#D73D32]/10 bg-gradient-to-r from-[#D73D32]/5 to-[#2d4863]/5 p-8 shadow-sm">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-[#2d4863]">
                                    Need Help?
                                </h2>

                                <p className="mt-3 max-w-2xl text-slate-600">
                                    We appreciate your trust in Citizen Prints and are always here to
                                    help if you have any concerns or questions regarding your
                                    order.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
                                    <Mail className="h-5 w-5 text-[#D73D32]" />

                                    <span className="font-medium text-slate-700">
                                        citizenprints@gmail.com
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
                                    <Phone className="h-5 w-5 text-[#D73D32]" />

                                    <span className="font-medium text-slate-700">
                                        +91  89393 93993
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ReturnPolicyPage;