import { ReactNode } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow">
        <Container>
          <Navbar.Brand as={Link} to="/">HubLocal</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {!user && <Nav.Link as={Link} to="/">Início</Nav.Link>}
              
              {user?.tipo === 'CLIENTE' && (
                <>
                  <Nav.Link as={Link} to="/cliente/busca">Buscar Serviços</Nav.Link>
                  <Nav.Link as={Link} to="/cliente/propostas">Minhas Propostas</Nav.Link>
                </>
              )}

              {user?.tipo === 'TRABALHADOR' && (
                <>
                  <Nav.Link as={Link} to="/trabalhador/servicos">Meus Serviços</Nav.Link>
                  <Nav.Link as={Link} to="/trabalhador/propostas">Propostas Recebidas</Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              {user ? (
                <div className="d-flex align-items-center gap-3">
                  <span className="text-light">Olá, {user.nome}</span>
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>Sair</Button>
                </div>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Entrar</Nav.Link>
                  <Nav.Link as={Link} to="/cadastro" className="text-warning fw-bold">Cadastrar</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <Container className="flex-grow-1 mb-5">
        {children}
      </Container>
      
      <footer className="bg-dark text-light text-center py-3 mt-auto">
        <Container>
          <small>&copy; {new Date().getFullYear()} HubLocal. Todos os direitos reservados.</small>
        </Container>
      </footer>
    </div>
  );
};
