import React, { Component } from 'react';
import { Modal, Button, Input } from 'antd';

const { TextArea } = Input;

export default class EditTemplateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    }
  }

  componentWillReceiveProps(nextprops){
    if(nextprops.template){
      this.setState({ value: JSON.stringify(nextprops.template.content) });
    }
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value })
  }

  handleOk = () => {
    const { onOk } = this.props;
    onOk(this.state.value);
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  }

  render() {
    const { visible } = this.props;
    console.log(this.state.value);
    return (
      <Modal
        visible={visible}
        title={"修改报告模板"}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <TextArea rows={20} placeholder="输入报告模板" value={this.state.value} onChange={this.handleChange} />
      </Modal>
    )
  }
}