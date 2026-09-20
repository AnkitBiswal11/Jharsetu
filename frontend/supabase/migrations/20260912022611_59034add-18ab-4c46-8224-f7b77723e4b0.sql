
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION private.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM public;
REVOKE EXECUTE ON FUNCTION private.is_staff(uuid) FROM public;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_staff(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "Staff can update submissions" ON public.submissions;
CREATE POLICY "Staff can update submissions" ON public.submissions
  FOR UPDATE TO authenticated
  USING (private.is_staff(auth.uid()))
  WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff can append submission events" ON public.submission_events;
CREATE POLICY "Staff can append submission events" ON public.submission_events
  FOR INSERT TO authenticated
  WITH CHECK (private.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff can read field evidence" ON storage.objects;
CREATE POLICY "Staff can read field evidence" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'evidence' AND private.is_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.enforce_status_permissions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status IN ('ai_structured', 'verified', 'resolved') THEN
      IF NOT private.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Only State Admin staff can set status %', NEW.status;
      END IF;
    ELSIF NEW.status IN ('adopted', 'in_progress') THEN
      IF NOT private.has_role(auth.uid(), 'hei') THEN
        RAISE EXCEPTION 'Only institution (HEI) staff can set status %', NEW.status;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.enforce_status_permissions() FROM anon, authenticated, public;

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.is_staff(uuid);
