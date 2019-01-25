import React, { Component } from 'react';
import { Button, Table, Input, Popconfirm, Spin } from 'antd';
import router from 'umi/router';
import { observer } from 'mobx-react';
import FooterToolbar from '@/components/FooterToolbar';


import ReportWrapper from '../component/ReportWrapper';
import EditableTable from '../component/EditableTable.js';
import ReportStore from '../store/ReportStore';
import styles from '../style/ReportDetailContainer.less';

const { TextArea } = Input;

@observer
class ReportDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoading: true,
      buttonLoading: false,
      editing: props.isNew ? true : false,
      width: "100%",
      report: {},
    }
    if (props.templateId) {
      ReportStore.fetchTemplate(props.templateId).then(() => {
        this.setState({ pageLoading: false });
      });
    } else {
      ReportStore.fetchReport(this.props.match.params.id).then(() => {
        ReportStore.fetchTemplate().then(() => {
          this.setState({ pageLoading: false, report: ReportStore.reportContent });
        });
      })
    }

  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });  //底部ToolBar跟随页面浮动
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);//底部ToolBar跟随页面浮动
  }

  resizeFooterToolbar = () => { //底部ToolBar跟随页面浮动
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  renderTemplate = (item, deep, reportTitle) => {
    if (!item) return;
    let style = null;
    switch (deep) {
      case 0:                         //面包屑+报告标题
        style = styles.advancedForm;
        break;
      case 1:                         //card块
        style = styles.card;
        break;
      case 2:                         //每个项目的标题
        style = styles.formLabel;
        break;
      default:
        style = null;
    }
    return (
      <ReportWrapper title={item.title || ReportStore.reportTitle} wrapperClassName={style} deep={deep} key={item.title} hasKey={item.key}>
        {this.renderTemplateComponent(item.key, item.type, item.content, deep + 1)}
      </ReportWrapper>
    )
  }

  // TODO: 分离出单独的组件
  renderTemplateComponent = (key, type, content, deep) => {
    switch (type) {
      case 0:
        return content.sub.map((item => this.renderTemplate(item, deep)));
      case 1:
        return (
          this.state.editing ?
            <TextArea
              className={styles.TextArea}
              autosize={{ minRows: 2, maxRows: 6 }}
              placeholder={content.placeholder}
              defaultValue={this.state.report[key]}
              onChange={(value) => this.changeTextArea(value, key)}
            />
            :
            <p>
              {this.state.report[key]}
            </p>
        )
      case 2:
        return (
          <EditableTable
            dataSource={this.state.report[key] || []}
            columns={content.column}
            rowDefault={content.default || []}
            opreation={content.function || null}
            editable={this.state.editing}
            save={(value) => this.changeTable(value, key)}
          />
        )
    }
  }

  renderFooterToolbar = (width) => {
    return (
      <FooterToolbar style={{ width }}>
        {this.state.editing ?
          <Popconfirm title={<p>确定要取消吗？<br />将会丢失所有未保存的编辑内容！</p>} onConfirm={this.cancelEditReport}>
            <Button disabled={this.state.buttonLoading} loading={this.state.buttonLoading}>
              取消
              </Button>
          </Popconfirm>
          : null}
        {this.state.editing ?
          <Button
            disabled={this.state.buttonLoading}
            loading={this.state.buttonLoading}
            type="danger"
            onClick={this.props.isNew ? this.addReport : this.updateReport}
          >
            保存
            </Button> : null}
        {!this.state.editing ?
          <Button
            type="primary"
            onClick={this.editReport}>
            编辑
            </Button> : null}
      </FooterToolbar>
    )
  }

  // TODO: merge change function
  changeTextArea = (value, key) => {
    this.state.report[key] = value.target.value;
  }


  changeTable = (value, key) => {
    this.state.report[key] = value;
  }

  editReport = () => {
    this.setState({ editing: true });
  }

  cancelEditReport = () => {
    this.setState({ editing: false, report: ReportStore.reportContent });
  }

  updateReport = () => {

    this.setState({ editing: false, pageLoading: true });
    ReportStore.updateReport(
      this.state.report
    ).then(() => {
      this.setState({ pageLoading: false, report: ReportStore.reportContent });
    });
  }

  addReport = () => {
    this.setState({ editing: false, pageLoading: true });
    console.log(ReportStore.templateId);
    ReportStore.addReport(
      "admin",
      ReportStore.reportTitle,
      ReportStore.templateId,
      this.state.report
    ).then(() => {
      this.setState({ pageLoading: false });
      router.push(`/report/${ReportStore.reportId}`);
    });
  }

  render() {
    const { width } = this.state;
    return (
      <Spin tip="Loading..." spinning={this.state.pageLoading}>
        <div className={styles.container}>
          {this.renderTemplate(ReportStore.templateContent, 0, this.state.report.title)}
          {this.renderFooterToolbar(width)}
        </div>
      </Spin>
    )
  }
}

export default ReportDetailContainer;
