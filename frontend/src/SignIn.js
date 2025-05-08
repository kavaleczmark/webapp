import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Minden mező kitöltése kötelező!');
      return;
    }
    setError('');
    console.log('Bejelentkezés:', { username, password });
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow p-4">
            <h3 className="text-center mb-4">Bejelentkezés</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>Felhasználónév</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Felhasználónév"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Jelszó</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ms-2"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </Form.Group>

              <Button type="submit" className="w-100 mt-3 mb-2" variant="primary">
                Bejelentkezés
              </Button>
            </Form>

            <div className="text-center mt-3">
              <span>Nincs fiókod? </span>
              <Link to="/regisztracio">Regisztrálj itt</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SignIn;
