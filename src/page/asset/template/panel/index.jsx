import React, {Component, useState} from 'react'
import {detailAssetTemplate, addAssetTemplateParameter, deleteAssetTemplateParameter} from '../../../../util/rpcUtils';
import {Table, Button, Modal, Input, Radio, Select, Form} from 'antd';
import styles from './index.less'
import {SearchOutlined, DeleteOutlined} from "@ant-design/icons";
import {timeStampTurnTime} from "../../../../util/toolUtils";

const {TextArea} = Input;

export default class App extends Component {
    columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '属性名',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (value) => {
                if (value == '1') {
                    return '字符'
                } else if (value == '2') {
                    return '数字'
                } else if (value == '3') {
                    return '时间'
                } else if (value == '4') {
                    return '人'
                } else if (value == '5') {
                    return '部门'
                } else {
                    return 'other'
                }
            }
        },
        {
            title: '必填',
            dataIndex: 'required',
            key: 'required',
            render: (value) => {
                if (value == '1') {
                    return '是'
                } else if (value == '2') {
                    return '否'
                } else {
                    return '其它'
                }
            }
        },
        {
            title: '来源',
            key: 'source',
            render: (_, record) => (
                record.templateId == this.props.selectedKey ?
                    <span>自身</span>
                    :
                    <span>继承</span>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                record.templateId == this.props.selectedKey ?
                    <Button shape="circle" icon={<DeleteOutlined/>} size="small"
                            onClick={() => this.deleteParameter(record)}/>
                    :
                    null
            ),
        },
    ];

    constructor(props) {
        super(props);
        this.state = {showCreate: false}
    }

    formRef = React.createRef();

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps != this.props) {
            this.loadDetail();
        }
    }

    loadDetail = () => {
        let id = this.props.selectedKey;
        detailAssetTemplate({id: id}).then(res => {
            this.setState({
                detail: res,
                showCreate: false
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
                addAssetTemplateParameter(null, values).then(res => {
                    self.loadDetail();
                })
            });
    }

    deleteParameter = (record) => {
        let self = this;
        deleteAssetTemplateParameter({id: record.id}).then(res => {
            self.loadDetail();
        })
    }

    render() {
        return (
            this.state.detail ?
                <div className={styles.body}>
                    <div className={styles.top}>
                        <div className={styles.title}>
                            {this.state.detail.template.name}
                        </div>
                        <div className={styles.info}>
                            <div>
                                <div className={styles.row}>
                                    <div className={styles.name}>创建人:</div>
                                    <div className={styles.value}>{this.state.detail.template.createPerson}</div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.name}>创建时间:</div>
                                    <div className={styles.value}>
                                        {timeStampTurnTime(this.state.detail.template.createTime)}
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.name}>更新人:</div>
                                    <div className={styles.value}>{this.state.detail.template.updatePerson}</div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.name}>更新时间:</div>
                                    <div className={styles.value}>
                                        {timeStampTurnTime(this.state.detail.template.updateTime)}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.name}>描述:</div>
                                <TextArea rows={4} disabled={true}
                                          value={this.state.detail.template.description}/>
                            </div>
                        </div>


                    </div>
                    <div className={styles.bottom}>
                        <div className={styles.button}>
                            <Button type="primary" onClick={() => this.onShowModalClick()}>添加</Button>
                        </div>
                        <div>
                            <Table columns={this.columns} size="middle" bordered
                                   dataSource={this.state.detail ? this.state.detail.parameters : null}/>
                        </div>
                    </div>
                    <Modal title="添加属性" closable={false} destroyOnClose={true} maskClosable={false}
                           cancelText="取消" okText="确定" open={this.state.showCreate}
                           onCancel={() => this.onCancelClick()}
                           onOk={() => this.onOKClick()}>
                        <Form name="basic" ref={this.formRef} labelCol={{span: 4}} wrapperCol={{span: 16}}
                              autoComplete="off" initialValues={{required: 1,}}>
                            <Form.Item label="名称" name="name" rules={[{required: true, message: '请输入名称!',},]}>
                                <Input placeholder="请输入名称"/>
                            </Form.Item>

                            <Form.Item label="必填" name="required" rules={[{required: true,},]}>
                                <Radio.Group>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item label="类型" name="type" rules={[{required: true, message: "请选择属性类型！"},]}>
                                <Select options={[
                                    {
                                        value: '1',
                                        label: '字符',
                                    },
                                    {
                                        value: '2',
                                        label: '数字',
                                    },
                                    {
                                        value: '3',
                                        label: '时间',
                                    },
                                    {
                                        value: '4',
                                        label: '人',
                                    },
                                    {
                                        value: '5',
                                        label: '部门',
                                    },
                                ]}
                                />
                            </Form.Item>

                            <Form.Item label="描述" name="description" rules={[{required: false,},]}>
                                <TextArea placeholder="请输入描述" autoSize={{minRows: 3, maxRows: 5,}}/>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
                :
                <div className={styles.body}>
                    index
                </div>
        )
    }
}