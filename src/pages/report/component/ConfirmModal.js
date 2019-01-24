import React, { Component } from 'react';
import { Modal, Button } from 'antd';

export default function ConfirmModal ({ visible, report, handleOk, handleCancel, confirmLoading }) {
  return (
    <Modal
      visible={visible}
      title={"删除确认"}
      onOk={handleOk}
      okButtonProps={{ type:"danger", loading: confirmLoading }}
      onCancel={handleCancel}
      cancelButtonProps={{ loading:confirmLoading }}
    >
      您确认要删除报告"{report ? report.title: null}"吗？此操作不可逆！
    </Modal>
  )
}