const dashboardQueries = require('./queries');

// Search for teacher names
const search = async (req, res) => {
  try {
    // Retrieve query string from the request
    const query = req.query.q;

    // If no query is provided, return an empty array
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query string cannot be empty' });
    }

    // Call the query function to get results
    const results = await dashboardQueries.search(query.trim());
    res.json(results);
  } catch (error) {
    // Handle errors and send a response
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  search,
};
