import React from 'react';
import { Table } from 'react-bootstrap';

const ConciliationTable = ({ conciliationData }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Banco 1</th>
          <th>Banco 2</th>
          <th>Depósitos Recibidos Banco 1</th>
          <th>Reversas Recibidas Banco 1</th>
          <th>Depósitos Recibidos Banco 2</th>
          <th>Reversas Recibidas Banco 2</th>
          <th>Conciliación</th>
          <th>Banco Deudor</th>
        </tr>
      </thead>
      <tbody>
        {conciliationData.map((row, index) => (
          <tr key={index}>
            <td>{row.banco1}</td>
            <td>{row.banco2}</td>
            <td>{row.depositosRecibidosBanco1}</td>
            <td>{row.reversasRecibidasBanco1}</td>
            <td>{row.depositosRecibidosBanco2}</td>
            <td>{row.reversasRecibidasBanco2}</td>
            <td>{row.conciliacion}</td>
            <td>{row.bancoDeudor}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ConciliationTable;