import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Home = () => {
  const { user } = useAuth();

  if (user?.tipo === 'CLIENTE') return <Navigate to="/cliente/busca" />;
  if (user?.tipo === 'TRABALHADOR') return <Navigate to="/trabalhador/servicos" />;

  return (
    <Container className="text-center mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="display-4 fw-bold text-primary mb-4">Bem-vindo ao HubLocal</h1>
          <p className="lead text-muted mb-5">
            A plataforma que conecta clientes locais a trabalhadores autônomos e microempreendedores.
            Encontre serviços perto de você ou ofereça suas habilidades!
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/login" variant="primary" size="lg" className="px-5">
              Entrar
            </Button>
            <Button as={Link} to="/cadastro" variant="outline-primary" size="lg" className="px-5">
              Criar Conta
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
