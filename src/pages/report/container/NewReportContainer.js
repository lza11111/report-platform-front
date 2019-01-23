import React, { Component } from 'react';
import { Button } from 'antd';

import ReportDetailContainer from './ReportDetailContainer';

class NewReportContainer extends Component {
  render() {
    return (
      <ReportDetailContainer
        templateId={this.props.match.params.id}
        isNew
      />
    );
  }
}

export default NewReportContainer;
