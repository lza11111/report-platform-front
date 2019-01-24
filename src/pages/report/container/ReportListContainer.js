import React, { Component } from 'react';
import moment from 'moment';
import Link from 'umi/link';
import { observer } from 'mobx-react';
import { Button, Table, Card, Radio, Input, Modal } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ConfirmModal from '../component/ConfirmModal';
import ReportStore from '../store/ReportStore';
import styles from '../style/ReportListContainer.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;



@observer
class ReportListContainer extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      deleteLoding: false,
      opertaionModal: false,
    }
    ReportStore.fetchReportList().then(() => this.setState({ loading: false }));
  }

  deleteReport = (id) => {
    this.setState({ deleteLoding: true });
    ReportStore.deleteReport(id).then(() => {
      this.setState({ deleteLoding: false, opertaionModal: false});
    })
  }

  cancelDelete = () => {
    this.setState({ opertaionModal: false });
  }

  render() {

    const ReportTableColumn = [
      {
        title: '报告编号',
        dataIndex: 'id',
        render: id => <Link to={`/report/${id}`}>{id}</Link>
      },
      {
        title: '标题',
        dataIndex: 'title',
        render: (title, row) => <Link to={`/report/${row.id}`}>{title}</Link>
      },
      {
        title: '报告人',
        dataIndex: 'user',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: val => moment(val).format("YYYY年M月D日，hh:mm:ss")
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (val, row) =>
          <Button
            type="danger"
            onClick={() => this.setState({ selectedReport: row, opertaionModal: true })}
          >
            删除
          </Button>
      }
    ]

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">我的报告</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="查询标题" onSearch={() => ({})} />
      </div>
    );

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title={<Link to="/report/add"><Button type="primary">新建报告</Button></Link>}
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Table loading={this.state.loading} rowKey={(report => report.id)} columns={ReportTableColumn} dataSource={ReportStore.reportList} />
          </Card>
        </div>
        <ConfirmModal 
          visible={this.state.opertaionModal} 
          report={this.state.selectedReport}
          handleOk={() => this.deleteReport(this.state.selectedReport.id)}
          handleCancel={this.cancelDelete}
          confirmLoading={this.state.deleteLoding}
        />
      </PageHeaderWrapper>
    );
  }
}

export default ReportListContainer;
