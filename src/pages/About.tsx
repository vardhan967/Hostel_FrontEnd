import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const About = () => {
  const [tab, setTab] = useState<'about' | 'privacy'>('about');

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl"> {/* Centered container with max-width for better aesthetics */}
      <Card className="shadow-xl border-t-4 border-blue-600 transition-shadow duration-300"> {/* Added shadow and an accent border-top */}
          <CardHeader className="pb-4 border-b"> {/* Separator line for the header */}
          <CardTitle className="text-3xl font-extrabold text-gray-900 tracking-tight">FindMyHostel Overview</CardTitle> {/* Prominent title */}
        </CardHeader>
        <CardContent className="pt-8"> {/* Increased top padding */}
          
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 border-b pb-2"> {/* Visual tab bar structure */}
            <Button
              variant={tab === 'about' ? 'default' : 'ghost'}
              className={tab === 'about' ? 'font-semibold' : 'text-gray-600'}
              onClick={() => setTab('about')}
            >
              About HostelHub
            </Button>
            <Button
              variant={tab === 'privacy' ? 'default' : 'ghost'}
              className={tab === 'privacy' ? 'font-semibold' : 'text-gray-600'}
              onClick={() => setTab('privacy')}
            >
              Privacy Policy
            </Button>
          </div>

          {/* Tab Content */}
          {tab === 'about' ? (
            <div className="space-y-8"> {/* Improved vertical spacing */}
              <section>
                  <h3 className="text-2xl font-bold mb-3 text-blue-700">What is FindMyHostel?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    FindMyHostel helps students and travellers discover and manage hostel rooms, beds, and bookings. Wardens can manage hostels, rooms, and pricing while
                    users can browse, book, and leave reviews.
                  </p>
                </section>
              <section className="pt-4 border-t"> {/* Separator for contact section */}
                <h4 className="text-xl font-semibold mb-2 text-gray-800">Contact & Support</h4>
                <p className="text-gray-700">If you need help, reach out at <a href="mailto:support@hostelhub.local" className="text-blue-600 hover:text-blue-700 underline font-medium">support@hostelhub.local</a></p>
              </section>
            </div>
          ) : (
            <div className="space-y-8"> {/* Improved vertical spacing */}
              <section>
                <h3 className="text-2xl font-bold mb-3 text-blue-700">Privacy Policy</h3>
                <p className="text-gray-700 leading-relaxed">
                This is a short privacy policy for the demo app. We store minimal information necessary to provide the service: user profile data,
                bookings, and reviews. Passwords and authentication tokens are never shared. For production, replace this with your real legal policy.
                </p>
              </section>
              <section className="pt-4 border-t">
                <h4 className="text-xl font-semibold mb-3 text-gray-800">Data we collect</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4"> {/* Enhanced list styling */}
                  <li className="font-medium">User profile (name, email, phone)</li>
                  <li>Bookings and related dates</li>
                  <li>Reviews and ratings</li>
                </ul>
              </section>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default About;