    // app/api/proxy/route.ts
    import { NextRequest, NextResponse } from 'next/server';

    export const config = {
      api: {
        bodyParser: false,
      },
    };

    export async function POST(req: NextRequest) {
      try {
        const targetURL = 'https://devnet.dplabs-internal.com/';

        const rawBody = await req.text();

        const res = await fetch(targetURL, {
          method: 'POST',
          headers: {
            'content-type': req.headers.get('content-type') || 'application/json',
          },
          body: rawBody,
        });

        if (!res.ok) {
          console.error('Proxy request failed:', res.status, res.statusText);
          return new NextResponse(null, {
            status: res.status,
            statusText: res.statusText,
          });
        }

        const text = await res.text();
        return new NextResponse(text, {
          status: res.status,
          headers: {
            'content-type': res.headers.get('content-type') || 'application/json',
          },
        });
            /* eslint-disable @typescript-eslint/no-explicit-any */
      } catch (error: any) {
        console.error('Proxy error:', error);
        return new NextResponse(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            'content-type': 'application/json',
          },
        });
      }
    }