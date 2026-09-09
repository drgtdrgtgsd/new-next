export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/twitter/")) {
      const username = url.pathname.split("/").pop();
      const instances = [
        `https://nitter.poast.org/${username}/rss`,
        `https://nitter.privacydev.net/${username}/rss`,
        `https://xcancel.com/${username}/rss`
      ];
      
      let xmlText = "";
      for (const instance of instances) {
        try {
          const response = await fetch(instance, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
          });
          if (response.ok) {
            xmlText = await response.text();
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      return new Response(xmlText || '<error>Failed to fetch RSS</error>', {
        headers: { 'Content-Type': 'application/xml', 'Access-Control-Allow-Origin': '*' }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
