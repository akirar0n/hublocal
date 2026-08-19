import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Badge, Modal } from 'react-bootstrap';
import { api } from '../../services/api';
import { ServiceMap } from '../../components/ServiceMap';

export const BuscaServicos = () => {
  const [servicos, setServicos] = useState<any[]>([]);
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

  useEffect(() => {
    // Tenta pegar geolocalizacao ao montar
    navigator.geolocation.getCurrentPosition((pos) => {
      setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      carregarServicos(pos.coords.latitude, pos.coords.longitude);
    }, () => {
      carregarServicos(); // Carrega sem filtro de distância
    });
  }, []);

  const carregarServicos = async (lat?: number, lng?: number) => {
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
    }
  };

  return (
    <div>
      <h2 className="mb-4">Buscar Serviços</h2>
      <Form onSubmit={handleFiltrar} className="mb-4 bg-light p-3 rounded">
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Categoria</Form.Label>
              <Form.Control value={filtros.categoria} onChange={e => setFiltros({...filtros, categoria: e.target.value})} placeholder="Ex: Eletricista" />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Raio (km)</Form.Label>
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
              <Form.Control type="number" value={filtros.precoMin} onChange={e => setFiltros({...filtros, precoMin: e.target.value})} />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Preço Máx</Form.Label>
              <Form.Control type="number" value={filtros.precoMax} onChange={e => setFiltros({...filtros, precoMax: e.target.value})} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Button type="submit" variant="primary" className="w-100">Aplicar Filtros</Button>
          </Col>
        </Row>
      </Form>

      {myLocation && (
        <div className="mb-4 shadow-sm">
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

      <Row>
        {servicos.map(s => (
          <Col md={4} key={s.id} className="mb-4">
            <Card className="h-100 shadow-sm border-0 bg-white">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <img src={s.trabalhador.foto_url || `https://ui-avatars.com/api/?name=${s.trabalhador.nome}`} alt={s.trabalhador.nome} className="rounded-circle me-3" width={50} height={50} />
                  <div>
                    <h5 className="mb-0">{s.trabalhador.nome}</h5>
                    <small className="text-muted">{s.categoria}</small>
                  </div>
                </div>
                <h6>{s.titulo}</h6>
                <p className="text-muted small">{s.descricao}</p>
                <div className="d-flex justify-content-between mb-3">
                  <Badge bg="success">R$ {Number(s.orcamentoBase).toFixed(2)}</Badge>
                  {s.distanciaKm !== null && (
                    <Badge bg="info">📍 {s.distanciaKm.toFixed(1)} km</Badge>
                  )}
                </div>
                {s.aceita_permuta && <Badge bg="warning" text="dark" className="mb-3 d-block">🔄 Aceita permuta</Badge>}
                <Button variant="primary" className="w-100" onClick={() => abrirProposta(s)}>Solicitar Serviço</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {servicos.length === 0 && <p className="text-center w-100 text-muted">Nenhum serviço encontrado na sua região.</p>}
      </Row>

      {/* Modal de Proposta */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enviar Proposta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {servicoSelecionado && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Proposta</Form.Label>
                <div>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={enviarProposta}>Enviar Solicitação</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
