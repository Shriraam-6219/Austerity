import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";
import { deleteRecurringPayment, editRecurringPayment } from "../../utils/ApiRequest";
import axios from "axios";

const RecurringPaymentsTable = (props) => {
  const [show, setShow] = useState(false);
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);

  const handleEditClick = (itemKey) => {
    const paymentToEdit = props.data.filter((item) => item._id === itemKey);
    setCurrId(itemKey);
    setEditingPayment(paymentToEdit);
    handleShow();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.put(`${editRecurringPayment}/${currId}`, { ...values });
    if (data.success) {
      await handleClose();
      setRefresh(!refresh);
      window.location.reload();
    } else {
      console.log("Error updating recurring payment.");
    }
  };

  const handleDeleteClick = async (itemKey) => {
    setCurrId(itemKey);
    const { data } = await axios.post(`${deleteRecurringPayment}/${itemKey}`, { userId: props.user._id });
    if (data.success) {
      setRefresh(!refresh);
      window.location.reload();
    } else {
      console.log("Error deleting recurring payment.");
    }
  };

  const [values, setValues] = useState({
    purpose: "",
    frequency: "",
    dueDate: "",
    amount: ""
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    setUser(props.user);
    setRecurringPayments(props.data);
  }, [props.data, props.user, refresh]);

  return (
    <>
      <Container>
        <Table responsive="md" className="data-table bg-black">
          <thead>
            <tr>
              <th>Purpose</th>
              <th>Frequency</th>
              <th>Due Date for Payment</th>
              <th>Amount to be Paid</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {props.data.map((item, index) => (
              <tr key={index}>
                <td>{item.purpose}</td>
                <td>{item.frequency}</td>
                <td>{moment(item.dueDate).format("YYYY-MM-DD")}</td>
                <td>{item.amount}</td>
                <td>
                  <div className="icons-handle">
                    <EditNoteIcon
                      sx={{ cursor: "pointer" }}
                      key={item._id}
                      id={item._id}
                      onClick={() => handleEditClick(item._id)}
                    />

                    <DeleteForeverIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      key={index}
                      id={item._id}
                      onClick={() => handleDeleteClick(item._id)}
                    />

                    {editingPayment ? (
                      <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                          <Modal.Title>Update Recurring Payment Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form onSubmit={handleEditSubmit}>
                            <Form.Group className="mb-3" controlId="formPurpose">
                              <Form.Label>Purpose</Form.Label>
                              <Form.Control
                                name="purpose"
                                type="text"
                                placeholder={editingPayment[0].purpose}
                                value={values.purpose}
                                onChange={handleChange}
                              />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formFrequency">
                              <Form.Label>Frequency</Form.Label>
                              <Form.Select
                                name="frequency"
                                value={values.frequency}
                                onChange={handleChange}
                              >
                                <option value="">{editingPayment[0].frequency}</option>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Annually">Annually</option>
                              </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formDueDate">
                              <Form.Label>Due Date for Payment</Form.Label>
                              <Form.Control
                                type="date"
                                name="dueDate"
                                value={values.dueDate}
                                onChange={handleChange}
                              />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formAmount">
                              <Form.Label>Amount to be Paid</Form.Label>
                              <Form.Control
                                type="number"
                                name="amount"
                                placeholder={editingPayment[0].amount}
                                value={values.amount}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>Close</Button>
                          <Button variant="primary" type="submit" onClick={handleEditSubmit}>Submit</Button>
                        </Modal.Footer>
                      </Modal>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default RecurringPaymentsTable;
