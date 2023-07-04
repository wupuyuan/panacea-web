import {Component} from "react";
import {Tree, Modal, Input, Button} from 'antd';
import Pppage from './pppage'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "demo",
            childName: "zhangsan"
        }
    }


    setValue = (value) => {
        this.setState({
            value: value
        })

    }


    onClick = () => {
        this.setState({
            childName: '' + new Date()
        })
    }

    render() {
        return <div>
            <div>{this.state.value}</div>
            <Button onClick={this.onClick}> huawei</Button>
            <Pppage setValue={this.setValue} childName={this.state.childName}/>
        </div>
    }
}