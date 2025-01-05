const teacherQueries = require("./../db/queries/teacher");
const pool = require("./../db/pool");

const getTeachers = async (req, res) => {
  try {
    const { search } = req.query;

    const query = teacherQueries.getTeachersQuery(search);
    const values = search ? [`%${search}%`] : [];

    const { rows: teachers } = await pool.query(query, values);

    res.json(teachers);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeachers,
};
