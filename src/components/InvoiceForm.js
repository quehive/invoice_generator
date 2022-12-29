import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Form, Row, Button, Card, InputGroup } from "react-bootstrap";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: "₹",
      currentDate: "",
      invoiceNumber: 1,
      dateOfIssue: "",
      billTo: "",
      billToEmail: "",
      billToAddress: "",
      billFrom: "",
      billFromEmail: "",
      billFromAddress: "",
      notes: "",
      total: "0.00",
      subTotal: "0.00",
      taxRate: "",
      taxAmmount: "0.00",
      discountRate: "",
      discountAmmount: "0.00",
    };
    this.state.items = [
      {
        id: 0,
        name: "",
        description: "",
        price: "1.00",
        quantity: 1,
      },
    ];
    this.editField = this.editField.bind(this);
  }

  componentDidMount(prevProps) {
    this.handleCalculateTotal();
  }

  // editField
  editField = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    this.handleCalculateTotal();
  };

  // onCurrencyChange
  onCurrencyChange = (selectedOption) => {
    this.setState(selectedOption);
  };

  // handleCalculateTotal
  handleCalculateTotal() {
    var items = this.state.items;
    var subTotal = 0;

    items.map(function (items) {
      subTotal = parseFloat(
        subTotal + parseFloat(items.price).toFixed(2) * parseInt(items.quantity)
      ).toFixed(2);
    });

    this.setState(
      {
        subTotal: parseFloat(subTotal).toFixed(2),
      },
      () => {
        this.setState(
          {
            taxAmmount: parseFloat(
              parseFloat(subTotal) * (this.state.taxRate / 100)
            ).toFixed(2),
          },
          () => {
            this.setState(
              {
                discountAmmount: parseFloat(
                  parseFloat(subTotal) * (this.state.discountRate / 100)
                ).toFixed(2),
              },
              () => {
                this.setState({
                  total:
                    subTotal -
                    this.state.discountAmmount +
                    parseFloat(this.state.taxAmmount),
                });
              }
            );
          }
        );
      }
    );
  }

  // onItemizedItemEdit
  onItemizedItemEdit(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value,
    };
    var items = this.state.items.slice();
    var newItems = items.map(function (items) {
      for (var key in items) {
        if (key == item.name && items.id == item.id) {
          items[key] = item.value;
        }
      }
      return items;
    });
    this.setState({ items: newItems });
    this.handleCalculateTotal();
  }

  // handleAddEvent
  handleAddEvent(evt) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var items = {
      id: id,
      name: "",
      price: "1.00",
      description: "",
      quantity: 1,
    };
    this.state.items.push(items);
    this.setState(this.state.items);
  }

  // handleRowDel
  handleRowDel(items) {
    var index = this.state.items.indexOf(items);
    this.state.items.splice(index, 1);
    this.setState(this.state.items);
  }

  // OpenModal
  openModal = (event) => {
    event.preventDefault();
    this.handleCalculateTotal();
    this.setState({ isOpen: true });
  };

  // CloseModal
  closeModal = (event) => this.setState({ isOpen: false });

  render() {
    return (
      <Form onSubmit={this.openModal}>
        <Row>
          <Col md={8} lg={9}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4">
              <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                <div className="d-flex flex-column">
                  <div className="d-flex flex-column">
                    <div className="mb-2">
                      <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                      <span className="current-date">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold d-block me-2">
                      Due&nbsp;Date&nbsp;
                    </span>
                    <Form.Control
                      type="date"
                      name={"dateOfIssue"}
                      style={{ maxWidth: "150px" }}
                      required="required"
                      onChange={(event) => this.editField(event)}
                      value={this.state.dateOfIssue}
                    />
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold me-2">
                    Invoice&nbsp;Number:&nbsp;
                  </span>
                  <Form.Control
                    type="number"
                    name={"invoiceNumber"}
                    min="1"
                    style={{
                      maxWidth: "70px",
                    }}
                    required="required"
                    value={this.state.invoiceNumber}
                    onChange={(event) => this.editField(event)}
                  />
                </div>
              </div>
              <hr className="my-4" />
              <Row className="mb-5">
                <Col>
                  <Form.Label className="fw-bold">Bill to:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={"Who is invoice to?"}
                    rows={3}
                    name="billTo"
                    onChange={(event) => this.editField(event)}
                    value={this.state.billTo}
                    autoComplete="name"
                    required="required"
                    className="my-2"
                  />
                  <Form.Control
                    type="email"
                    placeholder={"Email Address"}
                    name="billToEmail"
                    onChange={(event) => this.editField(event)}
                    value={this.state.billToEmail}
                    autoComplete="email"
                    required="required"
                    className="my-2"
                  />
                  <Form.Control
                    type="text"
                    placeholder={"Billing Address"}
                    name="billToAddress"
                    onChange={(event) => this.editField(event)}
                    value={this.state.billToAddress}
                    autoComplete="address"
                    required="required"
                    className="my-2"
                  />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Bill From:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={"Who is invoice from"}
                    rows={3}
                    name="billFrom"
                    onChange={(event) => this.editField(event)}
                    value={this.state.billFrom}
                    autoComplete="name"
                    required="required"
                    className="my-2"
                  />
                  <Form.Control
                    type="text"
                    placeholder={"Email Address"}
                    name="billFromEmail"
                    onChange={(event) => this.editField(event)}
                    value={this.state.billFromEmail}
                    autoComplete="email"
                    required="required"
                    className="my-2"
                  />
                  <Form.Control
                    type="text"
                    placeholder={"Billing Address"}
                    name="billFromAddress"
                    onChange={(event) => this.editField(event)}
                    value={this.state.billFromAddress}
                    autoComplete="address"
                    required="required"
                    className="my-2"
                  />
                </Col>
              </Row>
              {/*============================================ invoiceItem ============================================*/}
              <InvoiceItem
                onItemizedItemEdit={this.onItemizedItemEdit.bind(this)}
                onRowAdd={this.handleAddEvent.bind(this)}
                onRowDel={this.handleRowDel.bind(this)}
                currency={this.state.currency}
                items={this.state.items}
              />
              {/*============================================ invoiceItem ============================================*/}
              <Row className="mt-4 justify-content-end">
                <Col lg={6}>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <span className="fw-bold">Subtotal:</span>
                    <span>
                      {this.state.currency}
                      {this.state.subTotal}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Discount:</span>
                    <span>
                      <span className="small">
                        ({this.state.discountRate || 0}%)
                      </span>
                      {this.state.currency}
                      {this.state.discountAmmount || 0}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Tax:</span>
                    <span>
                      <span className="small">
                        ({this.state.taxRate || 0}%)
                      </span>
                      {this.state.currency}
                      {this.state.taxAmmount || 0}
                    </span>
                  </div>
                  <hr />
                  <div
                    className="d-flex flex-row align-items-start justify-content-between"
                    style={{
                      fontSize: "1.125rem",
                    }}
                  >
                    <span className="fw-bold">Total:</span>
                    <span className="fw-bold">
                      {this.state.currency}
                      {this.state.total || 0}
                    </span>
                  </div>
                </Col>
              </Row>
              <hr className="my-4" />
              <Form.Label className="fw-bold">Notes:</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                rows={1}
                value={this.state.notes}
                onChange={(event) => this.editField(event)}
                placeholder={"Notes"}
                className="my-2"
              />
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <div className="sticky-top pt-md-3 pt-xl-4">
              <Button variant="primary" type="submit" className="d-block w-100">
                Review Invoice
              </Button>
              {/*============================================ InvoiceModal =========================================================*/}
              <InvoiceModal
                showModal={this.state.isOpen}
                closeModal={this.closeModal}
                info={this.state}
                items={this.state.items}
                currency={this.state.currency}
                subTotal={this.state.subTotal}
                taxAmmount={this.state.taxAmmount}
                discountAmmount={this.state.discountAmmount}
                total={this.state.total}
              />
              {/*============================================ InvoiceModal =========================================================*/}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Currency:</Form.Label>
                <Form.Select
                  className="btn btn-light my-2"
                  aria-label="Change Currency"
                  onChange={(event) =>
                    this.onCurrencyChange({ currency: event.target.value })
                  }
                >
                  <option value="₹">INR (Indian Rupee)</option>
                  <option value="$">USD (United States Dollar)</option>
                  <option value="£">GBP (British Pound Sterling)</option>
                  <option value="$">CAD (Canadian Dollar)</option>
                  <option value="¥">CNY (Chinese Renminbi)</option>
                  <option value="₿">BITCOIN (Bitcoin)</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Tax rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control
                    name="taxRate"
                    typeof="number"
                    placeholder="0.0"
                    step="0.01"
                    min="0.00"
                    max="100.00"
                    value={this.state.taxRate}
                    onChange={(event) => this.editField(event)}
                    className="bg-white border"
                  />
                  <InputGroup.Text className="bg-light fw-bold text-secondary small">
                    %
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Discount rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control
                    name="discountRate"
                    typeof="number"
                    placeholder="0.0"
                    step="0.01"
                    min="0.00"
                    max="100.00"
                    value={this.state.discountRate}
                    onChange={(event) => this.editField(event)}
                    className="bg-white border"
                  />
                  <InputGroup.Text className="bg-light fw-bold text-secondary small">
                    %
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default InvoiceForm;
