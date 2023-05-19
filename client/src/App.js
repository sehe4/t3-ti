import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Nav, hr } from 'react-bootstrap';
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TransactionTable from './views/ultimas';
import TransactionHistogram from './views/histograma';
import ConciliationTable from './views/conciliacion';
import OperationTable from './views/desglose';
import axios from 'axios';


const App = () => {
  const [activeKey, setActiveKey] = useState('link-1');
  const [transactions, setTransactions] = useState([]);
  const [conciliationData, setConciliationData] = useState([]);
  const [operationData, setOperationData] = useState([]);
  const [Total, setTotal] = useState(0);
  const [selectedOriginBank, setSelectedOriginBank] = useState(null);
  const [selectedDestinationBank, setSelectedDestinationBank] = useState(null);
  const [bankOptions, setBankOptions] = useState([]); // ['Banco 1', 'Banco 2', 'Banco 3', 'Banco 4', 'Banco 5', 'Todos'
  const [selectedDate, setSelectedDate] = useState(null);

  const handleNavSelect = (selectedKey) => {
    setActiveKey(selectedKey);
  };
  const handleOriginBankChange = (bank) => {
    setSelectedOriginBank(bank);
  };
  const handleDestinationBankChange = (bank) => {
    setSelectedDestinationBank(bank);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const parametros = {origin_bank: selectedOriginBank, destination_bank: selectedDestinationBank, date: selectedDate};


  useEffect(() => {
    var url2 = "http://localhost:3001/"
    var url = "https://tarea-3-ti-g920.onrender.com/";
    var api_url = 'banks';
    // console.log(url+api_url);
    axios.get(url+api_url)
    .then(response => {
      console.log(response.data);
      setBankOptions(response.data.banks);
    })
    .catch(error => {
      console.error(error);
    }
    );
  }, []);

  useEffect(() => {
    var url2 = "http://localhost:3001/"
    var url = "https://tarea-3-ti-g920.onrender.com/";
    var api_url = '';
    if (activeKey === 'link-1') {
      api_url = url + 'desglose';
    } else if (activeKey === 'link-2') {
      api_url = url + 'conciliacion';
    } else if (activeKey === 'link-3') {
      api_url = url + 'ultimas';
    } else if (activeKey === 'link-4') {
      api_url = url + 'histograma';
    }
    if (api_url !== '') {
    axios.get(api_url, { params: parametros })
    .then(response => {
      // Maneja la respuesta de la API
      // console.log(response.data);
      if (activeKey === 'link-1') {
        setTotal(response.data.Total);
        setOperationData(response.data.operationData);
      }
      if (activeKey === 'link-2') {
        setConciliationData(response.data);
      }
      if (activeKey === 'link-3') {
        setTransactions(response.data);
      }
      if (activeKey === 'link-4') {
        setTransactions(response.data);
      }
    })
    .catch(error => {
      // Maneja el error de la solicitud
      console.error(error);
    });
  }
  }, [activeKey, selectedOriginBank, selectedDestinationBank, selectedDate]);
  

  return (
    
    <Container fluid >
      <Row className='vh-100'>
      <Col md={3} className="bg-dark px-2">
      <h2 className="card-title text-white px-1 pt-2">Dashboard</h2>
      <hr className="text-white"/>
      <Nav variant="pills" activeKey={activeKey} className="flex-column py-1" onSelect={handleNavSelect}>
        <Nav.Item>
          <Nav.Link eventKey="link-1" className='text-white'>Operaciones y desglose</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2" className='text-white'>Conciliación entre bancos</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-3" className='text-white'>Últimas 100 transacciones</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-4" className='text-white'>Histograma del monto de transacciones</Nav.Link>
        </Nav.Item>
      </Nav>
      <h5 className="card-title text-white px-1 pt-4 pb-2">Filtros</h5>
      <p className="card-title text-white px-1 pt-3 pb-1">Banco de Origen</p>
      <Form.Group className="py-2 px-2">
      <DropdownButton id="bank-filter-dropdown" title={selectedOriginBank ? selectedOriginBank : 'Seleccionar Banco de Origen'}>
        {bankOptions.map((bank, index) => (
          <Dropdown.Item key={index} onClick={() => handleOriginBankChange(bank)}>
            {bank}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </Form.Group>
    <p className="card-title text-white px-1 pt-2 pb-1">Banco de Destino</p>
    <Form.Group className="py-2 px-2">
      <DropdownButton id="bank-filter-dropdown" title={selectedDestinationBank ? selectedDestinationBank : 'Seleccionar Banco de Destino'}>
        {bankOptions.map((bank, index) => (
          <Dropdown.Item key={index} onClick={() => handleDestinationBankChange(bank)}>
            {bank}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <p className="card-title text-white px-1 pt-2 pb-1">Fecha</p>
    </Form.Group>
    <DatePicker selected={selectedDate} onChange={handleDateChange} dateFormat="dd/MM/yyyy" className=" mx-2"/>

    </Col>
        <Col md={9}>
        {activeKey === 'link-1' && <OperationTable Total={Total} operationData={operationData} />}
        {activeKey === 'link-2' && <ConciliationTable conciliationData={conciliationData} />}
        {activeKey === 'link-3' && <TransactionTable transactions={transactions} />}
        {activeKey === 'link-4' && <TransactionHistogram transactions={transactions} />}
    


        </Col>
      </Row>
    </Container>
  );
};

export default App;