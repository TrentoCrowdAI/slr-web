import React from 'react';
import { render } from '@testing-library/react';

import {testWrap} from 'utils/testUtils';

import Image from 'components/modules/image';
import Notification from 'components/modules/notification';

describe('image component', () => {

    test('it renders a placeholder image when image doesn\'t exist', () => {

        const {container} = render(<Image className={"test"} alt={"test"} src={undefined}/>);

        expect(container.getElementsByClassName("st1-image-error")[0]).toBeDefined();

    })

})

describe('notification component', () => {

    test('it renders a context notification text', () => {

        const {container} = render(
            //you put the component you want to test as a testWrap argument
            testWrap(<Notification/>)
        );

        expect(container.getElementsByClassName("message-content")[0].innerHTML).toBe("this is a test!"); //this text notification is set by default in the context once testing is started
        
    })

})