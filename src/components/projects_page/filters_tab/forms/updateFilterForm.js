import React, {useContext, useEffect, useState} from "react";
import { Formik, Form, Field } from "formik";

import CloseButton from 'components/svg/closeButton';
import {AppContext} from 'components/providers/appProvider';

import {projectFiltersDao} from 'dao/projectFilters.dao';


const UpdateFilterForm = function ({project_id, filter, setFilter, yup, setEditing}) {

    console.log(filter.data);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //validation schema
    const predicateValidationSchema = yup.object().shape({
        predicate: yup.string().required('please enter a question'),
        inclusion_description: yup.string().required('please enter the positive answer'),
        exclusion_description: yup.string().required('please enter the neagative answer')
    });

    return (
        <Formik
            initialValues={{predicate: filter.data.predicate, inclusion_description: filter.data.inclusion_description, exclusion_description: filter.data.exclusion_description}}
            validationSchema={predicateValidationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                let bodyData = {predicate: values.predicate, inclusion_description: values.inclusion_description, exclusion_description: values.exclusion_description};
                
                //call dao
                let res = await projectFiltersDao.putFilter(filter.id, {project_id, ...bodyData});

                //empty string is the response from the dao layer in case of success(rember that empty string is a falsy value)
                if (res === "") {
                    setFilter({id: filter.id, data: {...bodyData}});
                }
                //error checking
                //if is other error
                else if (res && res.message) {
                    //pass error object to global context
                    appConsumer.setError(res);
                }
                
                setSubmitting(false);
                setEditing(false);
            }}
            validateOnBlur={false}
        >
        {function ({ errors, touched, isSubmitting, setErrors, validateField, handleChange }) {
            let output = "";
            output = (
            <Form className="update-filter-card">
                <button type="button" className="close-btn" onClick={(e) => {
                    setEditing(false);
                }}><CloseButton/></button>
                <Field
                    style={{borderBottom : (errors.predicate && touched.predicate) ? "solid 1px #d81e1e" : ""}}
                    name="predicate"
                    type="text" 
                    placeholder="Type a question, predicate, ..."
                    onChange={(e) => {handleChange(e); validateField('predicate')}}/>
                <div className="textareas-description-wrapper">
                    <div>
                        Positive answer
                    </div>
                    <div>
                        Negative answer
                    </div>
                </div>
                <div className="textareas-wrapper">
                    <Field
                        style={{borderBottom : (errors.inclusion_description && touched.inclusion_description) ? "solid 1px #d81e1e" : ""}}
                        name="inclusion_description"
                        component="textarea"
                        placeholder="Type what the answer should include"/>
                    <Field
                        style={{borderBottom : (errors.exclusion_description && touched.exclusion_description) ? "solid 1px #d81e1e" : ""}}
                        name="exclusion_description"
                        component="textarea"
                        placeholder="Type what the answer should not include"/>
                </div>
                <button type="submit" disabled={isSubmitting || 
                    ((errors.predicate && touched.predicate) ||
                    (errors.inclusion_description && touched.inclusion_description)        ||
                    (errors.exclusion_description && touched.exclusion_description))}>Update Filter</button>
            </Form>
        );
        return output;
        }}
        </Formik>
    );

};

export default UpdateFilterForm;