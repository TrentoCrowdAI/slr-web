import React from 'react';
import { render } from '@testing-library/react';

import {testWrap} from 'utils/testUtils';

import Home from 'components/home';

describe('home page', () => {
    test('it renders the list of features of the app', () => {

        const {container} = render(testWrap(<Home/>));

        expect(container.getElementsByTagName("h1")[0].innerHTML).toBe("Systematic Literature Review manager");

    })
})