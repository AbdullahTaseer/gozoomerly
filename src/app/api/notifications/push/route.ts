import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';


export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as {
      notification_id?: string;
      recipient_id?: string;
      title?: string;
      body?: string;
      url?: string;
      data?: Record<string, unknown>;
    } | null;

    if (!body?.recipient_id || !body.title) {
      return NextResponse.json(
        { error: 'Missing recipient_id or title' },
        { status: 400 }
      );
    }

    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID?.trim();
    const restKey = process.env.ONESIGNAL_REST_API_KEY?.trim();

    if (!appId || !restKey) {
      return NextResponse.json(
        {
          error:
            'OneSignal not configured. Set NEXT_PUBLIC_ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY.',
        },
        { status: 500 }
      );
    }

    const payload: Record<string, unknown> = {
      app_id: appId,
      target_channel: 'push',
      include_aliases: { external_id: [body.recipient_id] },
      headings: { en: body.title },
      contents: { en: body.body || ' ' },
      data: {
        notification_id: body.notification_id,
        ...(body.data || {}),
      },
    };
    if (body.url) payload.url = body.url;

    const res = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Key ${restKey}`,
      },
      body: JSON.stringify(payload),
    });

    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;

    if (!res.ok) {
      return NextResponse.json(
        { error: 'OneSignal error', status: res.status, details: json },
        { status: 502 }
      );
    }

   
    if (body.notification_id) {
      try {
        await supabase
          .from('notifications')
          .update({ is_pushed: true, pushed_at: new Date().toISOString() })
          .eq('id', body.notification_id);
      } catch {
        /* ignore */
      }
    }

    return NextResponse.json({ ok: true, onesignal: json });
  } catch (err) {
    console.error('[push route] error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
