import { useState } from 'react';
import { SERVICES } from './constants/services';
import { ServiceCard } from './components/landing/ServiceCard';
import { ChatWindow } from './components/chat';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-100 selection:text-brand-900 flex flex-col">

      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="w-full mx-auto px-[24px] h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/Dassault_Logo.svg" alt="Dassault Systèmes" className="h-6 w-auto" />
          </div>
        </div>
      </nav>

      {/* Service Cards */}
      <section className="py-24 flex-grow">
        <div className="w-full mx-auto px-[24px]">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">Explore Our Solutions</h2>
              <p className="text-slate-600 max-w-2xl">Select a workflow to see how our Virtual Twins drive efficiency in your industry sector.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={index}
                onGetQuote={() => setIsChatOpen(true)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Chat Window */}
      <ChatWindow open={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
}
