-- ==============================================================================
-- CHAT PRIVACY, PERMISSIONS & ROLE BADGES FIX
-- Run this in your Supabase SQL Editor.
-- ==============================================================================

-- 1. Ensure chat_channels has channel_type column
ALTER TABLE public.chat_channels
ADD COLUMN IF NOT EXISTS channel_type text NOT NULL DEFAULT 'public';

-- 2. Backfill existing channels
UPDATE public.chat_channels
SET channel_type = CASE
  WHEN is_direct = true THEN 'direct'
  ELSE 'public'
END
WHERE channel_type IS NULL OR channel_type = '';

-- 3. Ensure chat_channel_members allows creators/admins to add members
ALTER TABLE public.chat_channel_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can join channels" ON public.chat_channel_members;
DROP POLICY IF EXISTS "Users can add channel members" ON public.chat_channel_members;
CREATE POLICY "Users can add channel members"
ON public.chat_channel_members FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can view channel memberships" ON public.chat_channel_members;
CREATE POLICY "Users can view channel memberships"
ON public.chat_channel_members FOR SELECT
USING (auth.role() = 'authenticated');

-- 4. Enable real-time for chat_channels and chat_channel_members if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'chat_channels'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_channels;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'chat_channel_members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_channel_members;
  END IF;
END $$;

