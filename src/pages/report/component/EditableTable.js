import React from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import request from '@/utils/request';

//TODO: Remove ReportStore
import ReportStore from '../store/ReportStore';

import styles from '../style/EditableTable.less';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  componentDidMount() {
    // if (this.props.editable) {
      console.log("bind success!");
      document.addEventListener('click', this.handleClickOutside, true);
    // }
  }

  componentWillUnmount() {
    // if (this.props.editable) {
      console.log("unbind success!");
      document.removeEventListener('click', this.handleClickOutside, true);
    // }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  handleClickOutside = e => {
    const { editing } = this.state;
    // console.log(editing,this.cell !== e.target,!this.cell.contains(e.target));
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  };

  save = () => {
    console.log("save");
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  render() {
    const { editing } = this.state;
    const { editable, dataIndex, title, record, index, handleSave, ...restProps } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              return editing ? (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `${title} is required.`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(<Input ref={node => (this.input = node)} onPressEnter={this.save} />)}
                </FormItem>
              ) : (
                <div
                  className="editable-cell-value-wrap"
                  style={{ paddingRight: 24 }}
                  onClick={this.toggleEdit}
                >
                  {restProps.children}
                </div>
              );
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.dataSource,
      count: props.dataSource.length,
    };
  }

  renderColumns = () =>{
    const { editable, columns } = this.props;
    if (editable) {
      return [
        ...columns,
        {
          title: '操作',
          dataIndex: 'operation',
          render: (text, record) =>
            this.state.dataSource.length >= 1 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                <Button type="danger">Delete</Button>
              </Popconfirm>
            ) : null,
        },
      ]
    }

    return columns;
  }
  componentWillReceiveProps(nextProps){
    if( nextProps.dataSource !== this.props.dataSource){
      this.setState({
        dataSource: nextProps.dataSource,
        count: nextProps.dataSource.length,
      });
    }
  }

  handleDelete = key => {
    const { save } = this.props;
    const dataSource = [...this.state.dataSource];
    this.setState({ 
      dataSource: dataSource.filter(item => item.key !== key) 
    }, () => save(this.state.dataSource));
  };

  handleAdd = () => {
    const { save } = this.props;
    const { count, dataSource } = this.state;
    const newData = {
      ...this.props.rowDefault,
      key: count,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    }, () => save(this.state.dataSource));
  };

  handleSave = row => {
    const { save, opreation } = this.props;
    let { count } = this.state;
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);

    // TODO: 目前hardcode几个从其他地方获取数据的接口
    if (opreation === 'ptp') {
      ReportStore.getThridPartyData(`https://ptp.hz.netease.com/api/v1.0/round/${row.resultId}/summary`)
        .then((res) => {
          console.log(res);
          let datas = [];
          for (let testData of res.data){
            console.log(testData);
            const data = {
              key: ++count,
              resultId: row.resultId,
              resultTestID:testData.test_id,
              resultTotal:testData.total,
              resultError:testData.error,
              resultrtMax:testData.response_max,
              resultrt50:testData.response50,
              resultrt70:testData.response70,
              resultrt90:testData.response90,
              resultrt99:testData.response99,
              resultrtSAvg:testData.mean_response_length,
              resultApi: testData.test_name,
              resultErrorRate: testData.err_rate,
              resultrtAvg: testData.response_ave,
              resultTps: testData.tps,
            }
            datas.push(data);
          }
          newData.splice(0, newData.length, ...datas);
          this.setState({ dataSource: newData, count: count });
          save(newData);
        })
    } else {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      this.setState({ dataSource: newData});
      save(newData);
    }
    
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns =  this.renderColumns().map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable && this.props.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={this.renderColumns()}
          pagination={false}
          expandedRowRender={this.props.expandedRowRender}
        />
        {this.props.editable ? 
        <Button onClick={this.handleAdd} type="primary" style={{ marginTop: 10, float: 'right' }}>
          新增一行
        </Button> : null}
      </div>
    );
  }
}
