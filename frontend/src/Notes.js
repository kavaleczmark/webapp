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
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [noteText, setNoteText] = useState("");
    const [noteTitle, setNoteTitle] = useState("");
    const [versions, setVersions] = useState([]);
    const [notesOpen, setNotesOpen] = useState(true);
    const [versionsOpen, setVersionsOpen] = useState(true);
    const [deletingNoteId, setDeletingNoteId] = useState(null);
    const deleteToastIdRef = useRef(null);
    const previouslySelectedNoteIdRef = useRef(null);
    const { logout } = useLogout();
    const navigate = useNavigate();
    const { data } = useGetUserData();
    const { noteHistory, isLoading, isFinished, error, refreshNoteHistory } = useGetLatestNotesForUser();
    const { createNote, isLoading: isCreating, isFinished: createFinished, error: createError } = useCreateNote();
    const createToastIdRef = useRef(null);
    const createButton = useRef(null);
    const { deleteNote, isLoading: isDeleting, isFinished: deleteFinished, error: deleteError } = useDeleteNote();
    const { saveNoteVersion, isSaving, isFinished: saveFinished, error: saveError } = useSaveNoteVersion();
    const saveToastIdRef = useRef(null);
    const { versions: loadedVersions, isFinished: versionsFinished, error: versionsError, getVersions } = useGetNoteVersions(
        selectedNote !== null ? notes[selectedNote]?.notesId : null
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
            transformed.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
                if (isNaN(dateA.getTime())) return 1;
                if (isNaN(dateB.getTime())) return -1;
                return dateB.getTime() - dateA.getTime();
            });
            setNotes(transformed);
            const prevSelectedId = previouslySelectedNoteIdRef.current;
            console.log(prevSelectedId);
            if (prevSelectedId !== null) {
                const newSelectedNoteIndex = transformed.findIndex(note => note.notesId === prevSelectedId);
                console.log(newSelectedNoteIndex)
                console.log(selectedNote);
                if (newSelectedNoteIndex !== -1 && newSelectedNoteIndex !== selectedNote) {
                    setSelectedNote(0);
                    setNoteTitle(transformed[0].title);
                    setNoteText(transformed[0].text);
                    setSelectedVersion(0);
                } else if (newSelectedNoteIndex === -1 && selectedNote !== null) {
                    setVersions([]);
                    previouslySelectedNoteIdRef.current = null;
                }
            }
            else {
                setNoteTitle(transformed[0].title)
            }

        } else if (isFinished && noteHistory.length === 0) {
            setNotes([]);
            setSelectedNote(null);
            setNoteText("");

            setVersions([]);
            previouslySelectedNoteIdRef.current = null;
        }
    }, [isFinished, noteHistory, selectedNote]);

    const handleCreateNote = async (e) => {
        e.preventDefault();
        await createNote(newNoteTitle || "Névtelen jegyzet", "");
    };

    useEffect(() => {
        if (isCreating && !createToastIdRef.current) {
            createToastIdRef.current = toast.loading("Kérem várjon...");
        } else if (!isCreating && createToastIdRef.current) {
            if (createFinished) {
                toast.update(createToastIdRef.current, {
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
                handleSelectNote(0);
                setShowModal(false);

            } else if (createError) {
                toast.update(createToastIdRef.current, {
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
            createToastIdRef.current = null;
        }
    }, [createFinished, createError, isCreating, refreshNoteHistory]);


    const handleSaveNote = async () => {
    setSelectedVersion(0);
    if (selectedNote !== null) {
        const note = notes[selectedNote];
        const { notesId } = note;
        previouslySelectedNoteIdRef.current = notesId;
        await saveNoteVersion(notesId, noteTitle, noteText);
        await getVersions();
        await refreshNoteHistory();
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
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    pauseOnFocusLoss: true,
                });
            } else if (saveError) {
                toast.update(saveToastIdRef.current, {
                    render: saveError,
                    type: "error",
                    isLoading: false,
                    autoClose: 5000,
                    closeButton: true,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    pauseOnFocusLoss: true,
                });
            }
            saveToastIdRef.current = null;
        }
    }, [isSaving, saveFinished, saveError]);
    useEffect(() => {
        if (versionsFinished) {
            if (loadedVersions) {
                const sortedVersions = [...loadedVersions].sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
                    if (isNaN(dateA.getTime())) return 1;
                    if (isNaN(dateB.getTime())) return -1;
                    return dateB.getTime() - dateA.getTime();
                });
                setVersions(sortedVersions);
            } else {
                setVersions([]);
            }
        }

        if (versionsError) {
            console.error(`Hiba a verziók betöltésekor: ${versionsError}`);
            setVersions([]);
        }
    }, [versionsFinished, loadedVersions, versionsError]);


    const handleLoadVersion = (version) => {
        setNoteText(version.text);
        setNoteTitle(version.title);
        toast.info("Korábbi verzió betöltve.");
    };

    const handleSelectNote = (index) => {
        setSelectedNote(index);
        setSelectedVersion(0);
        if (notes[index]) {
            previouslySelectedNoteIdRef.current = notes[index].notesId;
            setNoteText(notes[index].text);
            setNoteTitle(notes[index].title);
        } else {
            previouslySelectedNoteIdRef.current = null;
            setNoteText("");
            setNoteTitle("");
            setVersions([]);
        }
    };

    const handleDeleteNote = async (e, index) => {
        e.stopPropagation();
        const noteToDelete = notes[index];
        if (noteToDelete && noteToDelete.notesId) {
            setDeletingNoteId(noteToDelete.notesId);
            previouslySelectedNoteIdRef.current = noteToDelete.notesId;
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
                setDeletingNoteId(null);
                previouslySelectedNoteIdRef.current = null;
            }

            deleteToastIdRef.current = null;
        }
    }, [isDeleting, deleteFinished, deleteError, refreshNoteHistory]);


    return (
        <Container fluid className="vh-100 py-3">
            <ToastContainer
                position="top-center"
                autoClose={2000}
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
                                        onClick={() => handleSelectNote(index)}
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
                            )
                            }
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
                            <Button variant="primary" onClick={handleSaveNote} className="mt-auto" disabled={isSaving}>
                                {isSaving ? 'Mentés...' : 'Mentés'}
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
                            {selectedNote !== null && !versionsFinished && !versionsError && (
                                <p className="text-muted">Verziók betöltése...</p>
                            )}
                            {selectedNote !== null && versionsError && (
                                <p className="text-danger">Hiba történt a verziók betöltésekor.</p>
                            )}
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
                                {selectedNote !== null && versionsFinished && !versionsError && (
                                    versions.length > 0 ? (
                                        versions.map((v, i) => (
                                            <Card
                                                key={v.version_id || i}
                                                className={`border border-secondary ${selectedVersion === i ? 'bg-primary text-white' : ''}`}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    handleLoadVersion(v);
                                                    setSelectedVersion(i);
                                                }}
                                            >
                                                <Card.Body className="p-2">
                                                    <Card.Title className="mb-1 text-truncate">{v.title}</Card.Title>
                                                    <Card.Text>
                                                        <small className="text-muted text-truncate" style={{ maxWidth: '180px', display: 'block' }}>
                                                            {v.text?.substring(0, 30)}{v.text && v.text.length > 30 ? '...' : ''}
                                                        </small>
                                                        <small className="text-muted">{v.date ? new Date(v.date).toLocaleString() : 'N/a'}</small>
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        ))
                                    ) : (
                                        <p className="text-muted">Nincsenek korábbi verziók ehhez a jegyzethez.</p>
                                    )
                                )}
                                {selectedNote === null && (
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