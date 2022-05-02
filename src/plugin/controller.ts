import {map} from 'lodash';
import {postToServer} from '../req/requests';
import {
    getAllLeaves,
    getAllParentValue,
    getParentTrees,
    getChildrenStyles,
    createTree,
    getNodes,
} from '../plugin/treeFunctions';

figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
    if (msg.type === 'create-rectangles') {
        let node = figma.currentPage.selection[0];
        processNode(node);
        // This is how figma responds back to the ui
        figma.ui.postMessage({
            type: 'create-rectangles',
            message: `Created ${msg.count} Rectangles`,
        });

        // browser native post request without axios
        figma.closePlugin();
    }
};

const processNode = (node: SceneNode) => {
    var toPost = null;
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
            type: child.type,
            children: child.children === undefined ? [] : child.children,
        };
    });

    console.log('parsed nodes ', parsedNodes);
    var parentList = getAllParentValue(parsedNodes, node);
    console.log('parent list ', parentList);
    var childlessList = getAllLeaves(parsedNodes);
    console.log('childless list ', childlessList);

    var treeList = getParentTrees(parentList, parsedNodes);
    console.log('tree list ', treeList);

    var finalTree = createTree(treeList);
    console.log('tree ', finalTree);
    var currstyles = {};
    for (let i = 0; i < childlessList.length; i++) {
        let child = figma.currentPage.findOne((n) => n.id === childlessList[i].id);
        currstyles = getChildrenStyles(child);
        console.log('styles ', child.name, currstyles);
    }

    toPost = currstyles;
    postToServer(toPost);
};
