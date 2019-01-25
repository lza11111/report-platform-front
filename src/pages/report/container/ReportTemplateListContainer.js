import React, { Component } from 'react';
import moment from 'moment';
import Link from 'umi/link';
import { observer } from 'mobx-react';
import { Button, Table, Modal } from 'antd';

import NewReportModal from '../component/NewReportModal';
import ReportStore from '../store/ReportStore';

import styles from '../style.less';
import router from 'umi/router';



@observer
class ReportTemplateListContainer extends Component {
  constructor(){
    super();
    this.state = {
      loading: true,
      editorModel: false,
    }
    ReportStore.fetchTemplateList().then(() => this.setState({loading: false}));
  }

  editTemplate = () => {
    this.setState({ editorModel: true });
  }

  showNewReportModal = (id) => {
    this.setState({ newModel: true, templateId: id });
  }

  saveReportTitle = (title) => {
    ReportStore.setReportTitle(title);
    this.setState({ newModel: false });
    router.push(`/report/add/${this.state.templateId}`)
  }

  cancelSave = () => {
    this.setState({ newModel: false });
  }
  render() {
    const ReportTemplateTableColumn = [
      {
        title: '模板编号',
        dataIndex: 'id',
      },
      {
        title: '模板标题',
        dataIndex: 'title',
        
      },
      {
        title: '模板简介',
        dataIndex: 'description',
      },
      {
        title: '模板创建人',
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
        render: (val, row) => {
          return(
            <div>
            {/* <Link to={`/report/add/${row.id}`}> */}
              <Button type="primary" onClick={() => this.showNewReportModal(row.id)} >
                创建报告
              </Button>
            {/* </Link> */}
            <Button onClick={(val, row) => this.editTemplate(row)}>
              修改模板
            </Button>
            </div>
          )
        }
      }
    ]

    return (
      <div className={styles.container}>
        <Table 
          loading={this.state.loading} 
          rowKey={(template => template.id)} 
          columns={ReportTemplateTableColumn} 
          dataSource={ReportStore.reportTemplateList}
        />
        <NewReportModal 
          visible={this.state.newModel} 
          onOk={this.saveReportTitle}
          onCancel={this.cancelSave}
        />
      </div>
    );
  }
}

export default ReportTemplateListContainer;
