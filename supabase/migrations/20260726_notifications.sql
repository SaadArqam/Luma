-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    keys_p256dh TEXT NOT NULL,
    keys_auth TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT push_subscriptions_user_endpoint_key UNIQUE (user_id, endpoint)
);

-- Enable RLS for push_subscriptions
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'push_subscriptions' AND policyname = 'Users can manage their own push subscriptions'
    ) THEN
        CREATE POLICY "Users can manage their own push subscriptions"
        ON public.push_subscriptions
        FOR ALL
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    daily_reminder_enabled BOOLEAN DEFAULT false,
    daily_reminder_time TEXT DEFAULT '20:00',
    eod_summary_enabled BOOLEAN DEFAULT true,
    timezone TEXT DEFAULT 'Asia/Kolkata',
    last_reminder_sent_date TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure last_reminder_sent_date exists if table was created earlier
ALTER TABLE public.notification_preferences ADD COLUMN IF NOT EXISTS last_reminder_sent_date TEXT;

-- Enable RLS for notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'notification_preferences' AND policyname = 'Users can manage their own notification preferences'
    ) THEN
        CREATE POLICY "Users can manage their own notification preferences"
        ON public.notification_preferences
        FOR ALL
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Create daily_tips table
CREATE TABLE IF NOT EXISTS public.daily_tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    tip_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT daily_tips_user_date_key UNIQUE (user_id, date)
);

-- Enable RLS for daily_tips
ALTER TABLE public.daily_tips ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'daily_tips' AND policyname = 'Users can view and create their own daily tips'
    ) THEN
        CREATE POLICY "Users can view and create their own daily tips"
        ON public.daily_tips
        FOR ALL
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
