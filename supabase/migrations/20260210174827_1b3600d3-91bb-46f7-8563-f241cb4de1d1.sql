
-- Mood insights cache table
CREATE TABLE public.mood_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trend TEXT NOT NULL,
  risk_level TEXT NOT NULL DEFAULT 'low',
  summary TEXT NOT NULL,
  suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mood_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own insights"
  ON public.mood_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own insights"
  ON public.mood_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights"
  ON public.mood_insights FOR DELETE
  USING (auth.uid() = user_id);

-- Add onboarding_completed to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
