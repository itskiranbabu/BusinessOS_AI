import { supabase } from './supabaseClient';
import { Client, SocialPost, Automation, BusinessBlueprint } from '../types';

// =====================================================
// CLIENTS SERVICE
// =====================================================
export const clientsService = {
  // Get all clients for current user
  async getAll(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      status: client.status,
      program: client.program || '',
      joinDate: client.join_date,
      lastCheckIn: client.last_check_in || 'Never',
      progress: client.progress || 0
    }));
  },

  // Create new client
  async create(client: Omit<Client, 'id'>): Promise<Client> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        name: client.name,
        email: client.email,
        status: client.status,
        program: client.program,
        join_date: client.joinDate,
        last_check_in: client.lastCheckIn,
        progress: client.progress
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      status: data.status,
      program: data.program || '',
      joinDate: data.join_date,
      lastCheckIn: data.last_check_in || 'Never',
      progress: data.progress || 0
    };
  },

  // Update client
  async update(id: string, updates: Partial<Client>): Promise<Client> {
    const updateData: any = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.email) updateData.email = updates.email;
    if (updates.status) updateData.status = updates.status;
    if (updates.program) updateData.program = updates.program;
    if (updates.joinDate) updateData.join_date = updates.joinDate;
    if (updates.lastCheckIn) updateData.last_check_in = updates.lastCheckIn;
    if (updates.progress !== undefined) updateData.progress = updates.progress;

    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      status: data.status,
      program: data.program || '',
      joinDate: data.join_date,
      lastCheckIn: data.last_check_in || 'Never',
      progress: data.progress || 0
    };
  },

  // Delete client
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Subscribe to real-time changes
  subscribeToChanges(callback: (clients: Client[]) => void) {
    const channel = supabase
      .channel('clients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients'
        },
        async () => {
          const clients = await this.getAll();
          callback(clients);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};

// =====================================================
// SOCIAL POSTS SERVICE
// =====================================================
export const socialPostsService = {
  // Get all posts for current user
  async getAll(): Promise<SocialPost[]> {
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .order('day', { ascending: true });

    if (error) throw error;

    return data.map(post => ({
      id: post.id,
      day: post.day,
      hook: post.hook,
      body: post.body,
      cta: post.cta,
      type: post.type,
      status: post.status || 'Draft'
    }));
  },

  // Create new post
  async create(post: Omit<SocialPost, 'id'>): Promise<SocialPost> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('social_posts')
      .insert({
        user_id: user.id,
        day: post.day,
        hook: post.hook,
        body: post.body,
        cta: post.cta,
        type: post.type,
        status: post.status || 'Draft'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      day: data.day,
      hook: data.hook,
      body: data.body,
      cta: data.cta,
      type: data.type,
      status: data.status
    };
  },

  // Bulk create posts
  async bulkCreate(posts: Omit<SocialPost, 'id'>[]): Promise<SocialPost[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('social_posts')
      .insert(
        posts.map(post => ({
          user_id: user.id,
          day: post.day,
          hook: post.hook,
          body: post.body,
          cta: post.cta,
          type: post.type,
          status: post.status || 'Draft'
        }))
      )
      .select();

    if (error) throw error;

    return data.map(post => ({
      id: post.id,
      day: post.day,
      hook: post.hook,
      body: post.body,
      cta: post.cta,
      type: post.type,
      status: post.status
    }));
  },

  // Update post
  async update(id: string, updates: Partial<SocialPost>): Promise<SocialPost> {
    const updateData: any = {};
    if (updates.day !== undefined) updateData.day = updates.day;
    if (updates.hook) updateData.hook = updates.hook;
    if (updates.body) updateData.body = updates.body;
    if (updates.cta) updateData.cta = updates.cta;
    if (updates.type) updateData.type = updates.type;
    if (updates.status) updateData.status = updates.status;

    const { data, error } = await supabase
      .from('social_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      day: data.day,
      hook: data.hook,
      body: data.body,
      cta: data.cta,
      type: data.type,
      status: data.status
    };
  },

  // Delete post
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('social_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Delete all posts for user
  async deleteAll(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('social_posts')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Subscribe to real-time changes
  subscribeToChanges(callback: (posts: SocialPost[]) => void) {
    const channel = supabase
      .channel('social-posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_posts'
        },
        async () => {
          const posts = await this.getAll();
          callback(posts);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};

// =====================================================
// AUTOMATIONS SERVICE
// =====================================================
export const automationsService = {
  // Get all automations for current user
  async getAll(): Promise<Automation[]> {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(automation => ({
      id: automation.id,
      name: automation.name,
      type: automation.type,
      trigger: automation.trigger,
      status: automation.status,
      stats: {
        sent: automation.sent_count || 0,
        opened: automation.opened_rate || '0%'
      }
    }));
  },

  // Create new automation
  async create(automation: Omit<Automation, 'id'>): Promise<Automation> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('automations')
      .insert({
        user_id: user.id,
        name: automation.name,
        type: automation.type,
        trigger: automation.trigger,
        status: automation.status,
        sent_count: automation.stats.sent,
        opened_rate: automation.stats.opened
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      trigger: data.trigger,
      status: data.status,
      stats: {
        sent: data.sent_count || 0,
        opened: data.opened_rate || '0%'
      }
    };
  },

  // Update automation
  async update(id: string, updates: Partial<Automation>): Promise<Automation> {
    const updateData: any = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.type) updateData.type = updates.type;
    if (updates.trigger) updateData.trigger = updates.trigger;
    if (updates.status) updateData.status = updates.status;
    if (updates.stats) {
      if (updates.stats.sent !== undefined) updateData.sent_count = updates.stats.sent;
      if (updates.stats.opened) updateData.opened_rate = updates.stats.opened;
    }

    const { data, error } = await supabase
      .from('automations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      trigger: data.trigger,
      status: data.status,
      stats: {
        sent: data.sent_count || 0,
        opened: data.opened_rate || '0%'
      }
    };
  },

  // Delete automation
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('automations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Subscribe to real-time changes
  subscribeToChanges(callback: (automations: Automation[]) => void) {
    const channel = supabase
      .channel('automations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'automations'
        },
        async () => {
          const automations = await this.getAll();
          callback(automations);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};

// =====================================================
// BUSINESS BLUEPRINT SERVICE
// =====================================================
export const blueprintService = {
  // Get blueprint for current user
  async get(): Promise<BusinessBlueprint | null> {
    const { data, error } = await supabase
      .from('business_blueprints')
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }

    return {
      businessName: data.business_name,
      niche: data.niche,
      targetAudience: data.target_audience,
      mission: data.mission,
      websiteData: data.website_data,
      contentPlan: [], // Loaded separately from social_posts
      suggestedPrograms: data.suggested_programs || []
    };
  },

  // Create or update blueprint
  async upsert(blueprint: BusinessBlueprint): Promise<BusinessBlueprint> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('business_blueprints')
      .upsert({
        user_id: user.id,
        business_name: blueprint.businessName,
        niche: blueprint.niche,
        target_audience: blueprint.targetAudience,
        mission: blueprint.mission,
        website_data: blueprint.websiteData,
        suggested_programs: blueprint.suggestedPrograms
      })
      .select()
      .single();

    if (error) throw error;

    return {
      businessName: data.business_name,
      niche: data.niche,
      targetAudience: data.target_audience,
      mission: data.mission,
      websiteData: data.website_data,
      contentPlan: blueprint.contentPlan,
      suggestedPrograms: data.suggested_programs || []
    };
  },

  // Subscribe to real-time changes
  subscribeToChanges(callback: (blueprint: BusinessBlueprint | null) => void) {
    const channel = supabase
      .channel('blueprint-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'business_blueprints'
        },
        async () => {
          const blueprint = await this.get();
          callback(blueprint);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};

// =====================================================
// ANALYTICS SERVICE
// =====================================================
export const analyticsService = {
  async getRevenue(): Promise<any[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, created_at')
      .eq('status', 'Completed')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group by month
    const monthlyRevenue: { [key: string]: number } = {};
    data.forEach(payment => {
      const date = new Date(payment.created_at);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + parseFloat(payment.amount);
    });

    return Object.entries(monthlyRevenue).map(([name, value]) => ({ name, value }));
  },

  async getStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const [clientsData, paymentsData, postsData, automationsData] = await Promise.all([
      supabase.from('clients').select('status', { count: 'exact' }),
      supabase.from('payments').select('amount, status'),
      supabase.from('social_posts').select('id', { count: 'exact' }),
      supabase.from('automations').select('id', { count: 'exact' })
    ]);

    const activeClients = clientsData.data?.filter(c => c.status === 'Active').length || 0;
    const totalRevenue = paymentsData.data
      ?.filter(p => p.status === 'Completed')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;

    return {
      totalClients: clientsData.count || 0,
      activeClients,
      totalRevenue,
      totalPosts: postsData.count || 0,
      totalAutomations: automationsData.count || 0
    };
  }
};
