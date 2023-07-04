import {Component} from "react";
import {DownOutlined, PlusSquareOutlined, MinusSquareOutlined} from '@ant-design/icons';
import {Tree, Modal, Input} from 'antd';
import styles from "./index.less";
import {isNotEmpty} from "../../../util/toolUtils";
import {findAssetTemplateChildren, addAssetTemplate} from "../../../util/rpcUtils";

const {TreeNode} = Tree;
const {TextArea} = Input;

const rootKey = "0";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 选中的key
            selectedKey: rootKey,
            // 展开的keys
            expandedKeys: [rootKey],
            // tree节点
            rootNode: {
                id: rootKey,
                name: "全部",
            }
        }
    }

    componentDidMount() {
        // 加载直属
        this.loadChildren(rootKey, [rootKey]);
    }

    // 加载某个节点的子节点
    loadChildren = (parentId, expandedKeys) => {
        findAssetTemplateChildren({id: parentId}).then(children => {
            if (isNotEmpty(children)) {
                this.flushTree(parentId, children, expandedKeys);
            }
        })
    }

    // 卸载某个节点的子节点
    unloadChildren = (parentId, expandedKeys) => {
        this.flushTree(parentId, null, expandedKeys);
    }

    // 刷新节点
    flushTree = (parentId, children, expandedKeys) => {
        let root = this.state.rootNode;
        this.flushTreeRoot(root, parentId, children, expandedKeys);
    }

    flushTreeRoot = (root, parentId, children, expandedKeys) => {
        let newRoot = this.flushTreeNodeChildren(root, parentId, children);
        this.setState({
            rootNode: newRoot,
            expandedKeys: expandedKeys,
            showCreateVew: false,
            parentId: null,
            parentName: null,
            inputValue: ""
        })
    }

    flushTreeNodeChildren = (node, parentId, children) => {
        let newNode = {
            id: node.id,
            name: node.name,
        }

        if (node.id == parentId) {
            newNode.children = children;
        } else {
            if (isNotEmpty(node.children)) {
                let list = [];
                node.children.forEach((child) => {
                    list.push(this.flushTreeNodeChildren(child, parentId, children));
                })
                newNode.children = list;
            }
        }

        return newNode;
    }

    // 节点的鼠标动作
    onMouseEnter = (id) => {
        let state = {};
        state["node_" + id] = true;
        this.setState(state);
    }

    onMouseLeave = (id) => {
        let state = {};
        state["node_" + id] = false;
        this.setState(state);
    }

    // 打开关闭创建的交互框
    showCreateView = (item) => {
        this.setState({
            showCreateVew: true,
            parentId: item.id,
            parentName: item.name,
            inputValue: "",
            description: ""
        })
    }

    closeCreateView = () => {
        this.setState({
            showCreateVew: false,
            parentId: null,
            parentName: null,
            inputValue: null,
            description: null
        })
    }

    // 输入框
    onInputChange = (e) => {
        this.setState({
            inputValue: e.target.value
        })
    }

    // 描述
    onTextChange = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    // 节点渲染
    getNode = (node) => {
        return (
            <TreeNode key={node.id} title={this.getNodeView(node)} isLeaf={false}>
                {
                    isNotEmpty(node.children) ?
                        this.getNodeChildren(node.children)
                        :
                        null
                }
            </TreeNode>
        )
    }

    getNodeChildren(list) {
        let children = [];
        if (isNotEmpty(list)) {
            list.forEach(node => {
                let child = this.getNode(node)
                children.push(child)
            })
        }
        return children;
    }

    getNodeView = (item) => {
        return <div className={styles.node}
                    onMouseEnter={() => this.onMouseEnter(item.id)}
                    onMouseLeave={() => this.onMouseLeave(item.id)}
        >
            <div onClick={() => this.onNodeClick(item.id)}>
                {item.name}
            </div>
            {
                this.props.showAction ?
                    <div className={styles.action} hidden={!this.state["node_" + item.id]}>
                        <PlusSquareOutlined onClick={() => this.showCreateView(item)}/>
                        <MinusSquareOutlined/>
                    </div>
                    :
                    null
            }
        </div>
    }

    // 树操作
    onNodeClick = (id) => {
        this.props.onSelectedCallback(id);
    }

    onTreeExpand = (expandedKeys, e) => {
        let parentId = e.node.key;

        if (e.expanded) {
            this.loadChildren(parentId, expandedKeys);
        } else {
            this.unloadChildren(parentId, expandedKeys);
        }
    }

    // 创建新类型
    onCreate = () => {
        let parentId = this.state.parentId;

        let body = {
            name: this.state.inputValue,
            parentId: parentId,
            description: this.state.description
        }

        let expandedKeys = this.state.expandedKeys;
        if (expandedKeys.indexOf(parentId) < 0) {
            let newExpandedKeys = [];
            expandedKeys.forEach((key) => {
                newExpandedKeys.push(key);
            })
            newExpandedKeys.push(parentId);
            expandedKeys = newExpandedKeys;
        }

        let self = this;
        addAssetTemplate(null, body).then(res => {
            self.loadChildren(parentId, expandedKeys);
        })
    }


    render() {
        return (
            <div className={styles.body}>
                <Tree showIcon={true} showLine={true}
                      switcherIcon={<DownOutlined/>}
                      expandedKeys={this.state.expandedKeys}
                      onExpand={(expandedKeys, node) => this.onTreeExpand(expandedKeys, node)}
                >
                    {this.getNode(this.state.rootNode)}
                </Tree>


                <Modal closable={false} maskClosable={false} destroyOnClose={true} cancelText="取消" okText="确定"
                       title={"为" + this.state.parentName + "添加子类型"}
                       open={this.state.showCreateVew}
                       onOk={() => this.onCreate()}
                       onCancel={() => this.closeCreateView()}>
                    <div style={{marginBottom: 15}}>
                        <Input placeholder="请输入名称" onChange={(e) => this.onInputChange(e)}/>
                    </div>
                    <TextArea placeholder="请输入描述" onChange={(e) => this.onTextChange(e)}
                              autoSize={{
                                  minRows: 3,
                                  maxRows: 5,
                              }}
                    />
                </Modal>
            </div>
        )
    }
}