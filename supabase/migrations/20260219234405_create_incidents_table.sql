-- Create incidents table
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('inappropriate_behavior', 'delay_no_show', 'fraud', 'payment_issue', 'other')),
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Policies for incidents
-- Anyone authenticated can view incidents (for reporting)
CREATE POLICY "Anyone authenticated can view incidents" ON public.incidents 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Users can create incidents
CREATE POLICY "Users can create incidents" ON public.incidents 
FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

-- Admins can update all incidents
CREATE POLICY "Admins can update all incidents" ON public.incidents 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can delete incidents
CREATE POLICY "Admins can delete incidents" ON public.incidents 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_incidents_status ON public.incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_type ON public.incidents(type);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON public.incidents(priority);
CREATE INDEX IF NOT EXISTS idx_incidents_reporter_id ON public.incidents(reporter_id);
CREATE INDEX IF NOT EXISTS idx_incidents_reported_user_id ON public.incidents(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_incidents_trip_id ON public.incidents(trip_id);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON public.incidents(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_incidents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_incidents_updated_at
BEFORE UPDATE ON public.incidents
FOR EACH ROW
EXECUTE FUNCTION update_incidents_updated_at();

