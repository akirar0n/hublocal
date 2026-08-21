import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { api } from '../../services/api';

export const PropostasRecebidas = () => {
  const [propostas, setPropostas] = useState<any[]>([]);

  useEffect(() => {
    carregarPropostas();
  }, []);

  const carregarPropostas = async () => {
    const res = await api.get('/propostas');
    setPropostas(res.data.data);
  };

  const alterarStatus = async (id: number, acao: string) => {
    try {
      await api.patch(`/propostas/${id}/${acao}`);
      carregarPropostas();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar');
    }
  };

  const getStatusColor = (status: string) => {
    const map: any = {
      PENDENTE: 'warning', ACEITA: 'info', RECUSADA: 'danger',
      EM_ANDAMENTO: 'primary', CONCLUIDA: 'success', CANCELADA: 'secondary'
    };
    return map[status] || 'dark';
  };

  return (
    <div>
      <h2 className="mb-4">Dashboard de Propostas (Trabalhador)</h2>
      <Row>
        {propostas.map(p => (
          <Col md={6} key={p.id} className="mb-4">
            <Card className="shadow-sm border-start border-4" style={{borderLeftColor: 'var(--bs-primary)'}}>
              <Card.Header className="d-flex justify-content-between">
                <strong>Solicitante: {p.cliente?.nome}</strong>
                <Badge bg={getStatusColor(p.status)}>{p.status}</Badge>
              </Card.Header>
              <Card.Body>
                <p className="mb-1"><strong>Serviço Solicitado:</strong> {p.servico.titulo}</p>
                <p className="mb-1"><strong>Tipo de Proposta:</strong> <Badge bg={p.tipo_proposta === 'PERMUTA' ? 'purple' : 'dark'}>{p.tipo_proposta}</Badge></p>
                
                {p.valor_oferecido && <p className="mb-1 text-success"><strong>Valor R$:</strong> {p.valor_oferecido}</p>}
                {p.descricao_permuta && <p className="mb-2 p-2 bg-light rounded"><em>"Permuta: {p.descricao_permuta}"</em></p>}
                
                {/* O contato só aparece se aceita, em andamento ou concluida (regra do backend) */}
                {p.cliente?.telefone && (
                  <div className="alert alert-success p-2 mt-2">
                    📞 Contato Liberado: {p.cliente.telefone}
                  </div>
                )}

                <div className="mt-3 d-flex flex-wrap gap-2">
                  {p.status === 'PENDENTE' && (
                    <>
                      <Button variant="success" size="sm" onClick={() => alterarStatus(p.id, 'aceitar')}>Aceitar</Button>
                      <Button variant="danger" size="sm" onClick={() => alterarStatus(p.id, 'recusar')}>Recusar</Button>
                    </>
                  )}
                  {p.status === 'ACEITA' && (
                    <Button variant="primary" size="sm" onClick={() => alterarStatus(p.id, 'iniciar')}>Iniciar Serviço</Button>
                  )}
                  {p.status === 'EM_ANDAMENTO' && (
                    <Button variant="success" size="sm" onClick={() => alterarStatus(p.id, 'concluir')}>Marcar como Concluído</Button>
                  )}
                  {(p.status === 'ACEITA' || p.status === 'EM_ANDAMENTO') && (
                    <Button variant="outline-danger" size="sm" onClick={() => alterarStatus(p.id, 'cancelar')}>Cancelar Solicitação</Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
