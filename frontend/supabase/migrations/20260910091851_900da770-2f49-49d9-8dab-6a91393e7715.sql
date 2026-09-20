REVOKE EXECUTE ON FUNCTION public.log_submission_status() FROM anon, authenticated, public;

CREATE POLICY "Anyone can upload field evidence"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'evidence');

CREATE POLICY "Anyone can read field evidence"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'evidence');