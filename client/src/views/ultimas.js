import React from 'react';
import { Table } from 'react-bootstrap';

const TransactionTable = ({ transactions }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Tipo</th>
          <th>ID del mensaje</th>
          <th>Banco de origen</th>
          <th>Cuenta de origen</th>
          <th>Banco de destino</th>
          <th>Cuenta de destino</th>
          <th>Monto</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, i) => (
          <tr key={i}>
            <td>{transaction.type}</td>
            <td>{transaction.message_id}</td>
            <td>{transaction.origin_bank}</td>
            <td>{transaction.origin_account}</td>
            <td>{transaction.destination_bank}</td>
            <td>{transaction.destination_account}</td>
            <td>{transaction.amount}</td>
            <td>{transaction.publish_time}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TransactionTable;