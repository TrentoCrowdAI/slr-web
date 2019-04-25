import React, {useEffect, useState, useContext} from "react";
import { Formik, Form, Field } from "formik";
import { string } from 'yup';

import {projectsDao} from 'src/dao/projects.dao';

import CloseButton from 'src/components/svg/closeButton';

import { AppContext } from 'src/components/providers/appProvider'

/**
 * this is the form for create or edit the project
 * @param props.project  project object if we want to update a old project
 * @param null if we want to create a new project
 */
function PaperForm(props) {

    let yup = require('yup');

    const paperValidationSchema = yup.object().shape({
        title: yup.string().required('please enter a title'),
        author: yup.string().required('please enter an author'),
        date: yup.string().required('please enter a date'),
        abstract: yup.string().required('please enter the abstract')
    });

    //get data from global context
    const appConsumer = useContext(AppContext);

    return (
        <>
        <Formik
            initialValues={{ title: '', abstract: '', author: '', coauthors: '', date: ''}}
            validationSchema={paperValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
                }, 400);
            }}
            validateOnChange={false}
            validateOnBlur={false}
        >
        {({ errors, isSubmitting }) => (
            <Form className="new-paper-form">
                <Field
                    style={{border: (errors.title) ? "1px solid red" : ""}}
                    id="title"
                    name="title"
                    type="text" 
                    placeholder="paper title"/>
                <div className="new-paper-form-ad">
                    <div>
                        <Field
                            style={{border: (errors.author) ? "1px solid red" : ""}}
                            name="author"
                            type="text" 
                            placeholder="paper author"/>
                        <Field 
                            name="coauthors"
                            type="text" 
                            placeholder="paper co-authors;"/>
                    </div>
                    <Field 
                        style={{border: (errors.date) ? "1px solid red" : ""}}
                        name="date"
                        type="date"/>
                </div>
                <Field
                    style={{border: (errors.abstract) ? "1px solid red" : ""}}
                    name="abstract"
                    placeholder="paper abstract"
                    component="textarea"/>
                <button type="submit" disabled={isSubmitting}>Add paper</button>
            </Form>
        )}
        </Formik>
        </>
    );


}


export default PaperForm;