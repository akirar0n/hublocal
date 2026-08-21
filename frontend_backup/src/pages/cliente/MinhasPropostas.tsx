import { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Modal, Form, Button } from 'react-bootstrap';
import { api } from '../../services/api';

export const MinhasPropostas = () => {
  const [propostas, setPropostas] = useState<any[]>([]);
  const [showAvaliacao, setShowAvaliacao] = useState(false);
  const [propostaAvaliada, setPropostaAvaliada] = useState<any>(null);
  const [estrelas, setEstrelas] = useState(5);
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    carregarPropostas();
  }, []);

  const carregarPropostas = async () => {
    const res = await api.get('/propostas');
    setPropostas(res.data.data);
  };

  const getStatusColor = (status: string) => {
    const map: any = {
      PENDENTE: 'warning', ACEITA: 'info', RECUSADA: 'danger',
      EM_ANDAMENTO: 'primary', CONCLUIDA: 'success', CANCELADA: 'secondary'
    };
    return map[status] || 'dark';
  };

  const cancelar = async (id: number) => {
    if (confirm('Deseja realmente cancelar?')) {
      await api.patch(`/propostas/${id}/cancelar`);
      carregarPropostas();
    }
  };

  const abrirAvaliacao = (p: any) => {
    setPropostaAvaliada(p);
    setShowAvaliacao(true);
  };

  const salvarAvaliacao = async () => {
    try {
      await api.post('/avaliacoes', {
        proposta_id: propostaAvaliada.id,
        estrelas,
        comentario
      });
      alert('Avaliação registrada com sucesso!');
      setShowAvaliacao(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Minhas Solicitações (Cliente)</h2>
      <Row>
        {propostas.map(p => (
          <Col md={6} key={p.id} className="mb-4">
            <Card className="shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <strong>{p.servico.titulo}</strong>
                <Badge bg={getStatusColor(p.status)}>{p.status}</Badge>
              </Card.Header>
              <Card.Body>
                <p className="mb-1"><strong>Profissional:</strong> {p.trabalhador?.nome || 'N/A'}</p>
                <p className="mb-1"><strong>Tipo:</strong> {p.tipo_proposta}</p>
                <p className="mb-1"><strong>Valor Oferecido:</strong> R$ {p.valor_oferecido}</p>
                {p.descricao_permuta && <p className="mb-1"><strong>Permuta:</strong> {p.descricao_permuta}</p>}
                
                {/* Ocultando contato baseado na regra do backend, mas garantindo UI segura */}
                {p.trabalhador?.telefone && (
                  <p className="text-success fw-bold">📞 Contato: {p.trabalhador.telefone}</p>
                )}

                <div className="mt-3 d-flex gap-2">
                  {(p.status === 'PENDENTE' || p.status === 'ACEITA' || p.status === 'EM_ANDAMENTO') && (
                    <Button variant="outline-danger" size="sm" onClick={() => cancelar(p.id)}>Cancelar</Button>
                  )}
                  {p.status === 'CONCLUIDA' && (
                    <Button variant="success" size="sm" onClick={() => abrirAvaliacao(p)}>⭐ Avaliar Serviço</Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showAvaliacao} onHide={() => setShowAvaliacao(false)}>
        <Modal.Header closeButton><Modal.Title>Avaliar Profissional</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Estrelas (1 a 5)</Form.Label>
            <Form.Select value={estrelas} onChange={e => setEstrelas(Number(e.target.value))}>
              <option value="1">1 ⭐</option>
              <option value="2">2 ⭐⭐</option>
              <option value="3">3 ⭐⭐⭐</option>
              <option value="4">4 ⭐⭐⭐⭐</option>
              <option value="5">5 ⭐⭐⭐⭐⭐</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Deixe um comentário</Form.Label>
            <Form.Control as="textarea" rows={3} value={comentario} onChange={e => setComentario(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={salvarAvaliacao}>Salvar Avaliação</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
