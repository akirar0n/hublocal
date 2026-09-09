import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { api } from '../../services/api';
import { ServiceMap } from '../../components/ServiceMap';
import { AvaliacoesModal } from '../../components/AvaliacoesModal';

export const BuscaServicos = () => {
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    categoria: '',
    raio: '10',
    precoMin: '',
    precoMax: ''
  });
  const [myLocation, setMyLocation] = useState<{lat: number, lng: number} | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);
  const [proposta, setProposta] = useState({ tipo: 'PADRAO', valor: '', permuta: '' });
  const [enviando, setEnviando] = useState(false);

  const [showAvaliacoesModal, setShowAvaliacoesModal] = useState(false);
  const [trabalhadorAvaliacaoId, setTrabalhadorAvaliacaoId] = useState<number | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      carregarServicos(pos.coords.latitude, pos.coords.longitude);
    }, () => {
      carregarServicos();
    });
  }, []);

  const carregarServicos = async (lat?: number, lng?: number) => {
    setLoading(true);
    try {
      const params: any = { ...filtros };
      if (lat && lng) {
        params.latitude = lat;
        params.longitude = lng;
      } else if (myLocation) {
        params.latitude = myLocation.lat;
        params.longitude = myLocation.lng;
      }

      const res = await api.get('/servicos', { params });
      setServicos(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrar = (e: React.FormEvent) => {
    e.preventDefault();
    carregarServicos();
  };

  const abrirProposta = (servico: any) => {
    setServicoSelecionado(servico);
    setProposta({ tipo: 'PADRAO', valor: servico.orcamentoBase, permuta: '' });
    setShowModal(true);
  };

  const enviarProposta = async () => {
    setEnviando(true);
    try {
      await api.post('/propostas', {
        servico_id: servicoSelecionado.id,
        tipo_proposta: proposta.tipo,
        valor_oferecido: proposta.valor ? Number(proposta.valor) : undefined,
        descricao_permuta: proposta.permuta
      });
      alert('Proposta enviada com sucesso!');
      setShowModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao enviar');
    } finally {
      setEnviando(false);
    }
  };

  const abrirAvaliacoes = (trabalhadorId: number) => {
    setTrabalhadorAvaliacaoId(trabalhadorId);
    setShowAvaliacoesModal(true);
  };

  return (
    <div className="hl-fade-in">
      <div className="hl-section-title">
        <div>
          <h2>Buscar Serviços</h2>
          <p>Profissionais disponíveis perto de você, ordenados por distância.</p>
        </div>
      </div>

      <Form
        onSubmit={handleFiltrar}
        className="mb-4 p-3 p-md-4"
        style={{ background: 'var(--hl-surface)', borderRadius: 'var(--hl-radius)', border: '1px solid var(--hl-border-soft)' }}
      >
        <Row className="align-items-end g-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label><i className="bi bi-tag me-1" />Categoria</Form.Label>
              <Form.Control value={filtros.categoria} onChange={e => setFiltros({...filtros, categoria: e.target.value})} placeholder="Ex: Eletricista" />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label><i className="bi bi-geo-alt me-1" />Raio</Form.Label>
              <Form.Select value={filtros.raio} onChange={e => setFiltros({...filtros, raio: e.target.value})}>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Preço Mín</Form.Label>
              <Form.Control type="number" value={filtros.precoMin} onChange={e => setFiltros({...filtros, precoMin: e.target.value})} placeholder="R$" />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Preço Máx</Form.Label>
              <Form.Control type="number" value={filtros.precoMax} onChange={e => setFiltros({...filtros, precoMax: e.target.value})} placeholder="R$" />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Button type="submit" variant="primary" className="w-100">
              <i className="bi bi-search me-1" /> Aplicar Filtros
            </Button>
          </Col>
        </Row>
      </Form>

      {myLocation && (
        <div className="mb-4" style={{ borderRadius: 'var(--hl-radius)', overflow: 'hidden', border: '1px solid var(--hl-border-soft)' }}>
          <ServiceMap
            center={[myLocation.lat, myLocation.lng]}
            markers={servicos.filter(s => s.trabalhador.localizacao).map(s => ({
              id: s.id,
              lat: s.trabalhador.localizacao.latitude,
              lng: s.trabalhador.localizacao.longitude,
              title: s.titulo,
              description: s.trabalhador.nome
            }))}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-arrow-repeat" style={{ fontSize: '1.5rem' }} /> Carregando serviços...
        </div>
      ) : (
        <Row>
          {servicos.map(s => (
            <Col md={4} key={s.id} className="mb-4">
              <Card className="h-100 hl-card-hover border-0">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <img src={s.trabalhador.foto_url || `https://ui-avatars.com/api/?background=1B4B43&color=fff&name=${encodeURIComponent(s.trabalhador.nome)}`} alt={s.trabalhador.nome} className="hl-avatar me-3" width={48} height={48} />
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-0">
                        <h5 className="mb-0" style={{ fontSize: '1.02rem' }}>{s.trabalhador.nome}</h5>
                        <Button variant="link" size="sm" className="p-0 text-decoration-none d-flex align-items-center gap-1" onClick={() => abrirAvaliacoes(s.trabalhador.id)}>
                          <i className="bi bi-star-fill text-warning"></i>
                          <span className="small text-muted">Avaliações</span>
                        </Button>
                      </div>
                      <small className="text-muted">{s.categoria}</small>
                    </div>
                  </div>
                  <h6 className="mb-1" style={{ color: 'var(--hl-pine-900)' }}>{s.titulo}</h6>
                  <p className="text-muted small mb-3">{s.descricao}</p>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="hl-pill hl-pill--success">R$ {Number(s.orcamentoBase).toFixed(2)}</span>
                    {s.distanciaKm !== null && (
                      <span className="hl-pill hl-pill--info"><i className="bi bi-geo-alt-fill" style={{ fontSize: '0.7rem' }} />{s.distanciaKm.toFixed(1)} km</span>
                    )}
                    {s.aceita_permuta && (
                      <span className="hl-pill hl-pill--warning">Aceita permuta</span>
                    )}
                  </div>

                  <Button variant="primary" className="w-100 mt-auto" onClick={() => abrirProposta(s)}>
                    Solicitar Serviço
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
          {servicos.length === 0 && (
            <Col xs={12}>
              <div className="hl-empty-state">
                <i className="bi bi-signpost-split d-block" />
                <h5 className="mb-1">Nenhum serviço encontrado</h5>
                <p className="mb-0 small">Tente aumentar o raio de busca ou remover alguns filtros.</p>
              </div>
            </Col>
          )}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="hl-modal">
        <Modal.Header closeButton>
          <Modal.Title>Enviar Proposta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {servicoSelecionado && (
            <Form>
              <p className="small text-muted mb-3">
                Para <strong style={{ color: 'var(--hl-pine-900)' }}>{servicoSelecionado.trabalhador.nome}</strong> — {servicoSelecionado.titulo}
              </p>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Proposta</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check inline type="radio" label="Orçamento Padrão" checked={proposta.tipo === 'PADRAO'} onChange={() => setProposta({...proposta, tipo: 'PADRAO'})} />
                  <Form.Check inline type="radio" label="Permuta" disabled={!servicoSelecionado.aceita_permuta} checked={proposta.tipo === 'PERMUTA'} onChange={() => setProposta({...proposta, tipo: 'PERMUTA'})} />
                </div>
              </Form.Group>

              {proposta.tipo === 'PADRAO' ? (
                <Form.Group>
                  <Form.Label>Valor Oferecido (R$)</Form.Label>
                  <Form.Control type="number" value={proposta.valor} onChange={e => setProposta({...proposta, valor: e.target.value})} />
                </Form.Group>
              ) : (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>O que você oferece em troca?</Form.Label>
                    <Form.Control as="textarea" rows={3} value={proposta.permuta} onChange={e => setProposta({...proposta, permuta: e.target.value})} placeholder="Descreva seu serviço/produto..." />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Volta em Dinheiro (opcional)</Form.Label>
                    <Form.Control type="number" value={proposta.valor} onChange={e => setProposta({...proposta, valor: e.target.value})} />
                  </Form.Group>
                </>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={enviarProposta} disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar Solicitação'}
          </Button>
        </Modal.Footer>
      </Modal>

      <AvaliacoesModal
        show={showAvaliacoesModal}
        onHide={() => setShowAvaliacoesModal(false)}
        trabalhadorId={trabalhadorAvaliacaoId}
      />
    </div>
  );
};
