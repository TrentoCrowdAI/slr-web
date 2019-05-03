import React, {useEffect, useState, useContext} from "react";
import { Formik, Form, Field } from "formik";

import {projectPapersDao} from 'dao/projectPapers.dao'

import Select from 'components/forms/selectformik';

import { AppContext } from 'components/providers/appProvider'

//order options
const paperType = [
    { value: 'article', label: 'Article' },
    { value: 'book_chapter', label: 'Book Chapter' },
    { value: 'conf_publication', label: 'Conf. Publication' }
  ];

/**
 * this is the form for create or edit the paper
 * @param props.projectId  relative project where we will insert the paper
 */
function PaperForm(props) {

    let yup = require('yup');

    //validation schema for form
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
            initialValues={{ title: (props.customPaper && props.customPaper.title) || '', 
                                eid: (props.customPaper && props.customPaper.eid) || '', 
                                authors: (props.customPaper && props.customPaper.authors) || '', 
                                document_type: (props.customPaper && props.customPaper.document_type) || '', 
                                date: (props.customPaper && props.customPaper.date) || '', 
                                abstract: (props.customPaper && props.customPaper.abstract) || ''}}
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
            validateOnBlur={false}
        >
        {({ errors, touched, isSubmitting }) => (
            <Form className="new-paper-form">
                <Field
                    style={{borderBottom: (errors.title && touched.title) ? "1px solid #d81e1e" : ""}}
                    id="title"
                    name="title"
                    type="text" 
                    placeholder="Paper Title"/>
                <div className="new-paper-form-ad">
                    <div>
                        <Field
                            style={{borderBottom: (errors.authors && touched.authors) ? "1px solid #d81e1e" : ""}}
                            name="authors"
                            type="text" 
                            placeholder="paper author"/>
                        <Field
                            style={{borderBottom: (errors.eid && touched.eid) ? "1px solid #d81e1e" : ""}}
                            name="eid"
                            type="text" 
                            placeholder="Paper EID"/>
                    </div>
                    <div>
                        <Field 
                            style={{borderBottom: (errors.date && touched.date) ? "1px solid #d81e1e" : ""}}
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
                    style={{borderBottom: (errors.abstract && touched.abstract) ? "1px solid #d81e1e" : ""}}
                    name="abstract"
                    placeholder="Paper Abstract"
                    component="textarea"/>
                <button type="submit" disabled={isSubmitting ||
                    (errors.title && touched.title) ||
                    (errors.authors && touched.authors) ||
                    (errors.eid && touched.eid) ||
                    (errors.date && touched.date) ||
                    (errors.abstract && touched.abstract)
                }>Add paper</button>
            </Form>
        )}
        </Formik>
        </>
    );


}


export default PaperForm;