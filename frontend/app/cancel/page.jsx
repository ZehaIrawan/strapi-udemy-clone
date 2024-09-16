import Navbar from '@/components/Navbar';

const CancelPage = () => (
  <div className="min-h-screen bg-gray-100 p-4 text-center px-24">
    <Navbar />
    <h1 className="text-3xl font-semibold mb-6 mt-12">Payment Cancelled</h1>
    <p>Your payment was cancelled. Please try again.</p>
  </div>
);

export default CancelPage;