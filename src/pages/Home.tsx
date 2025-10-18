import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserCircle, Building2, Search, Shield, ArrowRight, DollarSign } from 'lucide-react';
import heroImage from '@/assets/hero-hostel.jpg';
// NOTE: I'll use a standard Lucide icon for the Warden role as the image uses a custom icon not in Lucide.

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. Hero Section (NO CHANGES) */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" /> 
        </div>
        
        <div className="container relative z-10 text-center text-white p-4 sm:p-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 drop-shadow-lg animate-in fade-in slide-in-from-top-10 duration-1000">
            HostelHub: Find Your Comfort Zone
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light drop-shadow animate-in fade-in slide-in-from-top-10 duration-1000 delay-150">
            Comfortable, affordable accommodation. Explore thousands of verified beds for students and travelers.
          </p>
          <Link to="/hostels">
            <Button 
              size="lg" 
              className="h-14 px-8 text-xl font-bold bg-blue-500 text-white hover:bg-blue-600 shadow-xl shadow-blue-500/50 transition-all duration-300 animate-in zoom-in duration-700 delay-300"
            >
              <Search className="mr-3 h-6 w-6" />
              Start Browsing Now
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. Role Cards Section - REFINED TO MATCH IMAGE AESTHETIC */}
      <section className="container py-12 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12 text-gray-900">Choose Your Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Card 1: Student/Customer (Blue Theme - Solid Button, Clean Border) */}
          <Card className="p-8 border-2 border-blue-500 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-700 bg-white">
            <div className="text-center space-y-4">
              {/* Icon Container with subtle blue ring */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50/70 text-blue-600 mb-2 border-2 border-blue-200">
                <UserCircle className="h-9 w-9" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">I'm a Student/Traveler</h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Discover comfortable hostels near your campus with great amenities and transparent pricing.
              </p>
              {/* Solid Blue Button (Matching image) */}
              <Link to="/hostels">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-lg shadow-md transition-colors">
                  Find a Hostel <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card 2: Warden/Manager (Purple Theme - Outline Button, Clean Border) */}
          <Card className="p-8 border-2 border-purple-500 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-purple-700 bg-white">
            <div className="text-center space-y-4">
              {/* Icon Container with subtle purple ring */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-50/70 text-purple-600 mb-2 border-2 border-purple-200">
                <Building2 className="h-9 w-9" /> {/* Using Building2 for Warden role */}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">I'm a Hostel Manager</h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Manage your properties, track bookings, and provide excellent service to your guests effortlessly.
              </p>
              {/* Outline Purple Button (Matching image) */}
              <Link to="/login">
                <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 h-11 text-lg transition-colors">
                  Manage Hostel <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. Features Section (NO CHANGES) */}
      <section className="bg-white py-16">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-16 text-gray-900">Why Choose HostelHub?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            
            {/* Feature 1: Easy Search */}
            <div className="text-center p-6 rounded-xl bg-green-50/70 shadow-lg border border-green-200 transition-all hover:bg-green-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-600/10 text-green-600 mb-4 border-2 border-green-300">
                <Search className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Intuitive Search</h3>
              <p className="text-gray-600">
                Find hostels by location, price, and essential amenities with our powerful, fast search engine.
              </p>
            </div>

            {/* Feature 2: Verified Hostels */}
            <div className="text-center p-6 rounded-xl bg-blue-50/70 shadow-lg border border-blue-200 transition-all hover:bg-blue-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600/10 text-blue-600 mb-4 border-2 border-blue-300">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Verified & Secure</h3>
              <p className="text-gray-600">
                All properties are verified, ensuring safety and compliance. Managed by trusted wardens.
              </p>
            </div>

            {/* Feature 3: Quality Assured */}
            <div className="text-center p-6 rounded-xl bg-amber-50/70 shadow-lg border border-amber-200 transition-all hover:bg-amber-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-600/10 text-amber-600 mb-4 border-2 border-amber-300">
                <DollarSign className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Transparent Pricing</h3>
              <p className="text-gray-600">
                Clear, upfront pricing with no hidden fees. Get the best value for comfortable, modern living spaces.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;