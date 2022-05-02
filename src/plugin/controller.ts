import {filter, map, uniqBy} from 'lodash';

figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
    if (msg.type === 'create-rectangles') {
        let node = figma.currentPage.selection[0];
        var myNodes = getNodes(node);
        console.log('all nodes ', myNodes);

        var parsedNodes = map(myNodes, (child) => {
            return {
                name: child.name,
                id: child.id,
                parent: {
                    id: child.parent.id,
                    name: child.parent.name,
                },
                children: child.children === undefined ? [] : child.children,
            };
        });

        console.log('parsed nodes ', parsedNodes);
        var parentList = getAllParentValue(parsedNodes, node);
        console.log('parent list ', parentList);

        var treeList = getParentTrees(parentList, parsedNodes);
        console.log('tree list ', treeList);

        var finalTree = createTree(treeList);
        console.log('tree ', finalTree);

        // This is how figma responds back to the ui
        figma.ui.postMessage({
            type: 'create-rectangles',
            message: `Created ${msg.count} Rectangles`,
        });
    }

    figma.closePlugin();
};
//function to return parsed tree of nodes
function getNodes(node) {
    let nodes = [];
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            nodes.push(node.children[i]);
            nodes = nodes.concat(getNodes(node.children[i]));
        }
    }
    return nodes;
}

const getAllParentValue = (nodeList, node) => {
    let parentList = [{name: node.name, id: node.id, isRoot: true}];
    for (let i = 0; i < nodeList.length; i++) {
        parentList.push({name: nodeList[i].parent.name, id: nodeList[i].parent.id, isRoot: false});
    }
    //make a set of parent values
    var uniqueParents = uniqBy(parentList, 'id');

    return uniqueParents;
};

const getParentTrees = (ParentList, nodeList) => {
    var subtrees = [];
    for (let i = 0; i < ParentList.length; i++) {
        var currentParent = ParentList[i];
        var childrenNodes = filter(nodeList, (o) => {
            return o.parent.id === currentParent.id;
        });
        subtrees.push({
            ...currentParent,
            children: childrenNodes,
        });
    }
    return subtrees;
};

const getRoot = async (treeList) => {
    var root = {children: Array, parent: Array};

    for (let i = 0; i < treeList.length; i++) {
        if (treeList[i].isRoot) {
            root = treeList[i];
        }
    }
    var clonedRoot = JSON.parse(JSON.stringify(root));
    return clonedRoot;
};

const createTree = (treeList) => {
    getRoot(treeList).then((res) => {
        console.log('root ', res);
    });
};

const dummyNode = {
    name: 'top-level-node',
    type: 'COMPONENT',
    id: 'top-level-node',
    children: [
        {
            name: 'child-node-1',
            type: 'COMPONENT',
            id: 'child-node-1',
            parent: {
                name: 'top-level-node',
                id: 'top-level-node',
            },
            children: [
                {
                    name: 'child-node-1-1',
                    type: 'COMPONENT',
                    id: 'grandchild-node-1',
                    parent: {name: 'child-node-1', id: 'child-node-1'},
                    children: [
                        {
                            name: 'child-node-1-1-1',
                            type: 'COMPONENT',
                            id: 'greatgrandchild-node-1',
                            parent: {name: 'child-node-1-1', id: 'grandchild-node-1'},
                            children: [],
                        },
                    ],
                },
                {
                    name: 'child-node-1-2',
                    type: 'COMPONENT',
                    id: 'grandchild-node-2',
                    parent: {name: 'child-node-1', id: 'child-node-1'},
                    children: [],
                },
            ],
        },
        {
            name: 'child-node-2',
            type: 'COMPONENT',
            id: 'child-node-2',
            parent: {name: 'top-level-node', id: 'top-level-node'},
            children: [],
        },
    ],
};

// const parseTree = (node) => {
//     let nodes = [];
//     if (node.children) {
//         for (let i = 0; i < node.children.length; i++) {
//             nodes.push(node.children[i]);
//             nodes = nodes.concat(parseTree(node.children[i]));
//         }
//     }
//     return nodes;
// }

// function selectFirstChildOfNode(node: SceneNode) {
//     // Don't forget to check that something is selected!
//     if (node.type === "GROUP" && node.children.length > 0) {
//         //   page.selection = [node.children[0]]
//         for (let i = 0; i < node.children.length; i++) {
//             // if (node.children[i].type === "GROUP") {
//             console.log("node.children", i, node.children[i])
//             getChildrenStyles(node.children[i])
//         }
//     } else if (node.type === "COMPONENT") {
//         getChildrenStyles(node)
//     }
// }

// const getChildrenStyles = (node: SceneNode) => {
//     const fills = node.type === "COMPONENT" && node.fills
//     // deepclone fills
//     const fillsClone = JSON.parse(JSON.stringify(fills))
//     const background = rgbToHex(fillsClone[0].color.r, fillsClone[0].color.g, fillsClone[0].color.b)
//     const strokes = node.type === "COMPONENT" && node.strokes
//     const effects = node.type === "COMPONENT" && node.effects
//     const children = node.type === "COMPONENT" && node.children
//     console.log("node", fillsClone, background, strokes, effects, children)
// }

// //function to convert rgb to hex
// function rgbToHex(r: any, g: any, b: any) {
//     return "#" + ((1 << 24) + (Math.round(255 * r) << 16) + (Math.round(255 * g) << 8) + Math.round(255 * b)).toString(16).slice(1);
// }
