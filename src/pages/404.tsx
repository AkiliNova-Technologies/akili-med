// pages/404.tsx
import { Link } from 'react-router-dom';
import { SEO } from '@/components/seo';

export function NotFoundPage() {
  return (
    <>
      <SEO 
        title="Page Not Found - AkiliMed"
        description="The page you're looking for doesn't exist on AkiliMed's healthcare platform."
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The medical resource you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-4">
            <Link 
              to="/dashboard" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
            <div className="text-sm text-gray-500">
              <p>Common medical resources:</p>
              <div className="mt-2 space-x-4">
                <Link to="/dashboard/appointments" className="text-blue-600 hover:underline">
                  Appointments
                </Link>
                <Link to="/dashboard/patients" className="text-blue-600 hover:underline">
                  Patients
                </Link>
                <Link to="/dashboard/reports" className="text-blue-600 hover:underline">
                  Reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}