import React, { Component } from 'react';
import { Modal, Button, Input } from 'antd';

export default class NewReportModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    }
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value })
  }

  handleOk = () => {
    const { onOk } = this.props;
    console.log(this.state.value);
    onOk(this.state.value);
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  }

  render() {
    const { visible } = this.props;
    return (
      <Modal
        visible={visible}
        title={"新建报告"}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Input placeholder="输入报告标题" onChange={this.handleChange} />
      </Modal>
    )
  }
}