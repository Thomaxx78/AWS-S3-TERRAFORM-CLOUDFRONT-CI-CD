app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await ddbDocClient.send(new DeleteCommand({
      TableName: 'Todos',
      Key: { id }
    }));
    res.json({ success: true, message: `Todo ${id} supprimé` });
  } catch (err) {
    console.error('Erreur suppression:', err);
    res.status(500).json({ error: 'Erreur suppression' });
  }
});
