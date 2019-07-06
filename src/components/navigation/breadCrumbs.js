import React, {useContext} from 'react';
import {Link, withRouter} from 'react-router-dom';

import {AppContext} from 'components/providers/appProvider';


const BreadCrumbs = function(props) {

    //get data from global context
    const appConsumer = useContext(AppContext);
    
    let bcPath = <></>;

    function createBreadCrumbs(){

        //I extract the location from the router
        const { location } = props;

        //I split the pathname by '/' and remove empty strings
        let path = location.pathname.split('/').filter(x => x);

        //will contain the partial url
        let href= "/";
        //will contain the link element
        let link;
        //array of JSX elements containing the links
        let bc = [];

        //I don't print ' > ' at the end if there's only one link
        if(path.length === 0){
            link = (<div key={0}></div>);
        }else{
            link = (<Link key={0} to={href}>Home<span> > </span></Link>);
        }

        //I push the initial breadcrumb (</> if we are in the home)
        bc.push(link);

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
                link = (<Link key={i+1} to={href}>{appConsumer.projectName}</Link>);
            }else if(path[i-1] && path[i-1] === "screenings"){
                //I retrieve the project title from the context
                link = (<Link key={i+1} to={href}>{appConsumer.projectName} screening</Link>);
            }else{
                switch (path[i]) {
                    case "projects":
                        link = (<Link key={i+1} to={href}>My Projects</Link>);
                        break;
                    case "screenings":
                        link = (<Link key={i+1} to={href}>My Screenings</Link>);
                        break;
                    case "searchsimilar":
                        link = (<Link key={i+1} to={href}>Search for similar papers</Link>);
                        break;
                    case "searchautomated":
                        link = (<Link key={i+1} to={href}>Intelligent papers search</Link>);
                        break;
                    case "search":
                        link = (<Link key={i+1} to={href}>Search</Link>);
                        break;
                    case "filters":
                        link = (<Link key={i+1} to={href}>Filters</Link>);
                        break;
                    case "screening":
                        link = (<Link key={i+1} to={href}>Screening</Link>);
                        break;
                    default:
                        link = (<Link key={i+1} to={href}>{path[i]}</Link>);
                        break;
                }
            }

            //I push the link into the list of breadcrumbs
            bc.push(link);

            //I put ' > ' at the end
            if(i < (path.length - 1)){
                bc.push(<span key={i+9999}>{" > "}</span>);
            }
            
        }
        return bc;

    }

    if(appConsumer.user){
        bcPath = createBreadCrumbs();
    }
    

    return (
        <div className="relative-header">
            <div className="breadcrumbs">{bcPath}</div>
        </div>
    );

}

export default withRouter(BreadCrumbs);
