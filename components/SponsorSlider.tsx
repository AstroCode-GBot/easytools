
import React from 'react';
import { Sponsor } from '../types';

interface SponsorSliderProps {
  sponsors: Sponsor[];
}

const SponsorSlider: React.FC<SponsorSliderProps> = ({ sponsors }) => {
  return (
    <div className="w-full overflow-hidden bg-white/50 dark:bg-slate-900/50 py-10 border-y border-slate-100 dark:border-slate-800 relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F1F5F9] dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F1F5F9] dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex animate-scroll whitespace-nowrap">
        {/* We double the array to create a seamless infinite loop */}
        {[...sponsors, ...sponsors, ...sponsors].map((sponsor, idx) => (
          <a 
            key={`${sponsor.id}-${idx}`}
            href={sponsor.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center mx-12 grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100 transform hover:scale-110"
          >
            <img 
              src={sponsor.imageUrl} 
              alt={sponsor.name} 
              className="h-10 md:h-12 w-auto object-contain"
            />
          </a>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default SponsorSlider;
