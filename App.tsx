import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Onboarding from './components/Onboarding';
import CRM from './components/CRM';
import WebsiteBuilder from './components/WebsiteBuilder';
import ContentEngine from './components/ContentEngine';
import Automations from './components/Automations';
import Payments from './components/Payments';
import Settings from './components/Settings';
import Auth from './components/Auth';
import ToastContainer, { ToastMessage, ToastType } from './components/Toast';
import { AppView, BusinessBlueprint, Client, ClientStatus, SocialPost, Automation } from './types';
import { regenerateContentPlan } from './services/geminiService';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { authService } from './services/authService';
import { 
  clientsService, 
  socialPostsService, 
  automationsService, 
  blueprintService,
  analyticsService 
} from './services/supabaseService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // App State
  const [isLoading, setIsLoading] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  // Data State
  const [blueprint, setBlueprint] = useState<BusinessBlueprint | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Toggle Theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Initialize Auth Check
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const checkAuth = async () => {
      if (isSupabaseConfigured() && supabase) {
        // Check active session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserEmail(session.user.email || '');
          setIsAuthenticated(true);
        }
        
        // Listen for changes
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setUserEmail(session.user.email || '');
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            setUserEmail(null);
            setBlueprint(null);
            setClients([]);
            setAutomations([]);
          }
        });
        subscription = data.subscription;
        setAuthChecking(false);
      } else {
        setAuthChecking(false);
      }
    };

    checkAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Load data and setup real-time subscriptions when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubscribeClients: (() => void) | undefined;
    let unsubscribeAutomations: (() => void) | undefined;
    let unsubscribeBlueprint: (() => void) | undefined;
    let unsubscribePosts: (() => void) | undefined;

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load all data in parallel
        const [blueprintData, clientsData, automationsData, postsData, revenueData] = await Promise.all([
          blueprintService.get(),
          clientsService.getAll(),
          automationsService.getAll(),
          socialPostsService.getAll(),
          analyticsService.getRevenue()
        ]);

        if (blueprintData) {
          // Merge posts into blueprint
          blueprintData.contentPlan = postsData;
          setBlueprint(blueprintData);
          setHasOnboarded(true);
        }

        setClients(clientsData);
        setAutomations(automationsData.length > 0 ? automationsData : [
          { id: '1', name: 'Weekly Client Check-in', type: 'WhatsApp', trigger: 'Every Monday 8AM', status: 'Active', stats: { sent: 0, opened: '0%' } },
          { id: '2', name: 'New Lead Welcome', type: 'Email', trigger: 'On Sign Up', status: 'Active', stats: { sent: 0, opened: '0%' } },
        ]);
        setRevenueData(revenueData);

        // Setup real-time subscriptions
        unsubscribeClients = clientsService.subscribeToChanges(setClients);
        unsubscribeAutomations = automationsService.subscribeToChanges(setAutomations);
        unsubscribeBlueprint = blueprintService.subscribeToChanges((bp) => {
          if (bp) {
            setBlueprint(prev => prev ? { ...prev, ...bp } : bp);
          }
        });
        unsubscribePosts = socialPostsService.subscribeToChanges((posts) => {
          setBlueprint(prev => prev ? { ...prev, contentPlan: posts } : null);
        });

        addToast('Data loaded successfully', 'success');
      } catch (error: any) {
        console.error('Error loading data:', error);
        addToast(error.message || 'Failed to load data', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Cleanup subscriptions
    return () => {
      if (unsubscribeClients) unsubscribeClients();
      if (unsubscribeAutomations) unsubscribeAutomations();
      if (unsubscribeBlueprint) unsubscribeBlueprint();
      if (unsubscribePosts) unsubscribePosts();
    };
  }, [isAuthenticated]);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    addToast(`Welcome back, ${email}`, 'success');
  };

  const handleLogout = async () => {
    await authService.signOut();
    setIsAuthenticated(false);
    setUserEmail(null);
    setBlueprint(null);
    setHasOnboarded(false);
    setClients([]);
    setAutomations([]);
    addToast('Signed out successfully', 'info');
  };

  const handleOnboardingComplete = async (data: BusinessBlueprint) => {
    try {
      // Save blueprint to database
      const savedBlueprint = await blueprintService.upsert(data);
      
      // Save content plan
      if (data.contentPlan && data.contentPlan.length > 0) {
        await socialPostsService.bulkCreate(data.contentPlan);
      }

      // Create initial client
      const initialClient = await clientsService.create({
        name: 'Example Lead',
        email: 'lead@example.com',
        status: ClientStatus.LEAD,
        program: 'Interest',
        joinDate: new Date().toISOString().split('T')[0],
        lastCheckIn: 'N/A',
        progress: 0
      });

      // Create default automations
      const defaultAutomations = [
        { name: 'Weekly Client Check-in', type: 'WhatsApp' as const, trigger: 'Every Monday 8AM', status: 'Active' as const, stats: { sent: 0, opened: '0%' } },
        { name: 'New Lead Welcome', type: 'Email' as const, trigger: 'On Sign Up', status: 'Active' as const, stats: { sent: 0, opened: '0%' } },
      ];

      for (const auto of defaultAutomations) {
        await automationsService.create(auto);
      }

      setBlueprint(savedBlueprint);
      setHasOnboarded(true);
      addToast('Business initialized successfully!', 'success');
    } catch (error: any) {
      console.error('Error during onboarding:', error);
      addToast(error.message || 'Failed to complete onboarding', 'error');
    }
  };

  // Client Handlers
  const handleAddClient = async (clientData: Partial<Client>) => {
    try {
      await clientsService.create({
        name: clientData.name || 'New Client',
        email: clientData.email || '',
        status: clientData.status || ClientStatus.LEAD,
        program: clientData.program || 'General',
        joinDate: new Date().toISOString().split('T')[0],
        lastCheckIn: 'Never',
        progress: 0
      });
      addToast('Client added successfully', 'success');
    } catch (error: any) {
      console.error('Error adding client:', error);
      addToast(error.message || 'Failed to add client', 'error');
    }
  };

  const handleUpdateClient = async (id: string, updates: Partial<Client>) => {
    try {
      await clientsService.update(id, updates);
      addToast('Client updated', 'success');
    } catch (error: any) {
      console.error('Error updating client:', error);
      addToast(error.message || 'Failed to update client', 'error');
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await clientsService.delete(id);
      addToast('Client removed', 'info');
    } catch (error: any) {
      console.error('Error deleting client:', error);
      addToast(error.message || 'Failed to delete client', 'error');
    }
  };

  const handleCaptureLead = (email: string) => {
    handleAddClient({
      name: 'Website Lead',
      email: email,
      status: ClientStatus.LEAD,
      program: 'Waitlist',
    });
    addToast('New lead captured from website!', 'success');
  };

  // Blueprint Handlers
  const handleUpdateBlueprint = async (updates: Partial<BusinessBlueprint>) => {
    if (!blueprint) return;

    try {
      const updatedBlueprint = { ...blueprint, ...updates };
      await blueprintService.upsert(updatedBlueprint);
      addToast('Changes saved successfully', 'success');
    } catch (error: any) {
      console.error('Error updating blueprint:', error);
      addToast(error.message || 'Failed to save changes', 'error');
    }
  };

  // Content Handlers
  const handleUpdateContentPlan = async (newPlan: SocialPost[]) => {
    try {
      // Delete all existing posts
      await socialPostsService.deleteAll();
      
      // Create new posts
      if (newPlan.length > 0) {
        await socialPostsService.bulkCreate(newPlan);
      }
      
      addToast('Content plan updated', 'success');
    } catch (error: any) {
      console.error('Error updating content plan:', error);
      addToast(error.message || 'Failed to update content plan', 'error');
    }
  };

  const handleRegenerateContent = async (): Promise<SocialPost[]> => {
    if (!blueprint) return [];

    try {
      addToast('Generating new content strategy...', 'info');
      const plan = await regenerateContentPlan(blueprint.niche);
      
      // Save to database
      await socialPostsService.deleteAll();
      await socialPostsService.bulkCreate(plan);
      
      addToast('Content plan refreshed', 'success');
      return plan;
    } catch (error: any) {
      console.error('Error regenerating content:', error);
      addToast(error.message || 'Failed to regenerate content', 'error');
      return [];
    }
  };

  // Automation Handlers
  const handleUpdateAutomations = async (newAutomations: Automation[]) => {
    // This is called from Automations component
    // Real-time subscription will handle the update
  };

  if (authChecking) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 gap-2">
        <Loader2 className="animate-spin" /> Starting BusinessOS...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Auth onLogin={handleLogin} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 gap-2">
        <Loader2 className="animate-spin" /> Loading your empire...
      </div>
    );
  }

  if (!hasOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    if (!blueprint) return null;

    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard blueprint={blueprint} revenueData={revenueData} clients={clients} isDarkMode={isDarkMode} />;
      case AppView.CRM:
        return (
          <CRM 
            clients={clients} 
            onAddClient={handleAddClient} 
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
          />
        );
      case AppView.WEBSITE:
        return (
          <WebsiteBuilder 
            blueprint={blueprint} 
            onUpdate={(updates) => handleUpdateBlueprint({ websiteData: { ...blueprint.websiteData, ...updates } })} 
            onCaptureLead={handleCaptureLead}
          />
        );
      case AppView.CONTENT:
        return (
          <ContentEngine 
            blueprint={blueprint} 
            onUpdatePlan={handleUpdateContentPlan}
            onRegenerate={handleRegenerateContent}
          />
        );
      case AppView.AUTOMATIONS:
        return <Automations automations={automations} onUpdate={handleUpdateAutomations} />;
      case AppView.PAYMENTS:
        return <Payments blueprint={blueprint} clients={clients} />;
      case AppView.SETTINGS:
        return (
          <Settings 
            blueprint={blueprint} 
            userEmail={userEmail} 
            onUpdateProfile={handleUpdateBlueprint} 
            clients={clients}
          />
        );
      default:
        return <div className="p-8 text-slate-500">Feature coming soon...</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-1 overflow-auto relative">
        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
