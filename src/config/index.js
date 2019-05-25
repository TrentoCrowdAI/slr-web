/**
 * this is the config file
 */


const config = {
    //"home": "https://crowdai-slr-api-dev.herokuapp.com/",
    "home": "http://localhost:3001/",
    "search": "search",
    "scopus_search": "search-scopus",
    "search_similar": "search/similar",
    "projects": "projects",
    "papers": "papers",
    "customPapers": "customPapers",
    "userLogin": "auth/login",
    "userInfo": "https://www.googleapis.com/oauth2/v3/tokeninfo",
    "userLogout": "auth/logout",
    "menu_list": [
        {id: 4, content: "Home", link: "/"},
        {id: 5, content: "My projects", link: "/projects"},
        {id: 6, content: "Account", link: "#"}
    ],
    "max_total_number_for_results": 5000,
    "pdf_parse_server": "pdf",
    "google_login_client_id": "282160526683-84sdnoqh3bc1obojfpepcbonnfg3uks4.apps.googleusercontent.com",





};

export default config;
