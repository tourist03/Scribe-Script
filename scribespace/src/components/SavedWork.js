<div className="note-card">
  <h3>{item.title}</h3>
  <p>{item.description}</p>
  <div className="card-footer">
    <div className="date">{new Date(item.date).toLocaleDateString()}</div>
    <div className="actions">
      <button onClick={() => handleEdit(item._id)} className="edit-btn">Edit</button>
      <button onClick={() => handleDelete(item._id, 'note')} className="delete-btn">Delete</button>
    </div>
  </div>
</div>

<div className="drawing-card">
  <div className="drawing-preview">
    <img src={item.drawingData} alt={`Drawing ${index + 1}`} />
  </div>
  <div className="drawing-actions">
    <button onClick={() => handleDownload(item.drawingData, index)} className="action-btn">
      <Download size={20} />
    </button>
    <button onClick={() => handleDelete(item._id, 'drawing')} className="action-btn delete">
      <Trash2 size={20} />
    </button>
  </div>
  <div className="work-date">
    {new Date(item.date).toLocaleDateString()}
  </div>
</div>