import React, { Component } from 'react';
import Link from 'umi/link';
import { observer } from 'mobx-react';
import { Button, Table } from 'antd';
import ReportStore from '../store/ReportStore';

import styles from '../style.less';

const ReportTableColumn = [
  {
    title: '报告编号',
    dataIndex: 'id',
    render: id => <Link to={`/report/${id}`}>{id}</Link>
  },
  {
    title: '报告人',
    dataIndex: 'user',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
  }
]

@observer
class ReportListContainer extends Component {
  constructor(){
    super();
    this.state = {
      loading: true,
    }
    ReportStore.fetchReportList().then(() => this.setState({loading: false}));
  }
  render() {
    return (
      <div className={styles.container}>
        <Table loading={this.state.loading} rowKey={(report => report.id)} columns={ReportTableColumn} dataSource={ReportStore.reportList}/>
      </div>
    );
  }
}

export default ReportListContainer;
