import React, { Component } from "react";
import {
  FormControl,
  FormGroup,
  FormLabel,
  Button,
  FormText,
  Col,
  Row,
  Alert,
} from "react-bootstrap";

class ExpenseForm extends Component {
  constructor(props) {
    super(props);

    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  getValidationStateDescription() {
    if (this.props.description.length === 0) return null;
    else if (this.props.description.length < 3) return "error";
    else return "success";
  }

  getValidationStateValue() {
    if (this.props.value.length === 0) return null;
    else if (isNaN(this.props.value)) return "error";
    else return "success";
  }

  handleDescriptionChange(e) {
    e.preventDefault();
    this.props.onDescription(e.target.value);
  }

  handleValueChange(e) {
    e.preventDefault();
    this.props.onValue(e.target.value);
  }

  handleCurrencyChange(e) {
    e.preventDefault();
    this.props.onCurrency(e.target.value);
  }

  getValidation() {
    if (
      this.getValidationStateDescription() === "error" ||
      this.getValidationStateValue() === "error"
    )
      return false;
    else if (
      this.getValidationStateDescription() === null ||
      this.getValidationStateValue() === null
    )
      return false;
    return true;
  }

  handleFormSubmit(e) {
    e.preventDefault();
    if (this.getValidation()) this.props.onForm();
    else {
      alert("Please, fill in the receipt details.");
    }
  }
  render() {
    return (
      <div className="expense-form">
        <h3>RECEIPT DETAILS</h3>
        <Col className="py-3">
          {" "}
          <form onSubmit={this.handleFormSubmit}>
            <FormGroup
              controlId="description"
              validationstate={this.getValidationStateDescription()}
            >
              <FormLabel>Description</FormLabel>
              <FormControl
                type="text"
                value={this.props.description}
                placeholder="Type something that describes the expense"
                onChange={this.handleDescriptionChange}
              />
              <FormControl.Feedback />
              {<FormText>Must have at least 3 characters</FormText>}
            </FormGroup>

            <FormGroup
              controlId="value"
              validationstate={this.getValidationStateValue()}
            >
              <FormLabel>Value ($)</FormLabel>
              <Row>
                {" "}
                <Col sm={8}>
                  <FormControl
                    type="number"
                    value={this.props.value}
                    placeholder="Insert value"
                    onChange={this.handleValueChange}
                  />
                  <FormControl.Feedback />
                </Col>
                <Col sm={4}>
                  <FormControl
                    as="select"
                    name="from"
                    onChange={this.handleCurrencyChange}
                    value={this.props.fromCurrency}
                  >
                    {this.props.currencies.map((cur) => (
                      <option key={cur}>{cur}</option>
                    ))}
                  </FormControl>
                </Col>
              </Row>
            </FormGroup>

            <Button disabled={this.props.expenses.length === 5} type="submit">
              Save
            </Button>

            {this.props.expenses.length === 5 && (
              <Alert variant="danger" className="my-3">
                You have reached your maximum 5 receipts.
              </Alert>
            )}
          </form>
        </Col>
      </div>
    );
  }
}

export default ExpenseForm;