import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-gray-100"
    >
      <h1 className="text-4xl font-extrabold text-white mb-6 text-center">About Us</h1>
      
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-primary-400 mb-4">Our Mission</h2>
        <p className="text-lg leading-relaxed text-gray-300">
          At CivicPulse, we believe in fostering vibrant and engaged communities. Our mission is to empower citizens to connect, discuss, and collectively address local issues, share announcements, and celebrate progress. We provide a platform that amplifies voices, encourages participation, and drives positive change in our neighborhoods and cities.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-primary-400 mb-4">What We Do</h2>
        <ul className="list-disc list-inside space-y-3 text-lg leading-relaxed text-gray-300">
          <li>
            <strong>Facilitate Dialogue:</strong> Create a safe and inclusive space for meaningful conversations about local issues.
          </li>
          <li>
            <strong>Share Information:</strong> Enable quick and easy sharing of important announcements and updates within the community.
          </li>
          <li>
            <strong>Track Progress:</strong> Highlight ongoing projects and achievements, fostering a sense of collective accomplishment.
          </li>
          <li>
            <strong>Empower Action:</strong> Connect community members with resources and opportunities to take action on issues they care about.
          </li>
        </ul>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-gray-800 rounded-lg shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-primary-400 mb-4">Our Vision</h2>
        <p className="text-lg leading-relaxed text-gray-300">
          We envision communities where every voice matters, where engagement is effortless, and where collective action leads to a better quality of life for all. CivicPulse is more than just a platform; it's a movement towards more connected, informed, and proactive local governance and community spirit.
        </p>
      </motion.section>
    </motion.div>
  );
};

export default AboutUs;
