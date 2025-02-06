// Add this route to update Metamask ID
app.put('/voters/update-metamask/:voterId', async (req, res) => {
  const { voterId } = req.params;
  const { metamask_id } = req.body;

  if (!voterId || !metamask_id) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const query = 'UPDATE voters SET metamask_id = ? WHERE voter_id = ?';
    db.query(query, [metamask_id, voterId], (err, result) => {
      if (err) {
        console.error('Error updating Metamask ID:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      res.json({ success: true, message: 'Metamask ID updated successfully' });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});