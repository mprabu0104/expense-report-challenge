import React, { Component } from "react";
import { Table, Alert } from "react-bootstrap";

class ExpenseRow extends Component {
  constructor(props) {
    super(props);

    this.handleEditClickRow = this.handleEditClickRow.bind(this);
  }

  handleEditClickRow(e) {
    e.preventDefault();
    this.props.onEditClick(this.props.id);
  }

  render() {
    var moment = require("moment");
    return (
      <tr onClick={this.handleEditClickRow}>
        <td>{this.props.expense.description}</td>
        <td>{this.props.expense.result}</td>
        <td>{moment(this.props.expense.date).format("DD/MM/YYYY HH:mm")}</td>
      </tr>
    );
  }
}

class ExpenseTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "1"
    };

    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleEditClick(id) {
    this.props.onEdit(id);
  }

  prepareRows() {
    var expenses = this.props.expenses.slice();
    return expenses;
  }

  render() {
    var expenses = this.prepareRows();
    var rows = [];
    expenses.forEach((expense) => {
      rows.unshift(
        <ExpenseRow
          expense={expense}
          id={expense.id}
          key={expense.id}
          onEditClick={this.handleEditClick}
        />
      );
    });

    return (
      <div className="expense-table">
        <h3>EXPENSE LIST</h3>
        <Alert variant="light">
          You can also edit an expense by clicking on it
        </Alert>

        <Table responsive bordered>
          <thead>
            <tr>
              <th>Description</th>
              <th>Value in CAD ($)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    );
  }
}

export default ExpenseTable;