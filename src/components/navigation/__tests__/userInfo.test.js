import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'

import App from 'App';

describe('User info', () => {
    test('it renders the user info', () => {

        const tree = (
            <MemoryRouter initialEntries={["/"]}>
                <App testing={true}/>
            </MemoryRouter>
        );

        const {container} = render(tree);
        
        expect(container.getElementsByClassName("name")[0].innerHTML).toBe("bob");
        expect(container.getElementsByClassName("surname")[0].innerHTML).toBe("man");
    })
  })