const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { URL } = require('url');

async function crawlWebsite(url, visitedUrls = new Set()) {
  try {
    // Fetch HTML content of the website
    const response = await axios.get(url);
    const html = response.data;

    // Load HTML content into Cheerio
    const $ = cheerio.load(html);

    // Extract all links
    const links = $('a').map((_, element) => $(element).attr('href')).get();

    // Fetch contents of each link
    for (const link of links) {
      // Resolve relative URLs
      const resolvedUrl = new URL(link, url).toString();

      // Skip processing mailto links
      if (resolvedUrl.startsWith('mailto:')) {
        continue;
      }

      // Check if the URL has already been visited
      if (!visitedUrls.has(resolvedUrl)) {
        // Add URL to visited set
        visitedUrls.add(resolvedUrl);

        // Fetch content of the link
        await crawlWebsite(resolvedUrl, visitedUrls);
      }
    }

    // Extract all text data
    const allText = $('body').text();

    // Generate a unique filename based on the current URL
    const fileName = `website_data_${url.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.txt`;

    // Write the text data to a .txt file
    fs.writeFile(fileName, allText, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Text data saved to ${fileName}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example usage:
crawlWebsite('https://www.bplans.com/start-a-business/industries/software-as-a-service/');
