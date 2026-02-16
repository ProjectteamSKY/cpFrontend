import { Link } from "react-router";
import { ArrowRight, Upload, Printer, Truck, CheckCircle, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import headerImg from "../../../media/header2.png";

export function HomePage() {
  const categories = [
    { id: 1, name: "Business Cards", image: "business cards printing", price: "₹299", popular: true },
    { id: 2, name: "Brochures", image: "corporate brochure", price: "₹499" },
    { id: 3, name: "Banners", image: "advertising banner", price: "₹799" },
    { id: 4, name: "Flyers", image: "marketing flyer", price: "₹199" },
    { id: 5, name: "Posters", image: "promotional poster", price: "₹349" },
    { id: 6, name: "Custom Prints", image: "custom printing", price: "₹999" },
  ];

  const steps = [
    {
      icon: Printer,
      title: "Choose Product",
      description: "Select from our wide range of printing products",
    },
    {
      icon: Upload,
      title: "Upload Design",
      description: "Upload your print-ready files securely",
    },
    {
      icon: Truck,
      title: "Get Delivered",
      description: "Fast delivery to your doorstep",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative flex items-center bg-white py-20">
        <div className="max-w-[1440px] mx-auto px-8 w-full">
          <div className="grid grid-cols-12 gap-8 items-center">

            {/* LEFT SIDE — TEXT (6 columns) */}
            <div className="col-span-12 md:col-span-6">
              <h1 className="text-5xl font-bold mb-6 text-black leading-tight">
                Professional Printing Made Easy
              </h1>

              <p className="text-xl mb-8 text-gray-600">
                High-quality printing services for businesses and individuals.
                Fast turnaround, competitive pricing, and exceptional quality.
              </p>

              <div className="flex gap-4">
                <Link to="/products">
                  <Button
                    size="lg"
                    className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white px-8 py-6 text-lg"
                  >
                    Start Your Order
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-[#D73D32] border-gray-300 hover:bg-gray-50 px-8 py-6 text-lg"
                >
                  View Products
                </Button>
              </div>
            </div>

            {/* RIGHT SIDE — IMAGE (6 columns) */}
            <div className="col-span-12 md:col-span-6">
              <img
                src={headerImg}
                alt="Printing Services"
                className="w-full h-[400px] object-cover rounded-xl shadow-lg"
              />
            </div>

          </div>
        </div>
      </section>




      {/* Featured Products */}
      <section className="max-w-[1440px] mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">Our Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our most popular printing products with customizable options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-0 relative"
            >
              {category.popular && (
                <div className="absolute top-4 right-4 bg-[#1A1A1A] text-white text-xs px-3 py-1 rounded-full z-10">
                  Popular
                </div>
              )}
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <Printer className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">Starting from</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#D73D32]">{category.price}</span>
                  <Link to={`/product/${category.id}`}>
                    <Button
                      className="bg-[#D73D32] hover:bg-[#D73D32]/90 text-white"
                    >
                      Customize
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-[1440px] mx-auto px-8 py-16 bg-white rounded-2xl shadow-sm">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">Simple, fast, and reliable printing process</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gray-200">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                )}
                <div className="inline-flex items-center justify-center w-24 h-24 bg-[#D73D32]/10 rounded-full mb-6 relative z-10">
                  <Icon className="w-12 h-12 text-[#D73D32]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <Card className="bg-white p-6 text-center border-0 shadow-sm">
            <CheckCircle className="w-12 h-12 text-[#1A1A1A] mx-auto mb-3" />
            <div className="text-2xl font-bold text-[#1A1A1A]">10,000+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </Card>
          <Card className="bg-white p-6 text-center border-0 shadow-sm">
            <Star className="w-12 h-12 text-[#1A1A1A] mx-auto mb-3" />
            <div className="text-2xl font-bold text-[#1A1A1A]">4.9/5</div>
            <div className="text-sm text-gray-600">Customer Rating</div>
          </Card>
          <Card className="bg-white p-6 text-center border-0 shadow-sm">
            <Truck className="w-12 h-12 text-[#1A1A1A] mx-auto mb-3" />
            <div className="text-2xl font-bold text-[#1A1A1A]">24-48hrs</div>
            <div className="text-sm text-gray-600">Delivery Time</div>
          </Card>
          <Card className="bg-white p-6 text-center border-0 shadow-sm">
            <Printer className="w-12 h-12 text-[#1A1A1A] mx-auto mb-3" />
            <div className="text-2xl font-bold text-[#1A1A1A]">50,000+</div>
            <div className="text-sm text-gray-600">Orders Completed</div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-[1440px] mx-auto px-8">
        <Card className="bg-gradient-to-r from-[#D73D32] to-[#D73D32]/90 text-white p-12 text-center border-0 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of satisfied customers and experience premium printing quality
          </p>
          <Link to="/products">
            <Button
              size="lg"
              className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white px-8 py-6 text-lg"
            >
              Start Your Order Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
