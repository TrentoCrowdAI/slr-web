import React, {useEffect, useState, useContext} from "react";
import { Formik, Form, Field } from "formik";

import {projectPapersDao} from 'dao/projectPapers.dao'

import Select from 'components/forms/selectformik';

import { AppContext } from 'components/providers/appProvider'

//order options
const paperType = [
    { value: 'article', label: 'article' },
    { value: 'book_chapter', label: 'book chapter' },
    { value: 'other', label: 'other' }
  ];

/**
 * this is the form for create or edit the project
 * @param props.project  project object if we want to update a old project
 * @param null if we want to create a new project
 */
function PaperForm(props) {

    let yup = require('yup');

    const paperValidationSchema = yup.object().shape({
        title: yup.string().required('please enter a title'),
        authors: yup.string().required('please enter an author'),
        eid: yup.string().required('please enter the paper eid'),
        date: yup.string().required('please enter a date'),
        //document_type: yup.string().required('please enter a paper type'),
        abstract: yup.string().required('please enter the abstract')
    });

    //get data from global context
    const appConsumer = useContext(AppContext);

    return (
        <>
        <Formik
            initialValues={{ title: '', eid:'', authors: '', document_type: '', date: '', abstract: ''}}
            validationSchema={paperValidationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                const paperData = {...values, 
                    year: values.date.substr(0, 4), 
                    source_title: values.title, 
                    link: "custom_paper", 
                    source: "slr_custom_papers", 
                    abstract_structured: "0",
                    filter_oa_include: "0",
                    filter_study_include: "0",
                    notes: ""}
                console.log(paperData);
                
                let res = await projectPapersDao.postPaperIntoProject({
                    paper: paperData, project_id: props.projectId
                });
                //error checking
                if (res && res.message) {
                    //pass error object to global context
                    appConsumer.setError(res);
                }else{
                    props.history.push(props.url);
                }
                setSubmitting(false);
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
                            style={{border: (errors.authors) ? "1px solid red" : ""}}
                            name="authors"
                            type="text" 
                            placeholder="paper author"/>
                        <Field
                            style={{border: (errors.eid) ? "1px solid red" : ""}}
                            name="eid"
                            type="text" 
                            placeholder="paper EID"/>
                    </div>
                    <div>
                        <Field 
                            style={{border: (errors.date) ? "1px solid red" : ""}}
                            name="date"
                            type="date"/>
                        <Field
                            name="document_type"
                            render={({ field, form }) => (
                                    <Select options={paperType} {...field} form={form}/>
                            )}
                        />
                    </div>
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