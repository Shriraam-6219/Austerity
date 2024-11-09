import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { getRecurringPayment } from '../../utils/ApiRequest';

const RequiringTableData = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [values, setValues] = useState({
    title: '',
    purpose: '',
    category: '',
    platform: '',
    amount: '',
    date: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user._id) {
    alert("User not found. Please log in.");
    return;
  }

  const userId = user._id;

  const fetchData = async () => {
    try {
      const response = await axios.post(`${getRecurringPayment}`, { userId });
      setData(response.data);
      console.log("Payment",data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEditClick = (transactionId) => {
    const transaction = data.find((item) => item._id === transactionId);
    setEditingTransaction(transaction);
    setValues({
      title: transaction.title,
      amount: transaction.amount,
      category: transaction.category,
      transactionType: transaction.transactionType,
      purpose: transaction.purpose,
      platform: transaction.platform,
      date: moment(transaction.date).format('YYYY-MM-DD'),
    });
    setShow(true);
  };

  const handleDeleteClick = async (transactionId) => {
    try {
      await axios.delete(`/api/deleteTransaction/${transactionId}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`/api/updateTransaction/${editingTransaction._id}`, values);
      setShow(false);
      fetchData();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  return (
    <Container>
      <Table responsive="md" className="data-table bg-black">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Purpose</th>
            <th>Category</th>
            <th>Platform</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {data.map((item, index) => (
            <tr key={index}>
              <td>{moment(item.date).format('YYYY-MM-DD')}</td>
              <td>{item.title}</td>
              <td>{item.amount}</td>
              <td>{item.purpose}</td>
              <td>{item.category}</td>
              <td>{item.platform}</td>
              <td>
                <div className="icons-handle">
                  <EditNoteIcon
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleEditClick(item._id)}
                  />
                  <DeleteForeverIcon
                    sx={{ color: 'red', cursor: 'pointer' }}
                    onClick={() => handleDeleteClick(item._id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={values.amount}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={values.category}
                onChange={handleChange}
              >
                <option value="">{values.category}</option>
                <option value="Groceries">Groceries</option>
                <option value="Rent">Rent</option>
                <option value="Salary">Salary</option>
                <option value="Food">Food</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select
                name="transactionType"
                value={values.transactionType}
                onChange={handleChange}
              >
                <option value="Credit">Credit</option>
                <option value="Expense">Expense</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={values.date}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RequiringTableData;
