import React, { useState, useEffect } from 'react';
import Table from '../components/table/Table';
import ModalComponent from './Modal/AddProducts';

import Paging from '../components/paging/paging';
import './Button.scss';
import './Table.scss';


const customerTableHead = [
  '',
  'name',
  'email',
  'phone',
  'total orders',
  'total spend',
  'location'
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index, openModal) => (
  <tr key={index} onClick={() => openModal(item)}>
    <td>{item.id}</td>
    <td>{item.name}</td>
    <td>{item.email}</td>
    <td>{item.phone}</td>
    <td>{item.total_orders}</td>
    <td>{item.total_spend}</td>
    <td>{item.location}</td>
  </tr>
);

const Customers = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, pageSize]);

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomers(currentPage, pageSize);
      if (response && response.errorCode === 200) {
        setCustomers(response.content.data);
        setPageCount(response.content.totalPages);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await deleteCustomer(customerId);
      await fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const openModal = (customer) => {
    setSelectedCustomer(customer);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCustomer(null);
  };

  const handleChangePage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  return (
    <div>
      <h2 className="page-header">
        Customers
      </h2>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit='10'
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={customers}
                renderBody={(item, index) => renderBody(item, index, openModal)}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalComponent
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Customer Details"
        customer={selectedCustomer} 
        onCustomerAdded={fetchCustomers}
      />
      {customers.length > 0 &&
        <Paging
          pageIndex={currentPage}
          pageSize={pageSize}
          pageCount={pageCount}
          changePage={handleChangePage}
        />
      }
    </div>
  );
};

export default Customers;
