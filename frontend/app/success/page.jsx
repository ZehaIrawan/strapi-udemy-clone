import Navbar from '@/components/Navbar';


const SuccessPage = () => (
  <div className="min-h-screen bg-gray-100 p-4 text-center px-24">
    <Navbar/>
    <h1 className="text-3xl font-semibold mb-6 mt-12">Payment Successful!</h1>
    <p>Thank you for your purchase.</p>
  </div>
);

export default SuccessPage;