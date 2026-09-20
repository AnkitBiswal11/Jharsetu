-- Status enum for the submission-to-resolution workflow
CREATE TYPE public.submission_status AS ENUM (
  'submitted',
  'ai_structured',
  'verified',
  'adopted',
  'in_progress',
  'resolved'
);

CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id text NOT NULL UNIQUE DEFAULT ('JS-26043-' || lpad((floor(random()*9000)+1000)::int::text, 4, '0')),
  citizen_name text NOT NULL,
  district text NOT NULL,
  block text,
  title text NOT NULL,
  description text NOT NULL,
  domains text[] NOT NULL DEFAULT '{}',
  photo_path text,
  photo_url text,
  status public.submission_status NOT NULL DEFAULT 'submitted',
  institute text,
  csr_sponsor text,
  feasibility int,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

GRANT SELECT, INSERT, UPDATE ON public.submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read submissions"
  ON public.submissions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can file a submission"
  ON public.submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Open workflow updates for the public demo console"
  ON public.submissions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.submission_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  status public.submission_status NOT NULL,
  actor text NOT NULL DEFAULT 'System',
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX submission_events_submission_idx ON public.submission_events(submission_id, created_at);

GRANT SELECT, INSERT ON public.submission_events TO anon;
GRANT SELECT, INSERT ON public.submission_events TO authenticated;
GRANT ALL ON public.submission_events TO service_role;

ALTER TABLE public.submission_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read submission events"
  ON public.submission_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can append submission events"
  ON public.submission_events FOR INSERT TO anon, authenticated WITH CHECK (true);

-- keep updated_at / resolved_at correct and log every status change
CREATE OR REPLACE FUNCTION public.log_submission_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.submission_events (submission_id, status, actor, note)
    VALUES (NEW.id, NEW.status, 'Citizen', 'Grievance filed through the citizen intake form');
    RETURN NEW;
  END IF;

  NEW.updated_at := now();
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'resolved' THEN
      NEW.resolved_at := now();
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER submissions_after_insert
  AFTER INSERT ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.log_submission_status();

CREATE TRIGGER submissions_before_update
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.log_submission_status();

-- Demo dataset so the admin charts and drilldowns are populated on first load
INSERT INTO public.submissions
  (tracking_id, citizen_name, district, block, title, description, domains, status, institute, csr_sponsor, feasibility, created_at)
VALUES
  ('JS-26043-0117','Sunita Devi','Palamu','Chainpur','Fluoride in hand-pump groundwater','Fourteen villages report fluoride above 1.8 mg/L; filters clog within four months.','{"Water Resources"}','adopted','BIT Mesra','Tata Steel Foundation',88, now() - interval '42 days'),
  ('JS-26043-0142','Birsa Munda','Khunti','Torpa','Monsoon spoilage of raw lac produce','Open-sun drying loses nearly a quarter of lac value before the mandi.','{"Tribal Livelihood"}','in_progress','NIT Jamshedpur','CCL CSR Cell',91, now() - interval '38 days'),
  ('JS-26043-0163','Anita Kachhap','Gumla','Bishunpur','Referral delays at the sub-centre','ANMs cover nine hamlets with no connectivity; maternal referrals slip by 31 hours.','{"Rural Healthcare"}','verified','IIT ISM Dhanbad','SAIL Community Trust',79, now() - interval '30 days'),
  ('JS-26043-0188','Rakesh Mahto','Dhanbad','Jharia','Floor cracking near abandoned galleries','Progressive subsidence cracking; manual survey cycles are quarterly at best.','{"Infrastructure"}','resolved','IIT ISM Dhanbad','BCCL',74, now() - interval '70 days'),
  ('JS-26043-0201','Phulmani Devi','Simdega','Kolebira','Upland paddy irrigation runs dry at grain-fill','Farmers over-irrigate early and lose a third of the yield later.','{"Agriculture & Soil"}','ai_structured','BIT Mesra',NULL,83, now() - interval '12 days'),
  ('JS-26043-0224','Md. Irfan','Sahibganj','Borio','Mini-grid trips every night','Three hamlet mini-grids trip nightly as unmetered loads are added.','{"Clean Energy"}','adopted','SUIIT Chaibasa','Coal India Ltd.',86, now() - interval '25 days'),
  ('JS-26043-0231','Kavita Oraon','Ranchi','Bero','School dropouts after class 8','No secondary school within 11 km; girls drop out after class 8.','{"Education Access"}','submitted',NULL,NULL,NULL, now() - interval '5 days'),
  ('JS-26043-0245','Suresh Bhagat','Ranchi','Ormanjhi','Contaminated pond used for washing','Cattle and household washing share the only pond; skin disease is rising.','{"Water Resources"}','verified','BIT Mesra',NULL,77, now() - interval '9 days'),
  ('JS-26043-0250','Manoj Soren','East Singhbhum','Potka','Soil acidity ruining vegetable plots','Yields halved over three seasons; no soil testing facility nearby.','{"Agriculture & Soil"}','submitted',NULL,NULL,NULL, now() - interval '3 days'),
  ('JS-26043-0261','Rina Hansda','Dumka','Shikaripara','Ambulance cannot reach in monsoon','The approach road floods for weeks; patients are carried on cots.','{"Rural Healthcare","Infrastructure"}','ai_structured',NULL,NULL,NULL, now() - interval '7 days'),
  ('JS-26043-0272','Dinesh Kumar','Bokaro','Chas','Street lighting mini-grid battery failure','Community solar lights fail within a year of installation.','{"Clean Energy"}','adopted','SUIIT Chaibasa','Coal India Ltd.',81, now() - interval '20 days'),
  ('JS-26043-0288','Lalita Devi','Hazaribagh','Barkagaon','Tasar silk yarn quality inconsistent','SHG yarn is rejected at the mandi due to uneven reeling.','{"Tribal Livelihood"}','in_progress','NIT Jamshedpur','Tata Steel Foundation',84, now() - interval '16 days');