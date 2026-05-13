// pages/ContactUsPage.tsx

import { useState } from "react";
import axios from "axios";

import {
    ArrowRight,
    Clock3,
    Headphones,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Send,
    Shield,
    Truck,
    Globe,
    CheckCircle2,
} from "lucide-react";

import contactBanner from "../../../media/contact_support.png";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";

export default function ContactUsPage() {
    const apibaseurl = import.meta.env.VITE_API_BASE_URL 
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        phone_number: "",
        email_address: "",
        subject: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await axios.post(
                `${apibaseurl}/contact_requests/create`,
                formData
            );

            if (response.data?.status === "success") {

                toast.success("Your message has been sent successfully!");

                setFormData({
                    full_name: "",
                    phone_number: "",
                    email_address: "",
                    subject: "",
                    message: "",
                });
            }

        } catch (error: any) {

            console.error(error);
            toast.error("Failed to submit contact request");

            alert(
                error?.response?.data?.detail ||
                "Failed to submit contact request"
            );

        } finally {
            setLoading(false);
        }
    };

    const contactCards = [
        {
            title: "Call Us",
            value: "+91 89393 93993",
            description: "Mon - Sat, 9AM to 8PM",
            icon: Phone,
        },
        {
            title: "Email Support",
            value: "citizenprints@gmail.com",
            description: "Quick response within 24 hours",
            icon: Mail,
        },
        {
            title: "Office Address",
            value: "Chennai, Tamil Nadu, India",
            description: "Visit our printing studio",
            icon: MapPin,
        },
    ];

    const features = [
        {
            title: "Fast Response",
            description: "Our support team responds quickly to every inquiry.",
            icon: Clock3,
        },
        {
            title: "Expert Guidance",
            description: "Get professional assistance for your print requirements.",
            icon: Headphones,
        },
        {
            title: "Trusted Service",
            description: "Reliable printing solutions trusted by thousands.",
            icon: Shield,
        },
        {
            title: "Nationwide Delivery",
            description: "Fast and secure delivery across India.",
            icon: Truck,
        },
    ];

    const faqs = [
        "Business Cards & Visiting Cards",
        "Banner & Flex Printing",
        "Custom Packaging Solutions",
        "Flyers, Posters & Brochures",
        "Bulk Printing Orders",
        "Corporate Branding Materials",
    ];

    return (
        <div className="bg-white text-gray-900">

            {/* Hero Section */}
            <section className="relative h-full md:h-[500px] overflow-hidden">
                <img
                    src={contactBanner}
                    alt="Citizen Prints Services"
                    className="w-full object-cover"
                />
            </section>

            {/* Contact Cards */}
            <section className="relative -mt-12 z-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-5">
                    {contactCards.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
                                <item.icon className="w-6 h-6 text-[#D73D32]" />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {item.title}
                            </h3>

                            <p className="text-[#2d4863] font-semibold text-sm mb-1 break-all">
                                {item.value}
                            </p>

                            <p className="text-gray-500 text-sm leading-6">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Main Section */}
            <section className="py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">

                    {/* Left Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-[#D73D32] text-xs uppercase tracking-wider font-semibold mb-5">
                            Get In Touch
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-5">
                            We’re Here to Help
                            <span className="block text-[#D73D32]">
                                Your Brand Grow
                            </span>
                        </h2>

                        <p className="text-gray-600 text-sm leading-8 mb-8">
                            Whether you need premium business cards, marketing materials,
                            custom packaging, or bulk printing services, our experienced team
                            is ready to support your business with high-quality solutions.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 mb-10">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 border border-gray-100 rounded-xl p-5 hover:border-red-200 hover:bg-white transition-all duration-300"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 flex items-center justify-center mb-4">
                                        <feature.icon className="w-5 h-5 text-[#D73D32]" />
                                    </div>

                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 leading-6">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 lg:p-10 shadow-sm">

                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-[#D73D32] text-xs uppercase tracking-wide font-semibold mb-4">
                                Send Message
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Request a Quote
                            </h3>

                            <p className="text-sm text-gray-500 leading-7">
                                Fill out the form below and our team will contact you shortly.
                            </p>
                        </div>

                        <form
                            className="space-y-5"
                            onSubmit={handleSubmit}
                        >

                            <div className="grid sm:grid-cols-2 gap-5">

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        required
                                        className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#D73D32]"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Phone Number
                                    </label>

                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        placeholder="+91 98765 43210"
                                        required
                                        className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#D73D32]"
                                    />
                                </div>

                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email_address"
                                    value={formData.email_address}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#D73D32]"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Printing requirement"
                                    required
                                    className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#D73D32]"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Message
                                </label>

                                <textarea
                                    rows={6}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us about your project..."
                                    required
                                    className="w-full rounded-2xl border border-gray-200 px-4 py-4 text-sm outline-none resize-none focus:border-[#D73D32]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-xl bg-[#D73D32] hover:bg-red-700 transition-all duration-300 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-70"
                            >
                                {loading ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                        </form>
                    </div>
                </div>
            </section>
            <Toaster />
        </div>
    );
}