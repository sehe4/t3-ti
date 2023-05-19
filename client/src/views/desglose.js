import React from 'react';
import { Table } from 'react-bootstrap';

const OperationTable = ({ Total, operationData }) => {
  return (
    <>
    <h3 className='px-2 py-4'>Cantidad de Operaciones Totales: {Total}</h3>

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