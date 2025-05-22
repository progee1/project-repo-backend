// controllers/dataController.js
exports.getData = (req, res) => {
  res.status(200).json({ message: 'Fetched data successfully' });
};

exports.postData = (req, res) => {
  const { payload } = req.body;
  res.status(200).json({ message: 'Data received successfully', received: payload });
};
