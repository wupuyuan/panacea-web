import {Component} from "react";
import index from './index';
import {Tree, Modal, Input, Button} from 'antd';

export default class App22 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setValue: this.props.setValue
        }
    }


    onClick() {
        this.props.setValue((new Date()).getMilliseconds());
    }

    render() {
        return <div>
            <Button onClick={this.onClick.bind(this)}> 按钮</Button>
            <div>{this.props.childName}</div>
        </div>
    }
}