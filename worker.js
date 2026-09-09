export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/twitter/")) {
      const username = url.pathname.split("/").pop();
      try {
        const response = await fetch(`https://api.fxtwitter.com/${username}`, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const data = await response.json();
        
        if (data.user) {
           if (data.user.avatar_url) {
              data.user.avatar_url = data.user.avatar_url.replace('https://pbs.twimg.com/', '/api/twimg/');
           }
           if (data.user.banner_url) {
              data.user.banner_url = data.user.banner_url.replace('https://pbs.twimg.com/', '/api/twimg/');
           }
        }
        
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (e) {
        return new Response(JSON.stringify({error: e.toString()}), {status: 500});
      }
    }
    
    // NEW endpoint for timeline
    if (url.pathname.startsWith("/api/timeline/")) {
        const username = url.pathname.split("/").pop();
        try {
            const response = await fetch(`https://syndication.twitter.com/srv/timeline-profile/screen-name/${username}`);
            const html = await response.text();
            return new Response(html, {
                headers: { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' }
            });
        } catch (e) {
            return new Response(e.toString(), {status: 500});
        }
    }
    
    if (url.pathname.startsWith("/api/twimg/")) {
        const targetUrl = url.pathname.replace("/api/twimg/", "https://pbs.twimg.com/");
        const response = await fetch(targetUrl);
        return new Response(response.body, {
           headers: {
              'Content-Type': response.headers.get('Content-Type'),
              'Cache-Control': 'public, max-age=86400',
              'Access-Control-Allow-Origin': '*'
           }
        });
    }

    return env.ASSETS.fetch(request);
  }
};
