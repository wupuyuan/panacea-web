import React, {Component, useState} from 'react'
import styles from "./index.less";
import TreeSide from "../treeSide";
import Panel from "./panel";


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // 初始化选择node (root)
            selectedKey: "0"
        }
    }

    onSelectedCallback = (key) => {
        console.log("selected key = " + key);
        this.setState({
            selectedKey: key
        })
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.left}>
                    <TreeSide onSelectedCallback={this.onSelectedCallback} showAction={true}/>
                </div>
                <div className={styles.right}>
                    <Panel selectedKey={this.state.selectedKey}/>
                </div>
            </div>
        )
    }
}