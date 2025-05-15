import styles from "./modules/error.module.css";
import {Button, Container, Row, Col} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Error() {
const navigate = useNavigate();
  return (
    <div className="text-center mt-5" style={{ padding: "40px" }}>
      <section className={styles.page_404}>
        <Container>
          <Row>
            <Col sm={12}>
              <Col sm={10} className="offset-sm-1 text-center">
                <div className={styles.four_zero_four_bg}>
                  <h1 className={styles.heading}>404</h1>
                </div>
                <div className={styles.contant_box_404}>
                  <h3 className={styles.subheading}>Elkóboroltál?</h3>
                  <p>Ez az oldal sajnos nem létezik – de ne aggódj, visszatalálunk!</p>
                  <Button variant="success"
                  onClick={() => navigate("/jegyzetek")}
                >
                  Vissza
                </Button>
                </div>
              </Col>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Error;
