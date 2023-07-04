import React, {Component, useState} from 'react'
import {Table, Button, Modal} from 'antd';
import styles from './index.less'
import {SearchOutlined} from '@ant-design/icons';
import View from './view'

const dataSource = [
    {
        id: "12345",
        name: 'test',
        key: "poiuy",
        version: 0,
        type: 1,
    },
    {
        id: "abcdef",
        name: 'test2222',
        key: "fasfasfd",
        version: 0,
        type: 3,
    },
]

export default class App extends Component {
    columns = [
        {
            title: '索引',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '流程名',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: 'key',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: '版本号',
            dataIndex: 'version',
            key: 'version',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (value) => {
                if (value == '1') {
                    return '申领'
                } else if (value == '2') {
                    return '工单'
                } else {
                    return '其它'
                }
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Button shape="circle" icon={<SearchOutlined/>} onClick={() => this.showDetailViewClick(record)}/>
            ),
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            showCreateView: false,
            showDetailView: false
        }
    }

    showCreateViewClick = () => {
        this.setState({
            showCreateView: true
        })
    }

    confirmCreate() {
        this.setState({
            showCreateView: false
        })
    }

    closeCreateViewClick = () => {
        this.setState({
            showCreateView: false
        })
    }

    showDetailViewClick = (record) => {
        this.setState({
            showDetailView: true
        })
    };

    closeDetailViewClick = () => {
        this.setState({
            showDetailView: false
        })
    }

    isShow = (key) => {
        return this.state ? this.state[key] : false
    }

    render() {
        return (
            <div>
                <div className={styles.createButton}>
                    <Button type="primary" onClick={() => this.showCreateViewClick()}>新建</Button>
                </div>

                <Table columns={this.columns} dataSource={dataSource}/>
                <Modal title="创建工作流模板"
                       closable={true} destroyOnClose={true} maskClosable={false} keyboard={false}
                       style={{top: 5}}
                       width={document.body.offsetWidth}
                       open={this.isShow("showCreateView")}
                       onOk={this.confirmCreate.bind(this)}
                       onCancel={() => this.closeCreateViewClick()}
                >
                    <View/>
                </Modal>

                <Modal title="工作流模板详情" closable={true} destroyOnClose={true} maskClosable={false} footer={false}
                       open={this.isShow("showDetailView")}
                       onCancel={() => this.closeDetailViewClick()}>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </div>
        )
    }
}

