-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  notification_preferences JSONB DEFAULT '{"sms": false, "whatsapp": false, "email": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Mood entries table
CREATE TABLE public.mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 5),
  note TEXT,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mood entries" 
ON public.mood_entries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood entries" 
ON public.mood_entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries" 
ON public.mood_entries FOR DELETE 
USING (auth.uid() = user_id);

-- Session summaries table (from therapy/doctor visits)
CREATE TABLE public.session_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  provider_name TEXT,
  summary TEXT NOT NULL,
  key_takeaways TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.session_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions" 
ON public.session_summaries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
ON public.session_summaries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
ON public.session_summaries FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" 
ON public.session_summaries FOR DELETE 
USING (auth.uid() = user_id);

-- Care plans table (AI-generated)
CREATE TABLE public.care_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_summary_id UUID REFERENCES public.session_summaries(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.care_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own care plans" 
ON public.care_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own care plans" 
ON public.care_plans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own care plans" 
ON public.care_plans FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own care plans" 
ON public.care_plans FOR DELETE 
USING (auth.uid() = user_id);

-- Reminders table
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  care_plan_id UUID REFERENCES public.care_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'sms', 'whatsapp')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminders" 
ON public.reminders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders" 
ON public.reminders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" 
ON public.reminders FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" 
ON public.reminders FOR DELETE 
USING (auth.uid() = user_id);

-- Care task completions tracking
CREATE TABLE public.care_task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  care_plan_id UUID REFERENCES public.care_plans(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.care_task_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own completions" 
ON public.care_task_completions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own completions" 
ON public.care_task_completions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own completions" 
ON public.care_task_completions FOR DELETE 
USING (auth.uid() = user_id);

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();