/* eslint-disable no-undef */
const util = importUtil();

const ele = util.createCustomElement;

window.onload = () => {
    const elementToRender = ele('div', { className: 'pane' }, 
        [
            ele('h3', {}, [document.createTextNode('To Do App')]),
            ele('button', { className: "btn btn-info", id: "newList" }, [document.createTextNode('New List')]),
            ele('div', { id: 'paneButtons' }, 
            [
                ele('button', { className: 'btn btn-outline-dark paneItems selected' }, [document.createTextNode('List 1')]),
                ele('button', { className: 'btn btn-outline-danger paneDelete' }, [document.createTextNode('List 1')]),
                ele('button', { className: 'btn btn-outline-dark paneItems' }, [document.createTextNode('List 1')]),
                ele('button', { className: 'btn btn-outline-danger paneDelete' }, [document.createTextNode('List 1')]),
            ]
            ),
        ]
    );
    document.getElementById('root').appendChild(elementToRender);
}