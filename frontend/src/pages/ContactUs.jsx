import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactUs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-gray-100"
    >
      <h1 className="text-4xl font-extrabold text-white mb-6 text-center">Contact Us</h1>
      
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-primary-400 mb-4">Get in Touch</h2>
        <p className="text-lg leading-relaxed text-gray-300 mb-6">
          We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out using the methods below.
        </p>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Mail className="w-6 h-6 text-primary-400" />
            <a href="mailto:support@civicpulse.com" className="text-lg text-gray-300 hover:text-primary-300 transition-colors">
              support@civicpulse.com
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="w-6 h-6 text-primary-400" />
            <a href="tel:+1234567890" className="text-lg text-gray-300 hover:text-primary-300 transition-colors">
              +1 (234) 567-890
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <MapPin className="w-6 h-6 text-primary-400" />
            <p className="text-lg text-gray-300">
              123 Community Lane, Cityville, CA 90210
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-gray-800 rounded-lg shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-primary-400 mb-4">Send Us a Message</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
            <input
              type="text"
              id="name"
              className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Your Email</label>
            <input
              type="email"
              id="email"
              className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="john.doe@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
            <textarea
              id="message"
              rows="5"
              className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Your message..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Send Message
          </button>
        </form>
      </motion.section>
    </motion.div>
  );
};

export default ContactUs;
