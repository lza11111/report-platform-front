import React, { Component } from 'react';
import { Button, Table } from 'antd';
import ReportStore from '../store/ReportStore';

import styles from '../style.less';
import { propTypes } from 'mobx-react';

class ReportDetailContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true
    }
    ReportStore.fetchReport(this.props.match.params.id).then(() => {
      ReportStore.fetchTemplate().then(() => {
        this.setState({ loading: false });
      });
    })
  }

  renderTemplate = (item, deep) => {
    console.log(item);
    if(!item.title) return;
    return(
      <div>
        <label>{item.title}</label>
        {this.renderTemplateComponent(item.type, item.content, deep)}
      </div>
    )
  }

  renderTemplateComponent = (type, content, deep) => {
    switch(type){
      case 0:
        return content.sub.map((item => this.renderTemplate(item, deep)));
      case 1:
        return (
          <input placeholder={content.placeholder}/>
        )
      case 2:
        return (
          <Table
            bordered
            columns={content.column}
          />
        )
    }
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderTemplate(ReportStore.templateContent, 0)}
      </div>
    );
  }
}

export default ReportDetailContainer;
