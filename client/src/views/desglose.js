import React from 'react';
import { Table } from 'react-bootstrap';

const OperationTable = ({ Total, operationData }) => {
  return (
    <>
    <p>Cantidad de Operaciones Totales: {Total}</p>

    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Tipo de Operación</th>
          <th>Cantidad</th>
          <th>Monto Total</th>
        </tr>
      </thead>
      <tbody>
        {operationData.map((row, index) => (
          <tr key={index}>
            <td>{row.type}</td>
            <td>{row.cantidad}</td>
            <td>{row.monto_total}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    </>
  );
};

export default OperationTable;