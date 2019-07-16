import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'

import App from 'App';

describe('home page', () => {
    test('it renders the list of features of the app', () => {
        
        const tree = (
            <MemoryRouter initialEntries={["/"]}>
                <App testing={true}/>
            </MemoryRouter>
        );

        const {container} = render(tree);

        expect(container.getElementsByTagName("h1")[0].innerHTML).toBe("Systematic Literature Review manager");

    })
})