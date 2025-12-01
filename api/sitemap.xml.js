export default async function handler(req, res) {
  const siteUrl = "https://www.raklify.online";
  const wpApi = "https://raklifyblogs.wordpress.com/wp-json/wp/v2/posts?per_page=100";

  const response = await fetch(wpApi);
  const posts = await response.json();

  const urls = posts.map(post => {
    return `
      <url>
        <loc>${siteUrl}/blog/${post.slug}/</loc>
        <lastmod>${post.modified.slice(0, 10)}</lastmod>
        <priority>0.8</priority>
      </url>
    `;
  }).join("");

  const sitemap = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
    
    <url>
      <loc>${siteUrl}/</loc>
      <priority>1.0</priority>
    </url>

    <url>
      <loc>${siteUrl}/about-us/</loc>
    </url>

    <url>
      <loc>${siteUrl}/web-development-digital-marketing-services/</loc>
    </url>

    <url>
      <loc>${siteUrl}/our-portfolio/</loc>
    </url>

    <url>
      <loc>${siteUrl}/contact-us/</loc>
    </url>

    <url>
      <loc>${siteUrl}/blog/</loc>
    </url>

    ${urls}

  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(sitemap);
}
