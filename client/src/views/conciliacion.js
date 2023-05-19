import React from 'react';
import { Table } from 'react-bootstrap';

const ConciliationTable = ({ conciliationData }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Banco Origen</th>
          <th>Banco Destino</th>
          <th>Depósitos Recibidos</th>
          <th>Depósitos Enviados</th>
          <th>Reversas Recibidas</th>
          <th>Reversas Enviadas</th>
          <th>Conciliación</th>
          <th>Banco Deudor</th>
        </tr>
      </thead>
      <tbody>
        {conciliationData.map((row, index) => (
          <tr key={index}>
            <td>{row.origin_bank}</td>
            <td>{row.destination_bank}</td>
            <td>{row.monto_depositos_recibidos}</td>
            <td>{row.monto_depositos_enviados}</td>
            <td>{row.monto_reversas_recibidas}</td>
            <td>{row.monto_reversas_enviadas}</td>
            <td>{row.conciliacion}</td>
            <td>{row.bancoDeudor}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ConciliationTable;