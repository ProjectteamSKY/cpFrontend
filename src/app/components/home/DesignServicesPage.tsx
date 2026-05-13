import {
    ArrowRight,
    Award,
    Brush,
    CheckCircle,
    Clock3,
    Globe,
    Headphones,
    Layers3,
    Medal,
    Package,
    Palette,
    PenTool,
    Printer,
    Shield,
    Sparkles,
    Star,
    Truck,
    Users,
    BadgeCheck,
    ScanText,
    BookOpen,
    ShoppingBag,
} from "lucide-react";

import serviceBanner from "../../../media/designservice.png";

export default function DesignServicesPage() {
    const services = [
        {
            title: "Business Cards",
            desc: "Premium visiting cards with matte, glossy, textured, and luxury finishes.",
            icon: BadgeCheck,
        },
        {
            title: "Brochures Printing",
            desc: "Professional brochures designed to showcase your business beautifully.",
            icon: BookOpen,
        },
        {
            title: "Flyers & Posters",
            desc: "Creative marketing materials with vibrant colors and sharp quality.",
            icon: Palette,
        },
        {
            title: "Banner Printing",
            desc: "High-quality flex banners for events, shops, exhibitions, and promotions.",
            icon: Layers3,
        },
        {
            title: "Packaging Design",
            desc: "Custom packaging solutions that elevate your product branding.",
            icon: ShoppingBag,
        },
        {
            title: "ID Card Printing",
            desc: "Corporate and educational ID cards with durable premium finishing.",
            icon: Shield,
        },
        {
            title: "Custom Stickers",
            desc: "Waterproof and premium stickers for packaging and promotions.",
            icon: Sparkles,
        },
        {
            title: "Digital Printing",
            desc: "Fast and affordable digital printing for all business needs.",
            icon: Printer,
        },
    ];

    const features = [
        {
            title: "Premium Print Quality",
            desc: "Advanced printing technology delivering vibrant and accurate colors.",
            icon: Award,
        },
        {
            title: "Fast Delivery",
            desc: "Quick turnaround with safe packaging and reliable shipping.",
            icon: Truck,
        },
        {
            title: "Creative Designs",
            desc: "Unique and eye-catching designs tailored for your brand.",
            icon: PenTool,
        },
        {
            title: "24/7 Support",
            desc: "Friendly support team available anytime for assistance.",
            icon: Headphones,
        },
    ];

    const process = [
        {
            title: "Choose Service",
            desc: "Select the printing service that fits your requirement.",
            icon: Package,
        },
        {
            title: "Upload Design",
            desc: "Upload your artwork or let our team create one for you.",
            icon: Brush,
        },
        {
            title: "Printing Process",
            desc: "We print using modern machines with premium materials.",
            icon: Printer,
        },
        {
            title: "Delivery",
            desc: "Fast delivery to your doorstep anywhere in India.",
            icon: Globe,
        },
    ];

    return (
        <div className="bg-white text-gray-900 overflow-hidden">
            {/* HERO SECTION */}
            <section className="relative h-full md:h-[500px] overflow-hidden">
                <img
                    src={serviceBanner}
                    alt="Citizen Prints Services"
                    className="w-full object-cover"
                />

                {/* <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs uppercase tracking-wider font-semibold mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Professional Printing Services
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
              Premium Printing
              <span className="block text-red-500">
                Solutions For Brands
              </span>
            </h1>

            <p className="text-gray-300 text-base lg:text-lg leading-8 mb-8 max-w-xl">
              From business cards to custom packaging, Citizen Prints
              delivers high-quality printing solutions designed to elevate
              your business identity.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="group px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-red-500/30">
                Explore Services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="px-6 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white font-semibold text-sm hover:bg-white/20 transition-all duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </div> */}
            </section>

            {/* STATS */}
            <section className="relative -mt-6 z-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { number: "10+", label: "Years Experience", icon: Clock3 },
                        { number: "50K+", label: "Orders Delivered", icon: Package },
                        { number: "15K+", label: "Happy Clients", icon: Users },
                        { number: "99%", label: "Customer Satisfaction", icon: Medal },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                                <item.icon className="w-6 h-6 text-red-600" />
                            </div>

                            <h3 className="text-3xl font-bold text-gray-900 mb-1">
                                {item.number}
                            </h3>

                            <p className="text-sm text-gray-500 font-medium">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SERVICES */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs uppercase tracking-wider font-semibold mb-5">
                            Our Services
                        </div>

                        <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                            Complete Printing
                            <span className="block text-red-600">
                                Services Under One Roof
                            </span>
                        </h2>

                        <p className="text-gray-500 leading-8 text-base">
                            We provide premium business printing solutions with modern
                            technology, creative design, and unmatched quality.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="group relative bg-white border border-gray-100 rounded-3xl p-7 hover:bg-red-600 hover:border-red-600 transition-all duration-300 overflow-hidden hover:-translate-y-2 hover:shadow-2xl"
                            >
                                <div className="absolute top-0 right-0 w-28 h-28 bg-red-50 rounded-full blur-3xl opacity-50 group-hover:bg-white/10" />

                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-red-50 group-hover:bg-white/10 flex items-center justify-center mb-5 transition-all duration-300">
                                        <service.icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors duration-300" />
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-white mb-3 transition-colors duration-300">
                                        {service.title}
                                    </h3>

                                    <p className="text-sm leading-7 text-gray-500 group-hover:text-white/80 transition-colors duration-300">
                                        {service.desc}
                                    </p>

                                    <button className="mt-6 flex items-center gap-2 text-red-600 group-hover:text-white text-sm font-semibold transition-all duration-300">
                                        Learn More
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-14 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs uppercase tracking-wider font-semibold mb-5">
                                Why Choose Us
                            </div>

                            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                                We Deliver More Than
                                <span className="block text-red-600">
                                    Just Printing
                                </span>
                            </h2>

                            <p className="text-gray-500 leading-8 mb-8">
                                Citizen Prints combines creativity, premium materials,
                                and advanced printing technology to provide world-class
                                branding solutions.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "High-quality premium printing",
                                    "Affordable pricing for businesses",
                                    "Creative customization options",
                                    "Fast turnaround & delivery",
                                    "Trusted by thousands of customers",
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-5 py-4"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-red-600" />
                                        </div>

                                        <p className="text-sm text-gray-700 font-medium">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-5">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-3xl border border-gray-100 p-7 hover:border-red-200 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
                                        <feature.icon className="w-6 h-6 text-red-600" />
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 leading-7">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* PROCESS */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs uppercase tracking-wider font-semibold mb-5">
                            Work Process
                        </div>

                        <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-5">
                            Simple & Easy
                            <span className="block text-red-600">
                                Printing Process
                            </span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {process.map((step, index) => (
                            <div
                                key={index}
                                className="relative bg-gray-50 border border-gray-100 rounded-3xl p-8 text-center hover:bg-white hover:shadow-xl transition-all duration-300"
                            >
                                <div className="absolute top-5 right-5 text-5xl font-bold text-gray-100">
                                    0{index + 1}
                                </div>

                                <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto mb-6">
                                    <step.icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    {step.title}
                                </h3>

                                <p className="text-sm text-gray-500 leading-7">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-[#2d4863] relative overflow-hidden">

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-red-400 text-xs uppercase tracking-wider font-semibold mb-6 backdrop-blur-md">
                        Start Your Project
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                        Ready To Grow Your Brand
                        <span className="block text-red-500">
                            With Premium Printing?
                        </span>
                    </h2>

                    <p className="text-gray-300 text-base leading-8 max-w-2xl mx-auto mb-10">
                        Let Citizen Prints help you create impactful branding materials
                        with premium quality, modern designs, and fast delivery.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="group px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-red-500/30">
                            Start Your Order
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button className="px-7 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white font-semibold hover:bg-white/20 transition-all duration-300">
                            Talk To Support
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}