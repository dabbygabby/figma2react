import _ from 'lodash';

figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
    if (msg.type === 'create-rectangles') {
        let node = figma.currentPage.selection[0];
        getTree(node);

        // This is how figma responds back to the ui
        figma.ui.postMessage({
            type: 'create-rectangles',
            message: `Created ${msg.count} Rectangles`,
        });
    }

    figma.closePlugin();
};

//function to recursively check for children and get their styles
var tree = {};
const getTree = (node: SceneNode) => {
    var mytree = RecursiveStyle(node);
    console.log('mytree', mytree);
};

function RecursiveStyle(node: SceneNode) {
    if ((node.type === 'INSTANCE' || node.type === 'FRAME') && node.children) {
        // var level = 0
        tree[`${node.name}-${node.id}`] = _.map(node.children, (node: SceneNode) => {
            return {name: `${node.name}-${node.id}`, id: node.id};
        });
        for (let child of node.children) {
            if ((child.type === 'INSTANCE' || child.type === 'FRAME') && child.children) {
                tree[`${child.name}-${child.id}`] = _.map(child.children, (child: SceneNode) => {
                    return {name: `${child.name}-${child.id}`, id: child.id};
                });
                RecursiveStyle(child);
            }
        }
    }
    // console.log("tree ", tree)
    return tree;
}

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
