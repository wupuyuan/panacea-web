import React, {Component, useState} from 'react'
import {addInstance, detailAssetTemplate, findInstance} from '../../../../util/rpcUtils';
import moment from 'moment';
import {Table, Button, Modal, Input, InputNumber, Select, Form, DatePicker} from 'antd';
import styles from './index.less'
import {SearchOutlined, DeleteOutlined} from "@ant-design/icons";
import {isNotEmpty} from "../../../../util/toolUtils";

const {RangePicker} = DatePicker;

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            tableData: [],
            showCreate: false
        }
    }

    formRef = React.createRef();

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps != this.props) {
            this.loadInstances();
        }
    }

    onDeleteClick = (record) => {
        console.log("delete -->", record);
    }

    loadInstances = () => {
        let templateId = this.props.selectedKey;
        let self = this;
        // 先加载模板生成列
        detailAssetTemplate({id: templateId}).then(res => {
            let parameters = res.parameters;
            let columns = [];
            columns.push({
                title: 'id',
                dataIndex: 'id',
                key: 'id',
            });
            columns.push({
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            });

            if (isNotEmpty(parameters)) {
                parameters.forEach((parameter) => {
                    columns.push({
                            title: parameter.name,
                            dataIndex: parameter.id,
                            key: parameter.id
                        }
                    )
                })
            }
            columns.push({
                title: '操作',
                key: 'action',
                render: (_, record) => (
                    <Button shape="circle" icon={<DeleteOutlined/>} size="small"
                            onClick={() => this.onDeleteClick(record)}/>
                ),
            });

            // 查询实力
            findInstance({templateId: templateId}).then(res => {
                let tableData = [];
                if (isNotEmpty(res)) {
                    res.forEach((ins) => {
                        let item = {
                            id: ins.instance.id,
                            name: ins.instance.name,
                        }

                        let keys = Object.keys(ins.values);
                        if (isNotEmpty(keys)) {
                            keys.forEach((key) => {
                                item[key] = ins.values[key]
                            })
                        }

                        tableData.push(item);
                    })
                }

                this.setState({
                    parameters: parameters,
                    columns: columns,
                    tableData: tableData,
                })
            })
        })
    }

    onShowModalClick = () => {
        this.setState({
            showCreate: true
        })
    }

    onCancelClick = () => {
        this.setState({
            showCreate: false
        })
    }

    onOKClick = () => {
        let self = this;
        let templateId = this.props.selectedKey;
        this.formRef.current.validateFields()
            .then(values => {
                values.templateId = templateId;

                let instance = {
                    name: values.name,
                    templateId: values.templateId,
                    rfId: "123",
                    phyId: "abc",
                };

                let args = {};
                self.state.parameters.forEach((parameter) => {
                    let value = values[parameter.id]
                    if (value != null) {
                        if (parameter.type == 3) {
                            value = value.valueOf();
                        }

                        args[parameter.id] = value;
                    }
                })

                let body = {
                    instance: instance,
                    values: args
                }

                addInstance(null, body).then(res => {
                    self.setState({
                        showCreate: false
                    })
                    self.loadInstances();
                })
            });
    }


    // eslint-disable-next-line arrow-body-style
    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    }
    disabledDateTime = () => ({
        disabledHours: () => this.range(0, 24).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56],
    })

    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }


    getFormItems = () => {
        let ret = [];

        if (this.state.parameters) {
            ret.push(
                <Form.Item label="名称" name="name" rules={[{required: true, message: '请输入名称!'}]}>
                    <Input placeholder="请输入名称"/>
                </Form.Item>
            )

            this.state.parameters.forEach((parameter) => {
                let name = parameter.name;
                let rules = [];

                if (parameter.required == 1) {
                    rules.push({
                        required: true,
                        message: name + "不能为空！"
                    })
                } else {
                    rules.push({
                        required: false,
                    })
                }
                if (parameter.type == 1) {
                    ret.push(
                        <Form.Item label={name} name={parameter.id} rules={rules}>
                            <Input/>
                        </Form.Item>
                    )
                } else if (parameter.type == 2) {
                    ret.push(
                        <Form.Item label={name} name={parameter.id} rules={rules}>
                            <InputNumber/>
                        </Form.Item>
                    )
                } else if (parameter.type == 3) {
                    ret.push(
                        <Form.Item label={name} name={parameter.id} rules={rules}>
                            <DatePicker
                                format="YYYY-MM-DD HH:mm:ss"
                                disabledDate={(d) => this.disabledDate(d)}
                                disabledTime={() => this.disabledDateTime()}
                                showTime={{
                                    defaultValue: moment('00:00:00', 'HH:mm:ss'),
                                }}
                            />
                        </Form.Item>
                    )
                } else if (parameter.type == 4) {
                    ret.push(
                        <Form.Item label={name} name={parameter.id} rules={rules}>
                            <Select options={[
                                {
                                    value: '张三',
                                    label: '张三',
                                },
                                {
                                    value: '李四',
                                    label: '李四',
                                }
                            ]}
                            />
                        </Form.Item>
                    )
                } else if (parameter.type == 5) {
                    ret.push(
                        <Form.Item label={name} name={parameter.id} rules={rules}>
                            <Select options={[
                                {
                                    value: '卓欧',
                                    label: '卓欧',
                                },
                                {
                                    value: '后勤',
                                    label: '后勤',
                                }
                            ]}
                            />
                        </Form.Item>
                    )
                }
            })
        }
        return ret;
    }

    render() {
        return <div className={styles.body}>
            <div className={styles.button}>
                <Button type="primary" onClick={() => this.onShowModalClick()}>添加</Button>
            </div>
            <Table columns={this.state.columns} size="middle" bordered dataSource={this.state.tableData}/>

            <Modal title="添加实例" closable={false} destroyOnClose={true} maskClosable={false}
                   cancelText="取消" okText="确定" open={this.state.showCreate}
                   onCancel={() => this.onCancelClick()}
                   onOk={() => this.onOKClick()}>
                <Form name="instance" ref={this.formRef} labelCol={{span: 4}} wrapperCol={{span: 16}}
                      autoComplete="off" initialValues={{required: 1,}}>
                    {this.getFormItems()}
                </Form>
            </Modal>
        </div>
    }
}