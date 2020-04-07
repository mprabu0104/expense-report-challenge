import React, { Component } from "react";
import { Col, Alert, Button } from "react-bootstrap";
import ExpenseForm from "../components/expense-form";
import ExpenseTable from "../components/expense-table";

class ExpenseManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      description: "",
      value: "",
      date: "",
      expenses: [],
      index: -1,
      result: null,
      fromCurrency: "CAD",
      toCurrency: "CAD",
      currencies: [],
      rates: [],
    };

    this.handleDescription = this.handleDescription.bind(this);
    this.handleValue = this.handleValue.bind(this);
    this.handleCurrency = this.handleCurrency.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.submitExpenseReport = this.submitExpenseReport.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  // Initializes the currencies with values from the api
  componentDidMount() {
    this.callAPI(this.state.fromCurrency);
  }

  callAPI(base) {
    const api = `https://api.exchangeratesapi.io/latest?base=${base}`;

    fetch(api)
      .then((results) => {
        return results.json();
      })
      .then((data) =>
        this.setState({
          rates: data["rates"],
          currencies: Object.keys(data["rates"]).sort(),
        })
      )
      .catch((err) => {
        console.log("Opps", err.message);
      });
  }
  generateId() {
    return this.state.expenses.length + 1;
  }

  updateExpense() {
    const result = Number.parseFloat(
      this.state.value * this.state.rates[this.state.toCurrency]
    ).toFixed(3);
    this.setState({
      result: result,
    });
    this.state.expenses.splice(this.state.index, 1, {
      id: this.state.id,
      description: this.state.description,
      value: this.state.value,
      result: result,
      date: this.state.date,
      fromCurrency: this.state.fromCurrency,
    });
    this.setState({
      index: -1,
    });
  }

  newExpense() {
    const result = Number.parseFloat(
      this.state.value * this.state.rates[this.state.toCurrency]
    ).toFixed(3);
    this.setState({
      result: result,
    });
    this.state.expenses.push({
      id: this.generateId(),
      description: this.state.description,
      value: this.state.value,
      result: result,
      date: Date.now(),
      fromCurrency: this.state.fromCurrency,
    });
  }

  handleDescription(description) {
    this.setState({
      description: description,
    });
  }

  handleValue(value) {
    this.setState({
      value: value,
    });
  }

  handleCurrency(fromCurrency) {
    this.setState({
      fromCurrency: fromCurrency,
    });
    this.callAPI(fromCurrency);
  }

  handleForm() {
    if (this.state.index === -1) {
      this.newExpense();
    } else {
      this.updateExpense();
    }
    this.setState({
      id: "",
      description: "",
      value: "",
      date: "",
      fromCurrency: this.state.fromCurrency,
      result: null,
    });
  }

  handleEdit(id) {
    var index = this.state.expenses.findIndex((expense) => {
      return expense.id === id;
    });
    this.setState({
      index: index,
    });
    var expense = this.state.expenses[index];
    this.setState({
      id: expense.id,
      description: expense.description,
      value: expense.value,
      date: expense.date,
      result: expense.result,
      fromCurrency: expense.fromCurrency,
    });
  }

  submitExpenseReport() {
    console.log("Expense Report", this.state.expenses);
  }

  render() {
    let total = 0;
    this.state.expenses.forEach(function (expense) {
      total += parseFloat(expense.result);
    });

    return (
      <div className="container">
        <div className="expense-manager">
          <div className="row">
            <Col md={6} className="my-2 py-4">
              <ExpenseForm
                description={this.state.description}
                value={this.state.value}
                currencies={this.state.currencies}
                expenses={this.state.expenses}
                fromCurrency={this.state.fromCurrency}
                onDescription={this.handleDescription}
                onValue={this.handleValue}
                onCurrency={this.handleCurrency}
                onForm={this.handleForm}
              />
            </Col>
            <Col md={6} className="my-2 py-4 expense-table">
              <ExpenseTable
                expenses={this.state.expenses}
                onEdit={this.handleEdit}
              />
              <div className="my-4">
                <strong className="d-block float-left">Total : {total}</strong>
              </div>
              <div className="d-block">
                <Button
                  className="float-right"
                  onClick={this.submitExpenseReport}
                  disabled={total > 1000}
                  variant="success"
                >
                  Submit Report
                </Button>
              </div>
              <div className="d-inline-block mt-4">
                {total > 1000 && (
                  <Alert variant="warning">
                    The total expense report limit has been exceeded over $1,000
                    CAD.
                  </Alert>
                )}
              </div>
            </Col>
          </div>
        </div>
      </div>
    );
  }
}

export default ExpenseManager;