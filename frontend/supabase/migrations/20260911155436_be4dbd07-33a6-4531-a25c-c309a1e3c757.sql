
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'hei');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT 'Staff member',
  institute text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users manage own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;

-- Lock down the workflow: only signed-in staff may update submissions
DROP POLICY IF EXISTS "Open workflow updates for the public demo console" ON public.submissions;
CREATE POLICY "Staff can update submissions" ON public.submissions
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- Role-specific transition rules
CREATE OR REPLACE FUNCTION public.enforce_status_permissions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status IN ('ai_structured', 'verified', 'resolved') THEN
      IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Only State Admin staff can set status %', NEW.status;
      END IF;
    ELSIF NEW.status IN ('adopted', 'in_progress') THEN
      IF NOT public.has_role(auth.uid(), 'hei') THEN
        RAISE EXCEPTION 'Only institution (HEI) staff can set status %', NEW.status;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.enforce_status_permissions() FROM anon, authenticated, public;

CREATE TRIGGER submissions_enforce_permissions
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_status_permissions();

-- Workflow history writes are staff-only
DROP POLICY IF EXISTS "Public can append submission events" ON public.submission_events;
CREATE POLICY "Staff can append submission events" ON public.submission_events
  FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

-- Evidence files: uploads stay open for citizens, reads are staff-only
DROP POLICY IF EXISTS "Anyone can read field evidence" ON storage.objects;
CREATE POLICY "Staff can read field evidence" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'evidence' AND public.is_staff(auth.uid()));
