import { findCard } from '@/lib/db'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const card = await findCard(id)

  if (!card || card.status !== 'active') {
    redirect(`/c/${id}`)
  }

  if (!card.reviewUrl) {
    redirect(`/edit/${id}`)
  }

  const ua = req.headers.get('user-agent') || ''
  const isIOS = /iphone|ipad|ipod/i.test(ua)

  // Android: HTTP redirect works fine — Chrome handles Google Universal Links
  if (!isIOS) {
    redirect(card.reviewUrl)
  }

  // iOS: HTTP 302 redirect doesn't trigger Universal Links in Safari.
  // Serve a tiny HTML page that uses JS to navigate — this DOES trigger
  // iOS Universal Links and opens Google Maps app if installed.
  const reviewUrl = card.reviewUrl
  const placeIdMatch = reviewUrl.match(/placeid=(ChIJ[a-zA-Z0-9_-]+)/)
  const placeId = placeIdMatch?.[1]

  // comgooglemaps:// deep link as primary attempt (works even without Universal Links)
  const deepLink = placeId
    ? `comgooglemaps://?action=writereview&q=place_id:${placeId}`
    : null

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>Membuka Google Maps...</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eef2f7;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      padding: 24px;
    }
    .card {
      background: white;
      border-radius: 24px;
      padding: 32px 24px;
      text-align: center;
      max-width: 360px;
      width: 100%;
      box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    }
    .icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
    }
    h1 { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 8px; }
    p { font-size: 14px; color: #6b7280; line-height: 1.5; margin-bottom: 24px; }
    .btn {
      display: block;
      width: 100%;
      padding: 16px;
      background: #1a73e8;
      color: white;
      font-size: 15px;
      font-weight: 600;
      border-radius: 16px;
      text-decoration: none;
      margin-bottom: 12px;
    }
    .dots { display: flex; justify-content: center; gap: 6px; margin-bottom: 20px; }
    .dot {
      width: 8px; height: 8px;
      background: #1a73e8;
      border-radius: 50%;
      animation: bounce 0.8s ease-in-out infinite;
    }
    .dot:nth-child(2) { animation-delay: 0.15s; }
    .dot:nth-child(3) { animation-delay: 0.3s; }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); opacity: 0.4; }
      50% { transform: translateY(-6px); opacity: 1; }
    }
  </style>
</head>
<body>
  <div class="card">
    <svg class="icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" fill="#fce8e6"/>
      <path d="M32 16C25.373 16 20 21.373 20 28c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12zm0 16a4 4 0 110-8 4 4 0 010 8z" fill="#ea4335"/>
    </svg>
    <h1>Membuka Google Maps...</h1>
    <p>Kamu akan diarahkan ke halaman ulasan Google Maps.</p>
    <div class="dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
    <a class="btn" href="${reviewUrl}" id="btn">Buka Halaman Review</a>
  </div>

  <script>
    var reviewUrl = ${JSON.stringify(reviewUrl)};
    var deepLink = ${deepLink ? JSON.stringify(deepLink) : 'null'};

    function tryDeepLink() {
      if (!deepLink) { goWeb(); return; }

      // Try comgooglemaps:// first — opens Google Maps app directly
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = deepLink;
      document.body.appendChild(iframe);

      // If app not installed, fallback to web URL after 600ms
      setTimeout(function() {
        if (!document.hidden) { goWeb(); }
      }, 600);
    }

    function goWeb() {
      window.location.href = reviewUrl;
    }

    // Kick off immediately
    tryDeepLink();

    // Update button to show it's ready
    setTimeout(function() {
      var btn = document.getElementById('btn');
      if (btn) btn.textContent = 'Tap di sini jika tidak otomatis terbuka';
    }, 1500);
  </script>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
