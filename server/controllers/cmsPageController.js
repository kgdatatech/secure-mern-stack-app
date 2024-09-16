const CmsPage = require('../models/CmsPage');

// Get all CMS pages
exports.getAllPages = async (req, res) => {
  try {
    const pages = await CmsPage.find();
    res.status(200).json(pages);
  } catch (error) {
    console.error('Error fetching all pages:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get a single CMS page by route
exports.getPageByRoute = async (req, res) => {
  try {
    const route = req.params.route.startsWith('/') ? req.params.route : `/${req.params.route}`;
    console.log('Fetching page with route:', route);
    const page = await CmsPage.findOne({ route });
    if (!page) {
      console.log('Page not found for route:', route);
      return res.status(404).json({ error: 'Page not found' });
    }
    res.status(200).json(page);
  } catch (error) {
    console.error('Error in getPageByRoute:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Create or update a CMS page
exports.createOrUpdatePage = async (req, res) => {
  const { title, content, route } = req.body;

  if (!title || !content || !route) {
    return res.status(400).json({ error: 'Title, content, and route are required.' });
  }

  try {
    let page = await CmsPage.findOne({ route });

    if (page) {
      console.log(`Updating page with route: ${route}`);
      page.title = title;
      page.content = content;
      page.lastEdited = Date.now();
    } else {
      console.log(`Creating new page with route: ${route}`);
      page = new CmsPage({ title, content, route });
    }

    await page.save();
    console.log(`Page saved successfully: ${page}`);
    res.status(200).json(page);
  } catch (error) {
    console.error('Error in createOrUpdatePage:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get dynamic content by key and route
exports.getDynamicContent = async (req, res) => {
  const { route, key } = req.params;
  try {
    const page = await CmsPage.findOne({ route });
    if (!page || !page.dynamicContent.has(key)) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.status(200).json({ key, value: page.dynamicContent.get(key) });
  } catch (error) {
    console.error('Error fetching dynamic content:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update dynamic content by key and route
exports.updateDynamicContent = async (req, res) => {
  const { route, key } = req.params;
  const { value } = req.body;

  if (!value) {
    return res.status(400).json({ error: 'Content value is required.' });
  }

  try {
    let page = await CmsPage.findOne({ route });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    page.dynamicContent.set(key, value);
    page.lastEdited = Date.now();

    await page.save();
    res.status(200).json({ key, value });
  } catch (error) {
    console.error('Error updating dynamic content:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};
