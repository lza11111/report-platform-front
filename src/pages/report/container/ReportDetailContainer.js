import React, { Component } from 'react';
import { Button, Table, Input, Popconfirm } from 'antd';
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
      loading: true,
      editing: false,
      width: "100%"
    }
    ReportStore.fetchReport(this.props.match.params.id).then(() => {
      ReportStore.fetchTemplate().then(() => {
        this.setState({ loading: false });
      });
    })
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

  renderTemplate = (item, deep) => {
    if (!item.title) return;
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
      <ReportWrapper title={item.title} wrapperClassName={style} deep={deep} key={item.title}>
        {this.renderTemplateComponent(item.key, item.type, item.content, deep + 1)}
      </ReportWrapper>
    )
  }

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
              defaultValue={ReportStore.reportContent[key]}
            />
            :
            <p>
              {ReportStore.reportContent[key]}
            </p>
        )
      case 2:
        return (
          <EditableTable
            dataSource={ReportStore.reportContent[key]}
            columns={content.column}
            editable={this.state.editing}
          />
        )
    }
  }

  editReport = () => {
    this.setState({ editing: true });
  }

  cancelEditReport = () => {
    this.setState({ editing: false });
  }

  render() {
    const { width } = this.state;
    return (
      <div className={styles.container}>
        {this.renderTemplate(ReportStore.templateContent, 0)}
        <FooterToolbar style={{ width }}>
          {this.state.editing ?
            <Popconfirm title={<p>确定要取消吗？<br/>将会丢失所有未保存的编辑内容！</p>} onConfirm={this.cancelEditReport}>
              <Button>
                取消
              </Button>
            </Popconfirm>
            : null}
          {this.state.editing ? <Button type="danger" onClick={this.saveReport}>保存</Button> : null}
          {!this.state.editing ? <Button type="primary" onClick={this.editReport}>编辑</Button> : null}
        </FooterToolbar>
      </div>
    );
  }
}

export default ReportDetailContainer;
