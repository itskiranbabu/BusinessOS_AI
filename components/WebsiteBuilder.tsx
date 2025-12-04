import React, { useState } from 'react';
import { BusinessBlueprint, WebsiteData } from '../types';
import { Monitor, Smartphone, ExternalLink, Check, Edit2, Save } from 'lucide-react';

interface WebsiteBuilderProps {
  blueprint: BusinessBlueprint;
  onUpdate: (data: Partial<WebsiteData>) => void;
}

const WebsiteBuilder: React.FC<WebsiteBuilderProps> = ({ blueprint, onUpdate }) => {
  const { websiteData } = blueprint;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<WebsiteData>(websiteData);

  // Sync if prop updates externally
  React.useEffect(() => {
    if (!isEditing) {
      setEditData(websiteData);
    }
  }, [websiteData, isEditing]);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(websiteData);
    setIsEditing(false);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Website Builder</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Your high-converting funnel is ready to launch.</p>
        </div>
        <div className="flex gap-2">
           {isEditing ? (
             <>
                <button onClick={handleCancel} className="px-4 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 flex items-center gap-2 shadow-lg shadow-green-600/30 transition-all">
                  <Save size={18} /> Save Changes
                </button>
             </>
           ) : (
             <button onClick={() => setIsEditing(true)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-all">
                <Edit2 size={18} /> Edit Content
             </button>
           )}
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2 self-center"></div>
          <button className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 flex items-center gap-2 shadow-lg shadow-primary-600/30 transition-all hover:translate-y-[-1px]">
             <ExternalLink size={18} /> Publish
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden relative shadow-inner p-4 md:p-8">
        {/* Mock Browser Window */}
        <div className="bg-white w-full h-full rounded-xl shadow-2xl overflow-y-auto mx-auto max-w-5xl">
          {/* Header */}
          <header className="px-8 py-5 border-b flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
            <div className="font-bold text-xl text-slate-900">{blueprint.businessName}</div>
            <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-primary-600 transition-colors">Program</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Stories</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Pricing</a>
            </nav>
            <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">
              Client Login
            </button>
          </header>

          {/* Hero */}
          <section className="py-24 px-8 text-center max-w-5xl mx-auto">
            {isEditing ? (
                <div className="space-y-4">
                    <input 
                      type="text" 
                      value={editData.heroHeadline}
                      onChange={(e) => setEditData({...editData, heroHeadline: e.target.value})}
                      className="w-full text-5xl md:text-7xl font-extrabold text-slate-900 text-center border-b-2 border-primary-300 focus:border-primary-600 outline-none bg-transparent"
                    />
                    <textarea 
                      value={editData.heroSubhead}
                      onChange={(e) => setEditData({...editData, heroSubhead: e.target.value})}
                      className="w-full text-xl md:text-2xl text-slate-600 text-center border-b-2 border-primary-300 focus:border-primary-600 outline-none bg-transparent resize-none"
                      rows={3}
                    />
                </div>
            ) : (
                <>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
                    {editData.heroHeadline}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                    {editData.heroSubhead}
                    </p>
                </>
            )}
            
            <button className="bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl shadow-primary-600/40 hover:bg-primary-700 transition-transform hover:-translate-y-1">
              {editData.ctaText}
            </button>
            <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500">
              {editData.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 rounded-full border border-slate-100">
                  <Check size={18} className="text-green-500" /> {feat}
                </div>
              ))}
            </div>
          </section>

          {/* Social Proof */}
          <section className="py-20 bg-slate-50 border-y border-slate-200">
            <div className="max-w-6xl mx-auto px-8">
              <h2 className="text-center text-3xl font-bold text-slate-900 mb-16">Success Stories</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {editData.testimonials.map((test, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
                    <div className="absolute top-8 right-8 text-slate-200 text-6xl font-serif">"</div>
                    <div className="flex text-yellow-400 mb-4 text-lg">★★★★★</div>
                    <p className="text-slate-600 italic mb-6 relative z-10 leading-relaxed text-lg">"{test.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                      <div>
                        <div className="font-bold text-slate-900 text-base">{test.name}</div>
                        <div className="text-sm text-primary-600 font-bold">{test.result}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="py-24 px-8">
             <div className="max-w-5xl mx-auto">
               <h2 className="text-center text-4xl font-bold text-slate-900 mb-16">Simple Pricing</h2>
               <div className="grid md:grid-cols-2 gap-8 items-center">
                 {editData.pricing.map((plan, i) => (
                   <div key={i} className={`p-10 rounded-3xl border ${i === 1 ? 'border-primary-600 bg-primary-50 ring-4 ring-primary-100 relative' : 'border-slate-200 bg-white'}`}>
                     {i === 1 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</div>}
                     <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                     <div className="text-5xl font-extrabold text-slate-900 my-6 tracking-tight">{plan.price}</div>
                     <ul className="space-y-4 mb-10">
                       {plan.features.map((f, j) => (
                         <li key={j} className="flex items-start gap-3 text-base text-slate-600">
                           <Check size={20} className="text-primary-600 mt-0.5" />
                           {f}
                         </li>
                       ))}
                     </ul>
                     <button className={`w-full py-4 rounded-xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] ${i === 1 ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/30' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                       Get Started
                     </button>
                   </div>
                 ))}
               </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;