import React from 'react';
import {Graph, Shape, Addon, FunctionExt} from '@antv/x6';
import '@antv/x6-react-shape';
import {Circle, Rect, ports, Rhombus} from './selfShape';
import graphData from './data';
// import { NodeGroup } from './selfShape';
import './shape';

const action1Style = {
    fontSize: 28,
    color: '#ff9f47',
};

export default class InitGraph {
    static graph = null;
    static stencil = null;

    static init() {
        this.graph = new Graph({
            container: document.getElementById('container'), // 画布容器
            // shift 平移
            panning: {
                enabled: true, // 画布是否可以拖动
                modifiers: 'shift', // 按住shift 可以平移
            },
            grid: true,
            // 网格
            // grid: {
            //   size: 10, // 网格大小 10px
            //   visible: true, // 绘制网格
            //   type: 'doubleMesh', // 网格类型
            //   args: [
            //     {
            //       color: 'rgba(204,204,204,0.2)', // 主网格线颜色
            //       thickness: 1, // 主网格线宽度
            //     },
            //     {
            //       // color: '#5F95FF', // 次网格线颜色
            //       thickness: 1, // 次网格线宽度
            //       factor: 4, // 主次网格线间隔
            //     },
            //   ],
            // },
            // 点选/框选
            selecting: {
                enabled: true,
                // multiple: true, // 启用多选后按住 ctrl 或 command 键点击节点实现多选。
                rubberband: true, // 启用框选
                movable: true, // 选中的节点是否可以被移动
                showNodeSelectionBox: true, // 是否显示节点的选择框，
                filter: ['groupNode'], // 'groupNode' 类型节点不能被选中
            },
            // 配置全局的连线规则
            connecting: {
                anchor: 'center', // 当连接到节点时，通过 anchor 来指定被连接的节点的锚点，默认值为 center。
                connectionPoint: 'anchor', // 指定连接点，默认值为 boundary
                allowBlank: false, // 是否允许连接到画布空白位置的点
                highlight: true, // 拖动边时，是否高亮显示所有可用的连接桩或节点
                snap: true, // 当 snap 设置为 true 时连线的过程中距离节点或者连接桩 50px 时会触发自动吸附
                // 连接的过程中创建新的边
                createEdge() {
                    return new Shape.Edge({
                        attrs: {
                            line: {
                                stroke: '#5F95FF',
                                strokeWidth: 1,
                                targetMarker: {
                                    name: 'classic',
                                    size: 8,
                                },
                            },
                        },
                        router: {
                            name: 'manhattan',
                        },
                        zIndex: 0,
                    });
                },
                // 在移动边的时候判断连接是否有效
                validateConnection({
                                       sourceView,
                                       targetView,
                                       sourceMagnet,
                                       targetMagnet,
                                   }) {
                    if (sourceView === targetView) {
                        return false;
                    }
                    if (!sourceMagnet) {
                        return false;
                    }
                    if (!targetMagnet) {
                        return false;
                    }
                    return true;
                },
            },
            // 可以通过 highlighting 选项来指定触发某种交互时的高亮样式
            highlighting: {
                magnetAvailable: {
                    name: 'stroke',
                    args: {
                        padding: 14,
                        attrs: {
                            strokeWidth: 4,
                            stroke: 'rgba(223,234,255)',
                        },
                    },
                },
            },
            snapline: true, // 启动对齐线
            history: true, // 启用撤销/重做
            // 启用剪切板
            clipboard: {
                enabled: true,
            },
            // 启用键盘快捷键
            keyboard: {
                enabled: true,
            },
            // 通过embedding可以将一个节点拖动到另一个节点中，使其成为另一节点的子节点
            embedding: {
                enabled: true,
                findParent({node}) {
                    const bbox = node.getBBox();
                    return this.getNodes().filter((node) => {
                        // 只有 data.parent 为 true 的节点才是父节点
                        const data = node.getData();
                        if (data && data.parent) {
                            const targetBBox = node.getBBox();
                            return bbox.isIntersectWithRect(targetBBox);
                        }
                        return false;
                    });
                },
            },
        });
        this.initStencil();
        this.initGraphShape();
        this.initShape();
        this.initEvent();
        return this.graph;
    }

    // 侧边栏
    static initStencil() {
        this.stencil = new Addon.Stencil({
            target: this.graph,
            title: '',
            stencilGraphWidth: 120,
            groups: [
                {
                    name: 'basic',
                    title: '基础节点',
                    graphHeight: 400,
                },
            ],
            layoutOptions: {
                columns: 1,
                columnWidth: 80,
                rowHeight: 70,
            },
        });
        const stencilContainer = document.querySelector('#stencil');
        stencilContainer?.appendChild(this.stencil.container);
    }

