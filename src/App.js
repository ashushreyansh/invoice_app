import React, { useState } from "react";
import { Table, Input, Button } from "antd";
import "antd/dist/reset.css";
import "./InvoiceApp.css";

const InvoiceApp = () => {
  document.title = "InvoiceCreater";
  
  const [invoices, setInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState({
    qty: 1,
    price: 0,
    discountPercent: 0,
    discount: 0,
    taxPercent: 0,
    tax: 0,
    total: 0,
  });
  const [editingIndex, setEditingIndex] = useState(-1);

  const calculateInvoice = (updatedFields) => {
    const updatedInvoice = { ...currentInvoice, ...updatedFields };
    updatedInvoice.discount = (updatedInvoice.price * updatedInvoice.discountPercent) / 100;
    updatedInvoice.tax = ((updatedInvoice.price - updatedInvoice.discount) * updatedInvoice.taxPercent) / 100;
    updatedInvoice.total = updatedInvoice.qty * (updatedInvoice.price - updatedInvoice.discount + updatedInvoice.tax);
    setCurrentInvoice(updatedInvoice);
  };

  const handleChange = (field, value) => {
    calculateInvoice({ [field]: parseFloat(value) || 0 });
  };

  const handleSubmit = () => {
    if (editingIndex >= 0) {
      const updatedInvoices = [...invoices];
      updatedInvoices[editingIndex] = currentInvoice;
      setInvoices(updatedInvoices);
      setEditingIndex(-1);
    } else {
      setInvoices([...invoices, currentInvoice]);
    }
    setCurrentInvoice({ qty: 1, price: 0, discountPercent: 0, discount: 0, taxPercent: 0, tax: 0, total: 0 });
  };

  const handleEdit = (index) => {
    setCurrentInvoice(invoices[index]);
    setEditingIndex(index);
  };

  const columns = [
    { title: "Qty", dataIndex: "qty", render: (_, record, index) => renderEditableField(index, "qty") },
    { title: "Price", dataIndex: "price", render: (_, record, index) => renderEditableField(index, "price") },
    { title: "Discount %", dataIndex: "discountPercent", render: (_, record, index) => renderEditableField(index, "discountPercent") },
    { title: "Discount", dataIndex: "discount" },
    { title: "Tax %", dataIndex: "taxPercent", render: (_, record, index) => renderEditableField(index, "taxPercent") },
    { title: "Tax", dataIndex: "tax" },
    { title: "Total", dataIndex: "total" },
    { title: "Actions", render: (_, __, index) => <Button onClick={() => handleEdit(index)}>Edit</Button> },
  ];

  const renderEditableField = (index, field) => {
    return editingIndex === index ? (
      <Input
        value={invoices[index][field]}
        onChange={(e) => handleChange(field, e.target.value)}
      />
    ) : (
      invoices[index][field]
    );
  };

  return (
    <div className="invoice-container">
      <h2 className="title">Invoice Form</h2>
      <div className="form-wrapper">
        <div className="form-grid">
          <div className="form-row">
            <label>Qty</label>
            <Input className="input-field" value={currentInvoice.qty} onChange={(e) => handleChange("qty", e.target.value)} />
          </div>
          <div className="form-row">
            <label>Price</label>
            <Input className="input-field" value={currentInvoice.price} onChange={(e) => handleChange("price", e.target.value)} />
          </div>
          <div className="form-row">
            <label>Discount %</label>
            <Input className="input-field" value={currentInvoice.discountPercent} onChange={(e) => handleChange("discountPercent", e.target.value)} />
          </div>
          <div className="form-row">
            <label>Tax %</label>
            <Input className="input-field" value={currentInvoice.taxPercent} onChange={(e) => handleChange("taxPercent", e.target.value)} />
          </div>
        </div>
        <Button className="submit-button" onClick={handleSubmit}>{editingIndex >= 0 ? "Update" : "Submit"}</Button>
      </div>
      <h2 className="title">Invoice List</h2>
      <div className="table-container">
        <Table className="invoice-table" dataSource={invoices} columns={columns} rowKey={(_, index) => index} pagination={false} />
      </div>
    </div>
  );
};

export default InvoiceApp;
