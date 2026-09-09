import { Button, Row, Col } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const pillars = [
  {
    icon: 'bi-search',
    title: 'Encontre',
    text: 'Veja profissionais no mapa, filtrados por categoria, distância e faixa de preço.',
  },
  {
    icon: 'bi-chat-square-text',
    title: 'Combine',
    text: 'Envie uma proposta em dinheiro ou negocie uma permuta direto com quem presta o serviço.',
  },
  {
    icon: 'bi-hand-thumbs-up',
    title: 'Contrate',
    text: 'Acompanhe o andamento e avalie o profissional quando o serviço for concluído.',
  },
];

const HeroGraphic = () => (
  <svg viewBox="0 0 420 380" width="100%" height="auto" role="img" aria-labelledby="heroGraphicTitle">
    <title id="heroGraphicTitle">Ilustração de uma rede de pontos de serviço em um mapa de bairro</title>
    <defs>
      <linearGradient id="hlPinGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f0b662" />
        <stop offset="100%" stopColor="#d98e2b" />
      </linearGradient>
    </defs>

    <circle cx="210" cy="190" r="170" fill="#ffffff" opacity="0.06" />
    <circle cx="210" cy="190" r="130" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeDasharray="3 7" />
    <circle cx="210" cy="190" r="80" fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeDasharray="3 7" />

    <path d="M 210 190 L 120 110" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" />
    <path d="M 210 190 L 320 130" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" />
    <path d="M 210 190 L 140 280" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" />
    <path d="M 210 190 L 300 270" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" />

    {[
      [120, 110],
      [320, 130],
      [140, 280],
      [300, 270],
    ].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <circle r="16" fill="#123832" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle r="5" fill="#f0b662" />
      </g>
    ))}

    <g transform="translate(210 190)">
      <circle r="34" fill="url(#hlPinGrad)" />
      <path
        d="M0 -16 C9 -16 16 -9 16 0 C16 11 0 26 0 26 C0 26 -16 11 -16 0 C-16 -9 -9 -16 0 -16 Z"
        fill="#123832"
        transform="translate(0 -3) scale(0.62)"
      />
      <circle r="4" fill="#f0b662" transform="translate(0 -13)" />
    </g>
  </svg>
);

export const Home = () => {
  const { user } = useAuth();

  if (user?.tipo === 'CLIENTE') return <Navigate to="/cliente/busca" />;
  if (user?.tipo === 'TRABALHADOR') return <Navigate to="/trabalhador/servicos" />;

  return (
    <div className="hl-fade-in">
      <div
        className="p-4 p-md-5 mb-5"
        style={{
          background: 'linear-gradient(155deg, var(--hl-pine-700), var(--hl-pine-900))',
          borderRadius: 'var(--hl-radius-lg)',
          overflow: 'hidden',
        }}
      >
        <Row className="align-items-center g-4 g-md-5 py-3">
          <Col md={7}>
            <span className="hl-eyebrow">Serviços do seu bairro</span>
            <h1 className="mt-2 mb-3" style={{ color: '#fff', fontSize: 'clamp(2.1rem, 4vw, 3.1rem)', lineHeight: 1.1 }}>
              O profissional certo está mais perto do que você imagina.
            </h1>
            <p className="mb-4" style={{ color: 'rgba(255,255,255,0.78)', fontSize: '1.1rem', maxWidth: 520 }}>
              HubLocal conecta clientes a trabalhadores autônomos e microempreendedores da região —
              por preço combinado ou por permuta, sem intermediários.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Button as={Link as any} to="/cadastro" variant="warning" size="lg">
                Criar conta grátis
              </Button>
              <Button
                as={Link as any}
                to="/login"
                variant="outline-light"
                size="lg"
                style={{ borderColor: 'rgba(255,255,255,0.5)' }}
              >
                Já tenho conta
              </Button>
            </div>
          </Col>
          <Col md={5} className="d-none d-md-block">
            <HeroGraphic />
          </Col>
        </Row>
      </div>

      <div className="hl-section-title">
        <div>
          <h2>Como funciona</h2>
          <p>Três passos entre precisar de um serviço e ter alguém do bairro cuidando dele.</p>
        </div>
      </div>
      <Row className="g-4 mb-5">
        {pillars.map((p) => (
          <Col md={4} key={p.title}>
            <div className="h-100 p-4" style={{ background: 'var(--hl-surface)', borderRadius: 'var(--hl-radius)', border: '1px solid var(--hl-border-soft)' }}>
              <div
                className="d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--hl-pine-100)' }}
              >
                <i className={`bi ${p.icon}`} style={{ fontSize: '1.3rem', color: 'var(--hl-pine-700)' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>{p.title}</h3>
              <p className="mb-0 small">{p.text}</p>
            </div>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <div className="h-100 p-4" style={{ background: 'var(--hl-pine-100)', borderRadius: 'var(--hl-radius)' }}>
            <i className="bi bi-person-workspace mb-2 d-block" style={{ fontSize: '1.5rem', color: 'var(--hl-pine-700)' }} />
            <h3 style={{ fontSize: '1.15rem' }}>Precisa de um serviço?</h3>
            <p className="small mb-3">Busque por categoria e distância, e envie propostas para quem tem disponibilidade.</p>
            <Button as={Link as any} to="/cadastro" variant="primary" size="sm">
              Cadastrar como cliente
            </Button>
          </div>
        </Col>
        <Col md={6}>
          <div className="h-100 p-4" style={{ background: 'var(--hl-marigold-100)', borderRadius: 'var(--hl-radius)' }}>
            <i className="bi bi-tools mb-2 d-block" style={{ fontSize: '1.5rem', color: 'var(--hl-marigold-600)' }} />
            <h3 style={{ fontSize: '1.15rem' }}>Presta algum serviço?</h3>
            <p className="small mb-3">Publique seu portfólio, receba propostas e negocie com clientes perto de você.</p>
            <Button as={Link as any} to="/cadastro" variant="outline-primary" size="sm">
              Cadastrar como profissional
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};
