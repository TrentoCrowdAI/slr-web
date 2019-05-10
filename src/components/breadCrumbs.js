import React, {useContext} from 'react';
import {Link} from 'react-router-dom';

import {AppContext} from 'components/providers/appProvider';


const BreadCrumbs = function(props) {

    //I split the pathname by '/' and remove empty strings
    let path = props.location.pathname.split('/').filter(x => x);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //will contain the partial url
    let href= "/"; 
    //array of JSX elements containing the links
    let bc = [];

    //I don't print ' > ' at the end if there's only one link
    if(path.length === 0){
        bc.push(<> </>);
    }else{
        bc.push(<Link key={0} to={href}>home<span> > </span></Link>);
    }

    //I iterate over the paths taking care of links
    for(let i = 0; i < path.length; i++){

        //avoids the path '/' and the trailing slash
        if(href === "/"){
            href += path[i];//I update the partial url
        }else{
            href += ("/" + path[i]);//I update the partial url
        }
        
        //I check whether is the ID of a project 
        if(path[i-1] && path[i-1] === "projects"){
            //I retrieve the project title from the context
            bc.push(<Link key={i+1} to={href}>'{appConsumer.projectName}'</Link>);
        }else{
            bc.push(<Link key={i+1} to={href}>{path[i]}</Link>);
        }

        //I don't put ' > ' at the end
        if(i < (path.length - 1)){
            bc.push(<span key={i+9999}>{" > "}</span>);
        }
        
    }
    

    return (
        <div className="breadcrumbs">{bc}</div>
    );

}

export default BreadCrumbs;
