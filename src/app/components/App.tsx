import * as React from 'react';
import '../styles/ui.css';
// import figma from 'figma-plugin-api';
declare function require(path: string): any;

const App = ({}) => {
    const textbox = React.useRef<HTMLInputElement>(undefined);

    const countRef = React.useCallback((element: HTMLInputElement) => {
        if (element) element.value = '5';
        textbox.current = element;
    }, []);

    const onCreate = () => {
        parent.postMessage({pluginMessage: {type: 'create-rectangles'}}, '*');
    };

    const onPost = () => {
        try {
            parent.postMessage({pluginMessage: {type: 'networkRequest'}}, '*');
        } catch (e) {
            console.log('posting error ', e);
        }
    };

    const onCancel = () => {
        parent.postMessage({pluginMessage: {type: 'cancel'}}, '*');
    };

    React.useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = (event) => {
            const {type, message} = event.data.pluginMessage;
            if (type === 'create-rectangles') {
                console.log(`Figma Says: ${message}`);
            }
        };
    }, []);

    return (
        <div>
            <img src={require('../assets/logo.svg')} />
            <h2>Rectangle Creator</h2>
            <p>
                Count: <input ref={countRef} />
            </p>
            <button id="create" onClick={onCreate}>
                Create
            </button>
            <button id="create" onClick={onPost}>
                Post
            </button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
};

export default App;
