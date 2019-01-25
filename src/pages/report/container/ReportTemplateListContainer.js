import React, { Component } from 'react';
import moment from 'moment';
import Link from 'umi/link';
import { observer } from 'mobx-react';
import { Button, Table, Modal, Card } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import NewReportModal from '../component/NewReportModal';
import EditTemplateModal from '../component/EditTemplateModal';
import ReportStore from '../store/ReportStore';

import styles from '../style/ReportTemplateListContainer.less';
import router from 'umi/router';



@observer
class ReportTemplateListContainer extends Component {
  constructor(){
    super();
    this.state = {
      loading: true,
      editorModel: false,
      selectedTemplate: {},
    }
    ReportStore.fetchTemplateList().then(() => this.setState({loading: false}));
  }

  editTemplate = (template) => {
    console.log(template);
    this.setState({ editorModel: true, selectedTemplate: template });
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

  updateTemplate = (template) => {
    ReportStore.updateTemplate(this.state.selectedTemplate.id, JSON.parse(template)).then(() => {
      this.setState({ editorModel: false });
      ReportStore.fetchTemplateList();
    })
  }

  cancelEditTemplate = () => {
    this.setState({ editorModel: false });
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
            <Button onClick={() => this.editTemplate(row)}>
              修改模板
            </Button>
            </div>
          )
        }
      }
    ]

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
        <Card
            className={styles.listCard}
            bordered={false}
            title={<Button type="primary">新建报告模板</Button>}
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
      <div className={styles.container}>
        <Table 
          loading={this.state.loading} 
          rowKey={(template => template.id)} 
          columns={ReportTemplateTableColumn} 
          dataSource={ReportStore.reportTemplateList}
        />
        </div>
        </Card>
        <NewReportModal 
          visible={this.state.newModel} 
          onOk={this.saveReportTitle}
          onCancel={this.cancelSave}
        />
        <EditTemplateModal 
          visible={this.state.editorModel} 
          template={this.state.selectedTemplate}
          onOk={this.updateTemplate}
          onCancel={this.cancelEditTemplate}
        />
      </div>
      </PageHeaderWrapper>
    );
  }
}

export default ReportTemplateListContainer;
