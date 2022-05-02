import {filter, uniqBy} from 'lodash';

export const getNodes = (node: SceneNode) => {
    let nodes = [];
    if ((node.type === 'INSTANCE' || node.type === 'FRAME') && node.children) {
        for (let i = 0; i < node.children.length; i++) {
            nodes.push(node.children[i]);
            nodes = nodes.concat(getNodes(node.children[i]));
        }
    }
    return nodes;
};

export const getAllLeaves = (treeList: any) => {
    var leaves = [];
    for (let i = 0; i < treeList.length; i++) {
        if (treeList[i]?.children.length === 0) {
            leaves.push(treeList[i]);
        }
    }
    return leaves;
};

export const getAllParentValue = (nodeList: any, node: any) => {
    let parentList = [{name: node.name, id: node.id, type: node.type, isRoot: true}];
    for (let i = 0; i < nodeList.length; i++) {
        parentList.push({
            name: nodeList[i].parent.name,
            id: nodeList[i].parent.id,
            type: nodeList[i].type,
            isRoot: false,
        });
    }
    //make a set of parent values
    var uniqueParents = uniqBy(parentList, 'id');

    return uniqueParents;
};

export const getParentTrees = (ParentList: any, nodeList: any) => {
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

export const getRoot = async (treeList: any) => {
    var root = {children: Array, parent: Array};

    for (let i = 0; i < treeList.length; i++) {
        if (treeList[i].isRoot) {
            root = treeList[i];
        }
    }
    var clonedRoot = JSON.parse(JSON.stringify(root));
    return clonedRoot;
};

export const createTree = (treeList: any) => {
    getRoot(treeList).then((res) => {
        console.log('root ', res);
    });
};

export const getChildrenStyles = (node: any) => {
    const fills = node?.fills;
    // deepclone fills
    const fillsClone = JSON.parse(JSON.stringify(fills));
    const background = rgbToHex(fillsClone[0]?.color.r, fillsClone[0]?.color.g, fillsClone[0]?.color.b);
    const strokes = node?.strokes;
    const effects = node?.effects;
    const borderRadius = node?.cornerRadius;
    // console.log("node", fillsClone, background, strokes, effects, children)
    const style = {
        fills: fillsClone,
        background: background,
        strokes: strokes,
        effects: effects,
        borderRadius: borderRadius,
    };
    return style;
};

function rgbToHex(r: any, g: any, b: any) {
    return (
        '#' +
        ((1 << 24) + (Math.round(255 * r) << 16) + (Math.round(255 * g) << 8) + Math.round(255 * b))
            .toString(16)
            .slice(1)
    );
}
