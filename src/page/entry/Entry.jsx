import React, {Component} from 'react'
import 'antd/dist/antd.min.css';
import styles from './Entry.less';
import {HomeOutlined, AccountBookOutlined, ShareAltOutlined,} from '@ant-design/icons';
import {Layout, Menu} from 'antd';
import ATemplate from "../asset/template";
import AInstance from "../asset/instance";
import WFTable from "../workflow"
import Demo from "../demo"
import Test from "../Test";

const {Header, Content, Sider} = Layout;

function getItem(label, key, icon, children) {
    return {key, icon, children, label,};
}

const items = [
    getItem('首页', 'home', <HomeOutlined/>),
    getItem('资产管理', 'asset', <AccountBookOutlined/>, [
        getItem('模板', 'asset-template'),
        getItem('实例', 'asset-instance'),
    ]),
    getItem('工作流', 'workflow', <ShareAltOutlined/>, [
        getItem('模板', 'workflow-template'),
        getItem('实例', 'workflow-instance'),
    ]),
    getItem('demo', 'demo',),
];

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: document.body.offsetHeight,
            width: document.body.offsetWidth
        }
    }

    onClick = (e) => {
        this.setState({
            routeKey: e.key
        });
    };

    switch = () => {
        if (this.state != null) {
            if (this.state.routeKey == 'workflow-template') {
                return <WFTable/>;
            } else if (this.state.routeKey == 'asset-template') {
                return <ATemplate/>;
            } else if (this.state.routeKey == 'asset-instance') {
                return <AInstance/>;
            } else if (this.state.routeKey == 'demo') {
                return <Demo/>;
            } else {
                return <div>null</div>
            }
        } else {
            return <Test/>;
        }
    }

    render() {
        return (
            <Layout style={{minHeight: this.state.height, minWidth: this.state.width}}>
                <Sider collapsible>
                    <div className={styles.logo}/>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={this.onClick}/>
                </Sider>
                <Layout>
                    <Header className={styles.header}/>
                    <Content style={{margin: '0 16px',}}>
                        <div className={styles.content}>
                            {this.switch()}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

