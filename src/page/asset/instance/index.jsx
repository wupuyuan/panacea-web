import React, {Component, useState} from 'react'
import styles from "./index.less";
import TreeSide from "../treeSide";
import Container from "./container";


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
                    <TreeSide onSelectedCallback={this.onSelectedCallback} showAction={false}/>
                </div>
                <div className={styles.right}>
                    <Container selectedKey={this.state.selectedKey}/>
                </div>
            </div>
        )
    }
}