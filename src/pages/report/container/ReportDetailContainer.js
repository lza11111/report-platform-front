import React, { Component } from 'react';
import { Button } from 'antd';
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
      this.setState({ loading: false });
    })
  }
  render() {
    return (
      <div className={styles.container}>
        <label>{JSON.stringify(ReportStore.reportContent)}</label>
      </div>
    );
  }
}

export default ReportDetailContainer;
