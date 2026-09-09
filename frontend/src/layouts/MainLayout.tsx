import type { ReactNode } from 'react';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const BrandMark = () => (
  <span className="d-inline-flex align-items-center gap-2">
    <span
      className="d-inline-flex align-items-center justify-content-center"
      style={{
        width: 32,
        height: 32,
        borderRadius: 9,
        background: 'linear-gradient(155deg, var(--hl-marigold-500), var(--hl-marigold-600))',
      }}
    >
      <i className="bi bi-geo-alt-fill" style={{ color: 'var(--hl-pine-900)', fontSize: '1.05rem' }} />
    </span>
    <span
      style={{
        fontFamily: 'var(--hl-font-display)',
        fontWeight: 600,
        fontSize: '1.35rem',
        color: '#fff',
        letterSpacing: '-0.01em',
      }}
    >
      HubLocal
    </span>
  </span>
);

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        expand="lg"
        className="mb-4 py-3"
        style={{ background: 'var(--hl-pine-800)' }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="me-4">
            <BrandMark />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto gap-1">
              {!user && (
                <Nav.Link as={Link} to="/" className="hl-nav-link">
                  Início
                </Nav.Link>
              )}

              {user?.tipo === 'CLIENTE' && (
                <>
                  <Nav.Link as={Link} to="/cliente/busca" className="hl-nav-link">
                    <i className="bi bi-search me-1" /> Buscar Serviços
                  </Nav.Link>
                  <Nav.Link as={Link} to="/cliente/propostas" className="hl-nav-link">
                    <i className="bi bi-clipboard-check me-1" /> Minhas Propostas
                  </Nav.Link>
                </>
              )}

              {user?.tipo === 'TRABALHADOR' && (
                <>
                  <Nav.Link as={Link} to="/trabalhador/servicos" className="hl-nav-link">
                    <i className="bi bi-briefcase me-1" /> Meus Serviços
                  </Nav.Link>
                  <Nav.Link as={Link} to="/trabalhador/propostas" className="hl-nav-link">
                    <i className="bi bi-inbox me-1" /> Propostas Recebidas
                  </Nav.Link>
                </>
              )}
            </Nav>
            <Nav className="align-items-lg-center">
              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="button"
                    className="hl-user-toggle border-0 bg-transparent d-flex align-items-center gap-2 py-1 px-2"
                  >
                    <img
                      src={user.foto_url || `https://ui-avatars.com/api/?background=E8A33D&color=123832&bold=true&name=${encodeURIComponent(user.nome)}`}
                      alt=""
                      className="hl-avatar"
                      width={32}
                      height={32}
                    />
                    <span className="text-white d-none d-lg-inline">{user.nome.split(' ')[0]}</span>
                  </Dropdown.Toggle>
                    <Dropdown.Menu className="shadow border-0" style={{ borderRadius: 12, minWidth: 200 }}>
                      <div className="px-3 py-2">
                        <div className="fw-semibold" style={{ color: 'var(--hl-pine-900)' }}>{user.nome}</div>
                        <div className="small text-muted text-truncate">{user.email}</div>
                      </div>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to="/perfil">
                        <i className="bi bi-person-circle me-2" /> Meu Perfil
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleLogout} className="text-danger">
                        <i className="bi bi-box-arrow-right me-2" /> Sair
                      </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
                  <Nav.Link as={Link} to="/login" className="hl-nav-link">
                    Entrar
                  </Nav.Link>
                  <Button as={Link as any} to="/cadastro" variant="warning" size="sm" className="px-3">
                    Cadastrar
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 mb-5">{children}</Container>

      <footer style={{ background: 'var(--hl-pine-900)' }} className="text-center py-4 mt-auto">
        <Container>
          <div className="d-flex justify-content-center align-items-center gap-2 mb-1">
            <i className="bi bi-geo-alt-fill" style={{ color: 'var(--hl-marigold-500)' }} />
            <span className="text-white fw-semibold" style={{ fontFamily: 'var(--hl-font-display)' }}>
              HubLocal
            </span>
          </div>
          <small style={{ color: 'rgba(255,255,255,0.55)' }}>
            &copy; {new Date().getFullYear()} HubLocal. Conectando pessoas ao redor do seu bairro.
          </small>
        </Container>
      </footer>

      <style>{`
        .hl-nav-link {
          color: rgba(255,255,255,0.82) !important;
          font-weight: 500;
          font-size: 0.94rem;
          padding: 0.5rem 0.85rem !important;
          border-radius: 8px;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .hl-nav-link:hover, .hl-nav-link:focus-visible {
          color: #fff !important;
          background: rgba(255,255,255,0.08);
        }
        .hl-user-toggle::after { display: none; }
        .hl-user-toggle:hover { opacity: 0.85; }
        .navbar-toggler:focus { box-shadow: 0 0 0 0.2rem rgba(232,163,61,0.4); }
      `}</style>
    </div>
  );
};
