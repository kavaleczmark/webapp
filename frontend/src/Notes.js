import React, { useState } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";

function Notes() {
  const [showModal, setShowModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [versions, setVersions] = useState([]);

  const handleCreateNote = () => {
    const note = { title: newNoteTitle, content: "", versions: [] };
    setNotes([...notes, note]);
    setShowModal(false);
    setNewNoteTitle("");
  };

  const handleSaveNote = () => {
    if (selectedNote !== null) {
      const newVersions = [...versions];
      newVersions.push({
        title: notes[selectedNote].title,
        date: new Date().toLocaleString(),
        content: noteContent,
      });
      setVersions(newVersions);
      const updatedNotes = [...notes];
      updatedNotes[selectedNote].content = noteContent;
      setNotes(updatedNotes);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex p-0">
      <div className="border-end border-2 p-3" style={{ width: "20%" }}>
        <h5>Felhasználó</h5>
        <ul className="list-group mb-3">
          {notes.map((note, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action"
              onClick={() => {
                setSelectedNote(index);
                setNoteContent(note.content);
              }}
              style={{ cursor: "pointer" }}
            >
              {note.title}
            </li>
          ))}
        </ul>
        <Button variant="success" onClick={() => setShowModal(true)}>+ Új jegyzet</Button>
      </div>

      <div className="border-end border-start border-2 p-3 d-flex flex-column" style={{ width: "60%" }}>
        {selectedNote !== null ? (
          <>
            <h4 className="mb-3">{notes[selectedNote].title}</h4>
            <Form.Control
              as="textarea"
              rows={20}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="flex-grow-1 mb-3"
            />
            <Button variant="primary" onClick={handleSaveNote}>Mentés</Button>
          </>
        ) : (
          <p>Válassz ki egy jegyzetet!</p>
        )}
      </div>

      <div className="p-3" style={{ width: "20%" }}>
        <h5>Verziók</h5>
        <div className="d-flex flex-column gap-2">
          {versions.map((v, i) => (
            <Card key={i} className="border-secondary">
              <Card.Body>
                <Card.Title>{v.title}</Card.Title>
                <Card.Text><small>{v.date}</small></Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>


      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Új jegyzet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Jegyzet címe</Form.Label>
              <Form.Control
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Mégse</Button>
          <Button variant="primary" onClick={handleCreateNote}>Létrehozás</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Notes;