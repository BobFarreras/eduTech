-- 1. TAULA TOPICS
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name_key TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color_theme TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TAULA CHALLENGES
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    difficulty_tier INT DEFAULT 1,
    type TEXT NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TAULA PROFILES (La crea Supabase Auth normalment, però la simulem per local)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    total_xp INT DEFAULT 0,
    level INT DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TAULA USER_PROGRESS
CREATE TABLE IF NOT EXISTS public.user_progress (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id),
    xp_earned INT DEFAULT 10,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, challenge_id)
);

-- Activem RLS (Bones pràctiques, encara que el test usi Service Key)
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Permisos bàsics de lectura pública
CREATE POLICY "Public topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Public challenges" ON public.challenges FOR SELECT USING (true);