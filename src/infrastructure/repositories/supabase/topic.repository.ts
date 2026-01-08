// filepath: src/infrastructure/repositories/supabase/topic.repository.ts
import { createClient } from '@supabase/supabase-js';
import { ITopicRepository } from '@/core/repositories/topic.repository';
import { Topic, CreateTopicInput } from '@/core/entities/topic.entity';
import { TopicNotFoundError } from '@/core/errors/topic.errors';

// 1. Definim el tipus exacte de la fila a la BD (Lectura)
type TopicRow = {
  id: string;
  slug: string;
  name_key: string;
  icon_name: string;
  color_theme: string;
  parent_topic_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// 2. Definim el tipus per a Escriptura (Insert/Update)
// Ometem camps generats (id, dates) i fem servir snake_case
type TopicPersistencePayload = {
  slug?: string;
  name_key?: string;
  icon_name?: string;
  color_theme?: string;
  parent_topic_id?: string | null;
  is_active?: boolean;
};

export class SupabaseTopicRepository implements ITopicRepository {
  // Nota: En un entorn real de Next.js amb Server Actions, 
  // hauríem d'injectar el client creat amb createServerClient per gestionar cookies.
  // Per ara, mantenim aquest client estàtic per a la fase d'infraestructura pura.
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  private mapToEntity(row: TopicRow): Topic {
    return {
      id: row.id,
      slug: row.slug,
      nameKey: row.name_key,
      iconName: row.icon_name,
      colorTheme: row.color_theme,
      parentTopicId: row.parent_topic_id || undefined,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async findAllActive(): Promise<Topic[]> {
    const { data, error } = await this.supabase
      .from('topics')
      .select('*')
      .eq('is_active', true)
      .returns<TopicRow[]>(); // Forcem el tipat de retorn

    if (error) throw new Error(`Supabase Error: ${error.message}`);
    
    return data.map((row) => this.mapToEntity(row));
  }

  async findAll(): Promise<Topic[]> {
    const { data, error } = await this.supabase
      .from('topics')
      .select('*')
      .returns<TopicRow[]>();

    if (error) throw new Error(error.message);
    return data.map((row) => this.mapToEntity(row));
  }

  async findById(id: string): Promise<Topic | null> {
    const { data, error } = await this.supabase
      .from('topics')
      .select('*')
      .eq('id', id)
      .single<TopicRow>();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return this.mapToEntity(data);
  }

  async findBySlug(slug: string): Promise<Topic | null> {
    const { data, error } = await this.supabase
      .from('topics')
      .select('*')
      .eq('slug', slug)
      .single<TopicRow>();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return this.mapToEntity(data);
  }

  async create(input: CreateTopicInput): Promise<Topic> {
    const dbPayload: TopicPersistencePayload = {
      slug: input.slug,
      name_key: input.nameKey,
      icon_name: input.iconName,
      color_theme: input.colorTheme,
      parent_topic_id: input.parentTopicId || null,
      is_active: input.isActive
    };

    const { data, error } = await this.supabase
      .from('topics')
      .insert(dbPayload)
      .select()
      .single<TopicRow>();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async update(id: string, input: Partial<CreateTopicInput>): Promise<Topic> {
    // Construïm l'objecte d'actualització de forma tipada, sense 'any'
    const dbPayload: TopicPersistencePayload = {};
    
    if (input.slug !== undefined) dbPayload.slug = input.slug;
    if (input.nameKey !== undefined) dbPayload.name_key = input.nameKey;
    if (input.iconName !== undefined) dbPayload.icon_name = input.iconName;
    if (input.colorTheme !== undefined) dbPayload.color_theme = input.colorTheme;
    if (input.isActive !== undefined) dbPayload.is_active = input.isActive;
    if (input.parentTopicId !== undefined) dbPayload.parent_topic_id = input.parentTopicId;

    const { data, error } = await this.supabase
      .from('topics')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single<TopicRow>();

    if (error) {
      // AQUÍ fem servir l'error de domini: Si no troba la fila per actualitzar
      if (error.code === 'PGRST116') {
        throw new TopicNotFoundError(id);
      }
      throw new Error(error.message);
    }
    
    return this.mapToEntity(data);
  }
}