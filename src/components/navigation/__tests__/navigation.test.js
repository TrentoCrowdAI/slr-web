import React from 'react';
import { render } from '@testing-library/react';

import {testWrap} from 'utils/testUtils';

import UserInfo from 'components/navigation/userInfo';
import BreadCrumbs from 'components/navigation/breadCrumbs';
import NavBar from 'components/navigation/navBar';

describe('User info', () => {
    test('it renders the user info', () => {

        const {container} = render(testWrap(<UserInfo/>));
        
        expect(container.getElementsByClassName("name")[0].innerHTML).toBe("bob");
        expect(container.getElementsByClassName("surname")[0].innerHTML).toBe("man");
        
    })
})

describe('BreadCrumbs', () => {
    test('it renders the breadcrumbs of the path', () => {

        const {container} = render(testWrap(<BreadCrumbs/>, "/path/to/something"));

        //I expect to have the partial links of the path
        expect(container.getElementsByTagName("a")[0].getAttribute("href")).toBe("/");
        expect(container.getElementsByTagName("a")[1].getAttribute("href")).toBe("/path");
        expect(container.getElementsByTagName("a")[2].getAttribute("href")).toBe("/path/to");
        expect(container.getElementsByTagName("a")[3].getAttribute("href")).toBe("/path/to/something");
        
    })
})

describe('Navigation bar', () => {
    test('it renders the title context', () => {

        const {container} = render(testWrap(<NavBar/>));

        expect(container.getElementsByClassName("static-title")[0].innerHTML).toBe("HOME");
        
    })
})