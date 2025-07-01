// vue-client/src/utils/metaUpdater.js

/**
 * Sets the document's title and meta description tag.
 * @param {string} title - The title for the page.
 * @param {string} description - The meta description for the page.
 */
export function setMetaTags(title, description) {
  // Set the document title
  document.title = title ? `${title} | Diary & Stationery Co.` : 'Diary & Stationery Co.';

  // Find or create the meta description tag
  let metaDescriptionTag = document.querySelector('meta[name="description"]');
  if (!metaDescriptionTag) {
    metaDescriptionTag = document.createElement('meta');
    metaDescriptionTag.setAttribute('name', 'description');
    document.head.appendChild(metaDescriptionTag);
  }

  // Set the content of the meta description tag
  const defaultDescription = 'Your one-stop shop for beautiful diaries, quality pens, and unique stationery essentials. Explore our curated collection.';
  const pageDescription = description && description.length > 20 ? description.substring(0, 160) : defaultDescription;
  metaDescriptionTag.setAttribute('content', pageDescription);
}

/**
 * Helper function to update an existing meta tag or create it if it doesn't exist.
 * @param {string} attributeType - 'name' or 'property' (for OG tags).
 * @param {string} attributeValue - The value for the 'name' or 'property' attribute.
 * @param {string} content - The content for the meta tag.
 */
function updateOrCreateMetaTag(attributeType, attributeValue, content) {
  let selector = `meta[${attributeType}="${attributeValue}"]`;
  let tag = document.querySelector(selector);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attributeType, attributeValue);
    document.head.appendChild(tag);
  }
  // Ensure content is a string, even if it's empty
  tag.setAttribute('content', content || '');
}


/**
 * Sets Open Graph (OG) and Twitter Card meta tags for social sharing.
 * @param {string} title - The title for the social share.
 * @param {string} description - The description for the social share.
 * @param {string} imageUrl - The URL of the image to be used for the social share.
 * @param {string} pageUrl - The canonical URL of the page.
 * @param {string} [type='website'] - The OG type (e.g., 'website', 'product', 'article').
 */
export function setSocialMetaTags(title, description, imageUrl, pageUrl, type = 'website') {
  const siteName = 'Diary & Stationery Co.';
  const defaultDescription = 'Discover unique stationery items for every need.';
  const defaultTitle = siteName;
  // IMPORTANT: Replace this placeholder with an actual URL to a default image for your site
  const defaultImageUrl = 'https://yourdomain.com/path/to/default-social-image.jpg'; 

  // Open Graph Tags
  updateOrCreateMetaTag('property', 'og:title', title || defaultTitle);
  updateOrCreateMetaTag('property', 'og:description', description ? description.substring(0, 200) : defaultDescription);
  updateOrCreateMetaTag('property', 'og:type', type);
  updateOrCreateMetaTag('property', 'og:image', imageUrl || defaultImageUrl);
  if (pageUrl) {
    updateOrCreateMetaTag('property', 'og:url', pageUrl);
  }
  updateOrCreateMetaTag('property', 'og:site_name', siteName);

  // Twitter Card Tags
  updateOrCreateMetaTag('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary');
  updateOrCreateMetaTag('name', 'twitter:title', title || defaultTitle);
  updateOrCreateMetaTag('name', 'twitter:description', description ? description.substring(0, 200) : defaultDescription);
  updateOrCreateMetaTag('name', 'twitter:image', imageUrl || defaultImageUrl);
  // Optional: Add your Twitter handle if you have one
  // updateOrCreateMetaTag('name', 'twitter:site', '@YourTwitterHandle');
  // updateOrCreateMetaTag('name', 'twitter:creator', '@YourTwitterHandle');
}
