import React from 'react';
import { Automation } from '../types';
import { Zap, MessageCircle, Mail, Clock, PlayCircle, PauseCircle, Plus } from 'lucide-react';

interface AutomationsProps {
  automations: Automation[];
  onUpdate: (automations: Automation[]) => void;
}

const Automations: React.FC<AutomationsProps> = ({ automations, onUpdate }) => {

  const toggleStatus = (id: string) => {
    const updated = automations.map(auto => ({
      ...auto,
      status: (auto.status === 'Active' ? 'Paused' : 'Active') as 'Active' | 'Paused'
    }));
    onUpdate(updated);
  };

  const handleAdd = () => {
    const newAuto: Automation = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Custom Workflow',
      type: 'Email',
      trigger: 'Manual Trigger',
      status: 'Paused',
      stats: { sent: 0, opened: '0%' }
    };
    onUpdate([...automations, newAuto]);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Automations</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Put your coaching business on autopilot.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 flex items-center gap-2 shadow-lg shadow-primary-600/30 transition-all hover:translate-y-[-1px]"
        >
          <Plus size={18} /> New Workflow
        </button>
      </div>

      <div className="grid gap-4">
        {automations.map((auto) => (
          <div key={auto.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-5 flex-1 w-full">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                auto.type === 'WhatsApp' 
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {auto.type === 'WhatsApp' ? <MessageCircle size={28} /> : <Mail size={28} />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{auto.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <Clock size={14} />
                  <span>{auto.trigger}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-10 w-full md:w-auto justify-center md:justify-start bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl md:bg-transparent md:p-0">
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900 dark:text-white">{auto.stats.sent}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Sent</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900 dark:text-white">{auto.stats.opened}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Open Rate</div>
              </div>
            </div>

            <div className="w-full md:w-auto flex justify-end">
              <button 
                onClick={() => toggleStatus(auto.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center md:w-auto ${
                  auto.status === 'Active' 
                    ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                }`}
              >
                {auto.status === 'Active' ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                {auto.status}
              </button>
            </div>
          </div>
        ))}

        {automations.length === 0 && (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
            No automations yet. Create one to get started!
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/10 dark:to-purple-900/10 border border-primary-100 dark:border-primary-800/30 rounded-2xl p-6 flex items-start gap-4">
        <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
            <Zap className="text-primary-600 dark:text-primary-400" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-primary-900 dark:text-primary-100">AI Recommendation</h3>
          <p className="text-sm text-primary-800 dark:text-primary-200/70 mt-1 leading-relaxed">
            Based on your client activity, we recommend adding a <strong>"Sunday Prep"</strong> email to encourage clients to meal prep for the week. This typically increases adherence by 24%.
          </p>
          <button className="mt-3 text-sm font-bold text-primary-700 dark:text-primary-300 hover:underline">
            Create "Sunday Prep" Workflow
          </button>
        </div>
      </div>
    </div>
  );
};

export default Automations;