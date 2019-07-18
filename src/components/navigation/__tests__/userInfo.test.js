import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'

import {testWrap} from 'utils/testUtils';

import App from 'App';
import UserInfo from 'components/navigation/userInfo';

describe('User info', () => {
    test('it renders the user info', () => {

        const {container} = render(testWrap(<UserInfo/>));
        
        expect(container.getElementsByClassName("name")[0].innerHTML).toBe("bob");
        expect(container.getElementsByClassName("surname")[0].innerHTML).toBe("man");
    })
  })