import React, { Component } from 'react';
import { Button } from 'antd';

import styles from '../style.less';

class NewReportContainer extends Component {

  render() {
    return (
      <div className={styles.container}>
        <Button>文字</Button>
      </div>
    );
  }
}

export default NewReportContainer;
