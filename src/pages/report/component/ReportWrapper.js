import React from 'react';
import { Card, Row, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';


const ReportWrapper = ({ children, title, wrapperClassName, deep }) => {
  switch (deep) {
    case 0:
      return (
        <PageHeaderWrapper title={title} wrapperClassName={wrapperClassName}>
          {children}
        </PageHeaderWrapper>
      )
    case 1:
      return (
        <Card title={title} className={wrapperClassName} bordered={false}>
          {children}
        </Card>
      )
    case 2:
      return (
        <Row gutter={16}>
          <Col lg={24} md={24} sm={24}>
            <label className={wrapperClassName}>{title}</label>
            {children}
          </Col>
        </Row>
      )
    default:
        return null;
  }
}

export default ReportWrapper;