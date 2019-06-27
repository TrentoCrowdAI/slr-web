import React, {useContext, useEffect} from "react";
import { Formik, Form, Field } from "formik";

import CloseButton from 'components/svg/closeButton';
import {AppContext} from 'components/providers/appProvider';


const UpdateFilterForm = function ({filter, setFilter, yup, setEditing}) {

    //boolean flag for handling mount status
    let mounted = true;

    //get data from global context
    const appConsumer = useContext(AppContext);

    //effect for setting mount status to false when unmounting
    useEffect(() => {
        return () => {
            mounted = false;
        };
    }, [])

    //validation schema
    const predicateValidationSchema = yup.object().shape({
        predicate: yup.string().required('please enter a question'),
        should: yup.string().required('please enter the positive answer'),
        shouldNot: yup.string().required('please enter the neagative answer')
    });

    return (
        <Formik
            initialValues={{predicate: filter.predicate, should: filter.should, shouldNot: filter.shouldNot}}
            validationSchema={predicateValidationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                let bodyData = {predicate: values.predicate, should: values.should, shouldNot: values.shouldNot};
                setFilter({id: filter.id, ...bodyData});
                console.log("submited")
                
                //call dao
                //let res = await projectsDao.postProject(bodyData);
                /*
                //error checking
                if(mounted && res.message){
                    //pass error object to global context
                    appConsumer.setError(res);
                }else if(mounted){
                    props.history.push("/projects/" + res.id);
                }
                */
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
                        style={{borderBottom : (errors.should && touched.should) ? "solid 1px #d81e1e" : ""}}
                        name="should"
                        component="textarea"
                        placeholder="Type what the answer should include"/>
                    <Field
                        style={{borderBottom : (errors.shouldNot && touched.shouldNot) ? "solid 1px #d81e1e" : ""}}
                        name="shouldNot"
                        component="textarea"
                        placeholder="Type what the answer should not include"/>
                </div>
                <button type="submit" disabled={isSubmitting || 
                    ((errors.predicate && touched.predicate) ||
                    (errors.should && touched.should)        ||
                    (errors.shouldNot && touched.shouldNot))}>Update Filter</button>
            </Form>
        );
        return output;
        }}
        </Formik>
    );

};

export default UpdateFilterForm;