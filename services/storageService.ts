import { ProjectData, SavedProject, ClientStatus } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { authService } from './authService';

const LOCAL_STORAGE_KEY = 'business_os_project_v2';

// Default initial state for new projects
const DEFAULT_CLIENTS = [
  {
    id: '1',
    name: 'Sample Client',
    email: 'client@example.com',
    status: ClientStatus.LEAD,
    program: 'Interested',
    joinDate: new Date().toISOString().split('T')[0],
    lastCheckIn: 'Never',
    progress: 0,
  }
];

export const storageService = {
  saveProject: async (projectData: ProjectData): Promise<boolean> => {
    const saveData: SavedProject = {
      data: projectData,
      lastUpdated: new Date().toISOString()
    };

    // 1. Try Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          // We store the entire project data object into the 'blueprint' JSONB column
          // to avoid changing the schema. In a production app, we might split tables.
          const { error } = await supabase
            .from('projects')
            .upsert({ 
              user_id: user.id, 
              blueprint: saveData.data, // Storing full data in blueprint column
              last_updated: saveData.lastUpdated
            });

          if (error) throw error;
          console.log('Project saved to Supabase');
          return true;
        }
      } catch (error) {
        console.error('Supabase save failed, falling back to local storage', error);
      }
    }

    // 2. Fallback to LocalStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveData));
      console.log('Project saved to local storage (Fallback)');
      return true;
    } catch (error) {
      console.error('Failed to save project locally', error);
      return false;
    }
  },

  loadProject: async (): Promise<SavedProject | null> => {
    // 1. Try Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          const { data, error } = await supabase
            .from('projects')
            .select('blueprint, last_updated')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') throw error;

          if (data && data.blueprint) {
             console.log('Project loaded from Supabase');
             
             // Migration check: if blueprint exists but clients don't (old save format)
             const loadedData = data.blueprint as any;
             const projectData: ProjectData = {
               blueprint: loadedData.businessName ? loadedData : loadedData.blueprint, // Handle nesting
               clients: loadedData.clients || DEFAULT_CLIENTS,
               automations: loadedData.automations || []
             };

             return {
               data: projectData,
               lastUpdated: data.last_updated
             };
          }
        }
      } catch (error) {
        console.error('Supabase load failed, falling back to local storage', error);
      }
    }

    // 2. Fallback to LocalStorage
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!data) return null;
      
      return JSON.parse(data) as SavedProject;
    } catch (error) {
      console.error('Failed to load project locally', error);
      return null;
    }
  }
};
