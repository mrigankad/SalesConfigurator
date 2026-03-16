import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { ServiceItem } from '../../types';

interface Props {
  service: ServiceItem;
  index: number;
  onGetQuote: () => void;
}

export function ServiceCard({ service, index, onGetQuote }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group service-card"
    >
      <div
        className="service-card-bg"
        style={{ backgroundImage: `url(${service.image})` }}
      />
      <div className="service-card-overlay" />
      <div className="service-card-content">
        <h2 className="service-card-title">{service.title}</h2>
        <p className="service-card-description">{service.description}</p>
        <div className="flex flex-wrap gap-3 pt-4">
          <button className="btn-outline-white group/btn cursor-pointer">
            <span>Get started now</span>
            <ChevronRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
          </button>
          <button
            onClick={onGetQuote}
            className="inline-flex items-center justify-center gap-2 font-semibold rounded-full bg-white px-6 py-2.5 text-sm text-slate-900 transition-all hover:bg-brand-500 hover:text-white shadow-xl hover:shadow-brand-500/20 cursor-pointer"
          >
            Get a quote
          </button>
        </div>
      </div>
    </motion.div>
  );
}
