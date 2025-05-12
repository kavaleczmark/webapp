import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form, Card, Row, Col, Container, Collapse } from "react-bootstrap";
import { useGetUserData } from "./hooks/useGetUserData";
import { FaUserCircle } from "react-icons/fa";
import { useGetLatestNotesForUser } from "./hooks/useGetLatestNotesForUser";
import { useCreateNote } from "./hooks/useCreateNote";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { useLogout } from "./hooks/useLogout";
import { useDeleteNote } from "./hooks/useDeleteNote";
import { useSaveNoteVersion } from "./hooks/useSaveNoteVersion";
import { useGetNoteVersions } from "./hooks/useGetNoteVersions";


function Notes() {
    const [showModal, setShowModal] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [noteText, setNoteText] = useState("");
    const [noteTitle, setNoteTitle] = useState("");
    const [versions, setVersions] = useState([]);
    const [notesOpen, setNotesOpen] = useState(true);
    const [versionsOpen, setVersionsOpen] = useState(true);
    const [deletingNoteId, setDeletingNoteId] = useState(null);
    const deleteToastIdRef = useRef(null);
    const { logout } = useLogout();
    const navigate = useNavigate();
    const { data } = useGetUserData();
    const { noteHistory, isLoading, isFinished, error, refreshNoteHistory } = useGetLatestNotesForUser();
    const { createNote, isLoading: isCreating, isFinished: createFinished, error: createError } = useCreateNote();
    const toastId = useRef(null);
    const createButton = useRef(null);
    const { deleteNote, isLoading: isDeleting, isFinished: deleteFinished, error: deleteError } = useDeleteNote();
    const { saveNoteVersion, isSaving, isFinished: saveFinished, error: saveError } = useSaveNoteVersion();
    const saveToastIdRef = useRef(null);
    const { versions: loadedVersions, isFinished: versionsFinished, error: versionsError, getVersions } = useGetNoteVersions(
        notes[selectedNote]?.notesId
    );


    const handleLogout = () => {
        logout();
        navigate("/");
    }

    useEffect(() => {
        if (isFinished && noteHistory.length > 0) {
            const transformed = noteHistory.map((n) => ({
                title: n.latestVersion?.title || "Névtelen jegyzet",
                text: n.latestVersion?.text || "",
                notesId: n.noteId,
                versionId: n.latestVersion?.version_id || null,
                date: n.latestVersion?.date || "",
            }));
            setNotes(transformed);
        } else if (isFinished && noteHistory.length === 0) {
            setNotes([]);
            setSelectedNote(null);
            setNoteTitle("");
            setNoteText("");
            setVersions([]);
        }
    }, [isFinished, noteHistory]);


    const handleCreateNote = async (e) => {
        e.preventDefault();
        toastId.current = toast.loading("Kérem várjon...");
        await createNote(newNoteTitle || "Névtelen jegyzet", noteText);
    };

    useEffect(() => {
        if (isCreating && !toastId.current) {
            toastId.current = toast.loading("Kérem várjon...");
        } else if (!isCreating && toastId.current) {
            if (createFinished) {
                toast.update(toastId.current, {
                    render: "Jegyzet sikeresen hozzáadva!",
                    type: "success",
                    isLoading: false,
                    closeButton: true,
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    pauseOnFocusLoss: true,
                });

                refreshNoteHistory();
                setShowModal(false);
                setNewNoteTitle("");
                setNoteText("");
            } else if (createError) {
                toast.update(toastId.current, {
                    render: `${createError}`,
                    type: "error",
                    isLoading: false,
                    closeButton: true,
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    pauseOnFocusLoss: true,
                });
            }
            toastId.current = null;
        }
    }, [createFinished, createError, isCreating, refreshNoteHistory]);


    const handleSaveNote = async () => {
        if (selectedNote !== null) {
            const note = notes[selectedNote];
            const { notesId } = note;

            await saveNoteVersion(notesId, noteTitle, noteText);

            const updatedNotes = [...notes];
            if (updatedNotes[selectedNote]) {
                updatedNotes[selectedNote].title = noteTitle;
                updatedNotes[selectedNote].text = noteText;
                setNotes(updatedNotes);
            }

            await getVersions();
        } else {
            toast.warn("Nincs kiválasztott jegyzet a mentéshez.");
        }
    };

    useEffect(() => {
        if (isSaving && !saveToastIdRef.current) {
            saveToastIdRef.current = toast.loading("Mentés folyamatban...");
        } else if (!isSaving && saveToastIdRef.current) {
            if (saveFinished) {
                toast.update(saveToastIdRef.current, {
                    render: "Jegyzet elmentve!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                    closeButton: true,
                    hideProgressBar: false,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else if (saveError) {
                toast.update(saveToastIdRef.current, {
                    render: saveError,
                    type: "error",
                    isLoading: false,
                    autoClose: 5000,
                    closeButton: true,
                    hideProgressBar: false,
                    pauseOnHover: true,
                    draggable: true,
                });
            }

            saveToastIdRef.current = null;
        }
    }, [isSaving, saveFinished, saveError]);

    useEffect(() => {
        if (versionsFinished) {
            if (loadedVersions) {
                setVersions(loadedVersions);
            }
        }

        if (versionsError) {
            console.error(`Hiba a verziók betöltésekor: ${versionsError}`);
        }
    }, [versionsFinished, loadedVersions, versionsError]);

    const handleLoadVersion = (version) => {
        setNoteText(version.text);
        setNoteTitle(version.title);
        toast.info("Korábbi verzió betöltve.");
    };

    const handleDeleteNote = async (e, index) => {
        e.stopPropagation();
        const noteToDelete = notes[index];
        console.log("Törlésre kiválasztott jegyzet:", noteToDelete);
        console.log("Törlésre kiválasztott jegyzet azonosítója (notesId):", noteToDelete?.notesId);
        console.log("Index:", index);

        if (noteToDelete && noteToDelete.notesId) {
            setDeletingNoteId(noteToDelete.notesId);
            await deleteNote(noteToDelete.notesId);
        } else {
            toast.error("Nem lehetett törölni a jegyzetet: Hiányzó azonosító.");
        }
    };

    useEffect(() => {
        if (isDeleting && !deleteToastIdRef.current) {
            deleteToastIdRef.current = toast.loading("Jegyzet törlése...");
        } else if (!isDeleting && deleteToastIdRef.current) {
            if (deleteError) {
                toast.update(deleteToastIdRef.current, {
                    render: deleteError,
                    type: "error",
                    isLoading: false,
                    closeButton: true,
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    pauseOnFocusLoss: true,
                });
            } else if (deleteFinished) {
                toast.update(deleteToastIdRef.current, {
                    render: "Jegyzet sikeresen törölve!",
                    type: "success",
                    isLoading: false,
                    closeButton: true,
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    pauseOnFocusLoss: true,
                });
                refreshNoteHistory();

                const currentlySelectedNoteId = selectedNote !== null ? notes[selectedNote]?.notesId : null;
                if (deletingNoteId !== null && currentlySelectedNoteId === deletingNoteId) {
                    setSelectedNote(null);
                    setNoteText("");
                    setNoteTitle("");
                    setVersions([]);
                }
                setDeletingNoteId(null);
            }
            deleteToastIdRef.current = null;
        }
    }, [isDeleting, deleteFinished, deleteError, refreshNoteHistory, selectedNote, notes, deletingNoteId]);

    return (
        <Container fluid className="vh-100 py-3">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <Row className="h-100">
                <Col xs={12} md={3} className="border-end mb-3 mb-md-0 d-flex flex-column order-1 order-md-1">
                    <div className="d-flex align-items-center mb-3">
                        <FaUserCircle size={80} className="text-primary me-2" />
                        <div>
                            {data && (
                                <>
                                    <h3 className="fw-bold mb-0 ">{data.username}</h3>
                                    <small className="text-muted">Regisztráció: {data.reg_date ? new Date(data.reg_date).toLocaleDateString() : 'N/a'}</small>
                                    <div className="mt-2">
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={handleLogout}
                                        >
                                            Kijelentkezés
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <hr className="my-3" />
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">Jegyzetek ({notes.length})</h6>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setNotesOpen(!notesOpen)}
                            aria-controls="notes-collapse-text"
                            aria-expanded={notesOpen}
                        >
                            {notesOpen ? '-' : '+'}
                        </Button>
                    </div>

                    <Collapse in={notesOpen}>
                        <div id="notes-collapse-text"
                            className="list-group flex-grow-1"
                            style={{ maxHeight: notesOpen ? 'calc(100vh - 250px)' : '0', overflowY: 'auto' }}
                        >
                            {isLoading ? (
                                <p className="text-muted">Jegyzetek betöltése...</p>
                            ) : error ? (
                                <p className="text-danger">Hiba történt a jegyzetek betöltésekor: {error}</p>
                            ) : notes && notes.length > 0 ? (
                                notes.map((note, index) => (
                                    <li
                                        key={note.notesId || index}
                                        className={`list-group-item d-flex justify-content-between align-items-start ${selectedNote === index ? 'active' : ''}`}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            setSelectedNote(index);
                                            setNoteText(note.text);
                                            setNoteTitle(note.title);
                                        }}
                                    >
                                        <div>
                                            <div className="fw-bold text-truncate" style={{ maxWidth: '180px' }}>{note.title}</div>
                                            <small className="text-muted text-truncate" style={{ maxWidth: '180px', display: 'block' }}>{note.text?.substring(0, 30)}{note.text && note.text.length > 30 ? '...' : ''}</small>
                                            <small className="text-muted d-block">{note.date ? new Date(note.date).toLocaleString() : 'N/a'}</small>
                                        </div>
                                        <span
                                            className="btn btn-sm btn-outline-danger rounded-pill"
                                            onClick={(e) => handleDeleteNote(e, index)}
                                            title="Törlés"
                                            disabled={isDeleting}
                                        >
                                            🗑️
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-muted">Nincsenek jegyzetek. Hozz létre egy újat!</p>
                            )}
                        </div>
                    </Collapse>

                    <Button variant="success" onClick={() => setShowModal(true)} className="w-100 mt-auto">
                        + Új jegyzet
                    </Button>
                </Col>

                <Col xs={12} md={6} className="border-end border-start mb-3 mb-md-0 d-flex flex-column order-3 order-md-2">
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
                                placeholder="Írd ide a jegyzet tartalmát..."
                            />
                            <Button variant="primary" onClick={handleSaveNote} className="mt-auto">
                                Mentés
                            </Button>
                        </>
                    ) : (
                        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
                            <p className="text-center">Válassz ki egy jegyzetet a szerkesztéshez, vagy hozz létre egy újat!</p>
                        </div>
                    )}
                </Col>

                <Col xs={12} md={3} className="d-flex flex-column order-2 order-md-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">Verziók ({versions.length})</h6>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setVersionsOpen(!versionsOpen)}
                            aria-controls="versions-collapse-text"
                            aria-expanded={versionsOpen}
                        >
                            {versionsOpen ? '-' : '+'}
                        </Button>
                    </div>

                    <Collapse in={versionsOpen}>
                        <div id="versions-collapse-text">
                            <div
                                className="d-flex flex-column gap-2 flex-grow-1"
                                style={{
                                    overflowY: 'auto',
                                    maxHeight: window.innerWidth >= 768
                                        ? '700px'
                                        : versionsOpen ? '100px' : '0',
                                    paddingBottom: '1rem',
                                }}
                            >
                                {selectedNote !== null ? (
                                    versions.length > 0 ? (
                                        [...versions].map((v, i) => (
                                            <Card
                                                key={i}
                                                className="border-secondary"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleLoadVersion(v)}
                                            >
                                                <Card.Body className="p-2">
                                                    <Card.Title className="mb-1 text-truncate">{v.title}</Card.Title>
                                                    <Card.Text>
                                                        <small className="text-muted text-truncate" style={{ maxWidth: '180px', display: 'block' }}>
                                                            {v.text?.substring(0, 30)}{v.text && v.text.length > 30 ? '...' : ''}
                                                        </small>
                                                        <small className="text-muted">{v.date}</small>
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        ))
                                    ) : (
                                        <p className="text-muted">Nincsenek korábbi verziók ehhez a jegyzethez.</p>
                                    )
                                ) : (
                                    <p className="text-muted">Válassz ki egy jegyzetet a verziók megtekintéséhez.</p>
                                )}
                            </div>
                        </div>
                    </Collapse>
                </Col>

            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Új jegyzet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Jegyzet címe</Form.Label>
                            <Form.Control
                                type="text"
                                value={newNoteTitle}
                                onChange={(e) => setNewNoteTitle(e.target.value)}
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Jegyzet tartalma</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Mégse
                    </Button>
                    <Button
                        ref={createButton}
                        variant="primary"
                        disabled={isCreating}
                        onClick={handleCreateNote}
                    >
                        {isCreating ? "Létrehozás..." : "Létrehozás"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Notes;