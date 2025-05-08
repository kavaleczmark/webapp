import { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from './hooks/useLogin';
import { ToastContainer, toast, Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {login, error, isLoading, isFinished}= useLogin();
  const navigate = useNavigate();
  const loginButton = useRef(null);
  const toastId = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toastId.current = toast.loading("Kérem várjon!");
    await login(username, password);
  };

  useEffect(()=>{
    if(error) {
            toast.update(toastId.current, {
                render: `${error}`,
                type: "error",
                isLoading: false,
                closeButton: true,
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                pauseOnFocusLoss: true
            });
            return;   
    }
        if(!error && isFinished) {
            toast.update(toastId.current, {
                render: "Sikeres bejelentkezés",
                type: "success",
                isLoading: false,
                closeButton: true,
                autoClose:500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                pauseOnFocusLoss: true,
                onClose : () => {navigate("/jegyzetek")}
            });
        }
    }, [isFinished, error]);

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
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
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow p-4">
            <h3 className="text-center mb-4">Bejelentkezés</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>Felhasználónév</Form.Label>
                <Form.Control
                  name="username"
                  type="text"
                  placeholder="Felhasználónév"
                  value={username}
                  required onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Jelszó</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Jelszó"
                    value={password}
                    required onChange={(e) => setPassword(e.target.value)}
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

              <Button ref={loginButton} disabled={isLoading} type="submit" className="w-100 mt-3 mb-2" variant="primary">
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
