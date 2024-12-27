// components/ui/TouchCard.js
import { motion } from 'framer-motion';

export default function TouchCard({ children, onPress, className }) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onPress}
      className={`bg-white rounded-lg shadow-sm p-4 ${className}`}
    >
      {children}
    </motion.div>
  );
}