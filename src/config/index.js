/**
 * this is the config file
 */


const config = {
    //"home": "https://crowdai-slr-api-dev.herokuapp.com/",
    "home": "http://localhost:3000/",
    "search": "search",
    "scopus_search": "search-scopus",
    "projects": "projects",
    "papers": "papers",
    "customPapers": "customPapers",
    "menu_list": [
        {id: 4, content: "home", link: "/"},
        {id: 5, content: "my projects", link: "/projects"},
        {id: 6, content: "account", link: "#"}
    ],
    "max_total_number_for_results": 5000,
    "pdf_parse_server": "pdf"




};

export default config;
