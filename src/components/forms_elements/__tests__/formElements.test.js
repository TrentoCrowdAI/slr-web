import React from 'react';
import { render, cleanup } from '@testing-library/react';

import CheckBox from 'components/forms_elements/checkbox';
import RadioBox from 'components/forms_elements/radiobox';

describe('checkbox component', () => {

    afterEach(cleanup);

    test('it renders a selected checkbox', () => {

        const {container} = render(<CheckBox val={"test"} name={"test"} label={"test"} isChecked={true} handler={() => (true)}/>);

        expect(container.getElementsByClassName("st-tick")[0]).toBeDefined();

    })

    test('it renders an un-selected checkbox', () => {

        const {container} = render(<CheckBox val={"test"} name={"test"} label={"test"} isChecked={false} handler={() => (true)}/>);

        expect(container.getElementsByClassName("st-tick")[0]).not.toBeDefined();

    })

})

describe('radiobox component', () => {

    afterEach(cleanup);

    test('it renders a selected radiobox', () => {

        const {container} = render(<RadioBox val={"test"} name={"test"} label={"test"} isChecked={true} handler={() => (true)}/>);

        expect(container.getElementsByClassName("st-circle")[0]).toBeDefined();

    })

    test('it renders an un-selected radiobox', () => {

        const {container} = render(<RadioBox val={"test"} name={"test"} label={"test"} isChecked={false} handler={() => (true)}/>);

        expect(container.getElementsByClassName("st-circle")[0]).not.toBeDefined();

    })

})