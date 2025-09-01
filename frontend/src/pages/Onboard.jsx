import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, Lightbulb, Users, HeartHandshake } from 'lucide-react';

const Onboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gray-900 text-gray-100 font-sans"
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <Globe className="w-full h-full text-gray-700" />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-center lg:text-left lg:w-1/2 mb-10 lg:mb-0"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              Your Voice, Your Community, Your Impact
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Connect with your neighbors, discuss local issues, share updates, and drive positive change with CivicPulse.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-300 shadow-lg"
              >
                Join CivicPulse
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 border border-primary-600 text-base font-medium rounded-md text-primary-300 bg-transparent hover:bg-primary-900 transition-colors duration-300 shadow-lg"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="lg:w-1/2 flex justify-center"
          >
            {/* Placeholder for an engaging image or animation */}
            <div className="w-full max-w-md h-64 bg-gray-700 rounded-lg shadow-2xl flex items-center justify-center">
              <Users className="w-24 h-24 text-primary-400 opacity-70" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-white mb-12"
          >
            How CivicPulse Empowers You
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <FeatureCard 
              icon={<Lightbulb className="w-12 h-12 text-primary-400 mb-4" />}
              title="Share Ideas & Issues"
              description="Post your thoughts, concerns, and suggestions to spark meaningful discussions."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Users className="w-12 h-12 text-primary-400 mb-4" />}
              title="Connect with Neighbors"
              description="Engage with a diverse community passionate about local improvement."
              delay={0.3}
            />
            <FeatureCard 
              icon={<HeartHandshake className="w-12 h-12 text-primary-400 mb-4" />}
              title="Drive Collective Action"
              description="Mobilize support and collaborate on initiatives that make a real difference."
              delay={0.5}
            />
            <FeatureCard 
              icon={<Globe className="w-12 h-12 text-primary-400 mb-4" />}
              title="Stay Informed"
              description="Get real-time updates on local announcements and progress reports."
              delay={0.7}
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-extrabold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join CivicPulse today and become an active participant in shaping the future of your community.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-10 py-5 border border-transparent text-lg font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-300 shadow-lg transform hover:scale-105"
          >
            Get Started Now
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.6, delay: delay }}
    className="bg-gray-700 rounded-lg shadow-xl p-8 transform hover:scale-105 transition-transform duration-300"
  >
    {icon}
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

export default Onboard;
