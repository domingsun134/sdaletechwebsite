-- Backfill job_id for applications that have a matching job_title but missing job_id
UPDATE applications
SET job_id = jobs.id
FROM jobs
WHERE applications.job_title = jobs.title
  AND applications.job_id IS NULL;

-- Optional: Verify the update
-- SELECT id, job_title, job_id, status FROM applications;
