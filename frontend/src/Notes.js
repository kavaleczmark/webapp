import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Card,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { useGetUserData } from "./hooks/useGetUserData";
import { FaUserCircle } from "react-icons/fa";
import { useGetLatestNotesForUser } from "./hooks/useGetLatestNotesForUser";
function Notes() {
  const [showModal, setShowModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [versions, setVersions] = useState([]);
  const { data } = useGetUserData();
  const { noteHistory, isLoading, isFinished, error, refreshNoteHistory } =useGetLatestNotesForUser();

  useEffect(() => {
      if (isFinished && noteHistory.length > 0) {
        const transformed = noteHistory.map((n) => ({
          title: n.latestVersion?.title || "Névtelen jegyzet",
          text: n.latestVersion?.text || "",
          notesId: n.notes_id,
          date: n.latestVersion?.date || "",
        }));
        setNotes(transformed);
      }
    }, [isFinished, noteHistory]);

  const handleCreateNote = () => {
    const note = {
      title: newNoteTitle,
      text: "",
      versions: [],
      date: new Date().toLocaleString(),
    };
    setShowModal(false);
    setNewNoteTitle("");
  };

  const handleSaveNote = () => {
    if (selectedNote !== null) {
      const newVersion = {
        title: noteTitle,
        date: new Date().toLocaleString(),
        text: noteText,
      };
      const updatedVersions = [...versions, newVersion];
      setVersions(updatedVersions);
      const updatedNotes = [...notes];
      updatedNotes[selectedNote].title = noteTitle;
      updatedNotes[selectedNote].content = noteText;
      setNotes(updatedNotes);
    }
  };

  const handleLoadVersion = (version) => {
    setNoteText(version.text);
    setNoteTitle(version.title);
  };

  return (
    <Container fluid className="vh-100 py-3">
      <Row className="h-100">
        <Col xs={12} md={3} className="border-end mb-3 mb-md-0">
          <div className="d-flex align-items-center mb-4">
            <FaUserCircle size={60} className="text-primary me-3" />
            <div>
              {data && (
                <>
                  <h5 className="fw-bold">{data.username}</h5>
                  <small className="text-muted">
                    Regisztráció dátuma: {data.reg_date}
                  </small>
                </>
              )}
            </div>
          </div>

          <hr style={{ border: "1px solid #ddd", marginBottom: "20px" }} />

          <h5>Jegyzetek</h5>
          <ul className="list-group mb-3">
            {notes && notes.map((note, index) => (
              <li
                key={note.noteId || index}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
              >
                <span
                  onClick={() => {
                    setSelectedNote(index);
                    setNoteText(note.text);
                    setNoteTitle(note.title);
                  }}
                >
                  <div className="fw-bold">{note.title}</div>
                  <div className="text-muted">{note.text?.substring(0, 25)}...</div>
                  <div className="text-muted">{note.date}</div>
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    const updatedNotes = notes.filter((_, i) => i !== index);
                    setNotes(updatedNotes);
                    if (selectedNote === index) {
                      setSelectedNote(null);
                      setNoteText("");
                      setNoteTitle("");
                    }
                  }}
                  title="Törlés"
                >
                  🗑️
                </span>
              </li>
            ))}
          </ul>

          <Button variant="success" onClick={() => setShowModal(true)}>
            + Új jegyzet
          </Button>
        </Col>

        <Col
          xs={12}
          md={6}
          className="border-end border-start mb-3 mb-md-0 d-flex flex-column"
        >
          {selectedNote !== null ? (
            <>
              <Form.Control
                type="text"
                className="mb-3"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Jegyzet címe"
              />
              <Form.Control
                as="textarea"
                rows={10}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="flex-grow-1 mb-3"
              />
              <Button variant="primary" onClick={handleSaveNote}>
                Mentés
              </Button>
            </>
          ) : (
            <p>Válassz ki egy jegyzetet!</p>
          )}
        </Col>

        <Col xs={12} md={3}>
          <h5>Verziók</h5>
          <div className="d-flex flex-column gap-2">
            {versions.map((v, i) => (
              <Card
                key={i}
                className="border-secondary"
                style={{ cursor: "pointer" }}
                onClick={() => handleLoadVersion(v)}
              >
                <Card.Body>
                  <Card.Title>{v.title}</Card.Title>
                  <Card.Text>
                    <small>{v.date}</small>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>
      </Row>

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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Mégse
          </Button>
          <Button variant="primary" onClick={handleCreateNote}>
            Létrehozás
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Notes;
