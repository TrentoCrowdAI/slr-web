import React, {useEffect, useState, useContext} from "react";
import { Formik, Form, Field } from "formik";

import {projectsDao} from 'dao/projects.dao'

import CloseButton from 'components/svg/closeButton';

import { AppContext } from 'components/providers/appProvider'

/**
 * this is the form for create or edit the project
 * @param props.project  project object if we want to update a old project
 * @param null if we want to create a new project
 */
function ProjectForm(props) {

    let yup = require('yup');

    const [touc, setTouc] = useState(false);

    const projectValidationSchema = yup.object().shape({
        name: yup.string().required('please enter a title'),
        description: yup.string().required('please enter a description')
    });

    //get data from global context
    const appConsumer = useContext(AppContext);

    return (
        <>
        <Formik
            initialValues={{ name: '', description:''}}
            validationSchema={projectValidationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                let bodyData = {name: values.name, description: values.description};
                //call dao
                let res = await projectsDao.postProject(bodyData);

                //error checking
                if(res.message){
                    //pass error object to global context
                    appConsumer.setError(res);
                }else{
                    props.history.push("/projects/" + res.id);
                }
                setSubmitting(false);
            }}
            validateOnChange={false}
            validateOnBlur={false}
        >
        {function ({ errors, touched, isSubmitting, setErrors, validateField, handleChange }) {
            let output = "";
            output = (<Form className="modal add-project" style={{visibility: (!props.visibility) ? 'hidden' : '' }}>
                <button type="button" className="close-btn" onClick={(e) => {
                    props.setVisibility(!props.visibility);
                }}><CloseButton/></button>
                <br/>
                <Field
                    className={(errors.name) ? "warning" : ""}
                    name="name"
                    type="text" 
                    placeholder="project name"
                    onChange={(e) => {handleChange(e); validateField('name')}}/>
                <br/>
                <br/>
                <Field
                    className={(errors.description) ? "warning" : ""}
                    name="description"
                    component="textarea"
                    placeholder="project description"/>
                <br/>
                <button type="submit" disabled={isSubmitting}>Add paper</button>
            </Form>
            );
            return output;
        }}
        </Formik>

       
        </>
    );


}


export default ProjectForm;