    // 初始化节点
    static initShape() {
        const {graph} = this;

        const start = graph.createNode({
            shape: 'flow-chart-rect',
            width: 50,
            height: 50,
            attrs: {
                body: {
                    rx: 25,
                    ry: 25,
                },
                text: {
                    textWrap: {
                        text: '开始',
                    },
                },
            },
        });

        const execute = graph.createNode({
            shape: 'flow-chart-rect',
            width: 80,
            height: 40,
            attrs: {
                body: {
                    rx: 2,
                    ry: 2,
                },
                text: {
                    textWrap: {
                        text: '审批节点',
                    },
                },
            },
        });

        const condition = graph.createNode({
            shape: 'flow-chart-rect',
            width: 40,
            height: 40,
            angle: 45,
            ports: {
                groups: {
                    top: {
                        position: {
                            name: 'top',
                            args: {
                                dx: -20,
                            },
                        },
                        attrs: {
                            circle: {
                                r: 3,
                                magnet: true,
                                stroke: '#5F95FF',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                    visibility: 'hidden',
                                },
                            },
                        },
                    },
                    right: {
                        position: {
                            name: 'right',
                            args: {
                                dy: -20,
                            },
                        },
                        attrs: {
                            circle: {
                                r: 3,
                                magnet: true,
                                stroke: '#5F95FF',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                    visibility: 'hidden',
                                },
                            },
                        },
                    },
                    bottom: {
                        position: {
                            name: 'bottom',
                            args: {
                                dx: 20,
                            },
                        },
                        attrs: {
                            circle: {
                                r: 3,
                                magnet: true,
                                stroke: '#5F95FF',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                    visibility: 'hidden',
                                },
                            },
                        },
                    },
                    left: {
                        position: {
                            name: 'left',
                            args: {
                                dy: 20,
                            },
                        },
                        attrs: {
                            circle: {
                                r: 3,
                                magnet: true,
                                stroke: '#5F95FF',
                                strokeWidth: 1,
                                fill: '#fff',
                                style: {
                                    visibility: 'hidden',
                                },
                            },
                        },
                    },
                }
            },
            attrs: {
                'edit-text': {
                    style: {
                        transform: 'rotate(-45deg)',
                    },
                },
                text: {
                    textWrap: {
                        text: '条件节点',
                    },
                    transform: 'rotate(-45deg)',
                },
            },
        });

        const end = graph.createNode({
            shape: 'flow-chart-rect',
            width: 50,
            height: 50,
            attrs: {
                body: {
                    rx: 25,
                    ry: 25,
                },
                text: {
                    textWrap: {
                        text: '结束',
                    },
                },
            },
        });

        this.stencil.load([start, execute, condition, end], 'basic');
    }

    // 画布数据
    static initGraphShape() {
        this.graph.fromJSON(graphData);
    }

    static showPorts(ports, show) {
        for (let i = 0, len = ports.length; i < len; i = i + 1) {
            ports[i].style.visibility = show ? 'visible' : 'hidden';
        }
    }

    // 初始化事件
    static initEvent() {
        const {graph} = this;
        const container = document.getElementById('container');

        const reset = () => {
            graph.drawBackground({color: '#fff'});
            const nodes = graph.getNodes();
            const edges = graph.getEdges();

            nodes.forEach((node) => {
                node.attr('body/stroke', '#000');
            });

            edges.forEach((edge) => {
                edge.attr('line/stroke', 'black');
                edge.prop('labels/0', {
                    attrs: {
                        body: {
                            stroke: 'black',
                        },
                    },
                });
            });
        };

        graph.on('node:contextmenu', ({cell, view}) => {
            const oldText = cell.attr('text/textWrap/text');
            const elem = view.container.querySelector('.x6-edit-text');
            if (elem === null) {
                return;
            }
            cell.attr('text/style/display', 'none');
            if (elem) {
                elem.style.display = '';
                elem.contentEditable = 'true';
                elem.innerText = oldText;
                elem.focus();
            }
            const onBlur = () => {
                cell.attr('text/textWrap/text', elem.innerText);
                cell.attr('text/style/display', '');
                elem.style.display = 'none';
                elem.contentEditable = 'false';
            };
            elem.addEventListener('blur', () => {
                onBlur();
                elem.removeEventListener('blur', onBlur);
            });
        });

        /**
         * 移入移出事件
         */
        graph.on(
            'node:mouseenter',
            FunctionExt.debounce(() => {
                const ports = container.querySelectorAll('.x6-port-body');
                this.showPorts(ports, true);
            }),
            500,
        );
        graph.on('node:mouseleave', () => {
            const ports = container.querySelectorAll('.x6-port-body');
            this.showPorts(ports, false);
        });

        /**
         * 监听折叠事件
         */
        graph.on('node:collapse', ({node, e}) => {
            e.stopPropagation();
            node.toggleCollapse();
            const collapsed = node.isCollapsed();
            const cells = node.getDescendants();
            cells.forEach((n) => {
                if (collapsed) {
                    n.hide();
                } else {
                    n.show();
                }
            });
        });

        /**
         * 节点嵌入
         */
        graph.on('node:embedded', ({cell}) => {
            if (cell.shape !== 'groupNode') {
                cell.toFront();
            }
        });

        /**
         * 绑定键盘backspace键
         */
        graph.bindKey('backspace', () => {
            const cells = graph.getSelectedCells();
            if (cells.length) {
                graph.removeCells(cells);
            }
        });
    }
}
